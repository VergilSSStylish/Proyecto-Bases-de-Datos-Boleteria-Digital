const conexion = require('../config/conexion');
const crypto = require('crypto');

//libera reservas vencidas
const limpiarReservasExpiradas = async (conn = conexion) => {
    const [expiradas] = await conn.query(`
        SELECT r.IDReserva, r.IDBoleto, b.IDZonaPrecio
        FROM Reserva r
        INNER JOIN Boletos b ON r.IDBoleto = b.IDBoleto
        WHERE r.Estado = 1 AND r.FechaExpiracion <= NOW()
    `);

    if (expiradas.length === 0) return;

    const idsReservas = expiradas.map(r => r.IDReserva);
    const idsBoletos = expiradas.map(r => r.IDBoleto);

    await conn.query(
        `UPDATE Reserva SET Estado = 0 WHERE IDReserva IN (?)`,
        [idsReservas]
    );

    await conn.query(
        `UPDATE Boletos SET IDEstadoBoleto = 4 WHERE IDBoleto IN (?) AND IDEstadoBoleto = 5`,
        [idsBoletos]
    );

    const conteoPorZona = {};
    for (const fila of expiradas) {
        conteoPorZona[fila.IDZonaPrecio] = (conteoPorZona[fila.IDZonaPrecio] || 0) + 1;
    }

    for (const [idZonaPrecio, cantidad] of Object.entries(conteoPorZona)) {
        await conn.query(
            `UPDATE EventoxZonaPrecio SET CupoDisponible = CupoDisponible + ? WHERE IDZonaPrecio = ?`,
            [cantidad, Number(idZonaPrecio)]
        );
    }
};

//obtiene o crea un carrito activo para el usuario
const obtenerOCrearCarritoActivo = async (conn, idUsuario) => {
    const [carritos] = await conn.query(`
        SELECT c.IDCarrito
        FROM Carrito c
        LEFT JOIN Orden o ON c.IDCarrito = o.IDCarrito AND o.IDEstadoOrden = 2
        WHERE c.IDUsuario = ? AND o.IDOrden IS NULL
        ORDER BY c.IDCarrito DESC
        LIMIT 1
    `, [idUsuario]);

    if (carritos.length > 0) {
        return carritos[0].IDCarrito;
    }

    const [nuevo] = await conn.query(
        `INSERT INTO Carrito (IDUsuario) VALUES (?)`,
        [idUsuario]
    );
    return nuevo.insertId;
};

//genera código alfanumérico único de hasta 20 caracteres
const generarCodigoBoleto = (idEvento) => {
    const prefijo = `EV${String(idEvento).padStart(2, '0')}`;
    const aleatorio = crypto.randomBytes(5).toString('hex').toUpperCase();
    return `${prefijo}-${aleatorio}`.slice(0, 20);
};

//reserva boletos desde la selección de entradas.html
const reservarEntradas = async (idUsuario, idEvento, items) => {
    const conn = await conexion.getConnection();
    try {
        await conn.beginTransaction();
        await limpiarReservasExpiradas(conn);

        const idCarrito = await obtenerOCrearCarritoActivo(conn, idUsuario);

        //si ya existían reservas activas en este carrito, las liberamos para reemplazar por la nueva selección
        // (o si prefieres acumular de varios eventos, comenta este bloque)
        const [reservasPrevias] = await conn.query(`
            SELECT r.IDReserva, r.IDBoleto, b.IDZonaPrecio
            FROM Reserva r
            INNER JOIN Boletos b ON r.IDBoleto = b.IDBoleto
            WHERE r.IDCarrito = ? AND r.Estado = 1 AND b.IDEvento = ?
        `, [idCarrito, idEvento]);

        if (reservasPrevias.length > 0) {
            await conn.query(
                `UPDATE Reserva SET Estado = 0 WHERE IDReserva IN (?)`,
                [reservasPrevias.map(r => r.IDReserva)]
            );
            await conn.query(
                `UPDATE Boletos SET IDEstadoBoleto = 4 WHERE IDBoleto IN (?)`,
                [reservasPrevias.map(r => r.IDBoleto)]
            );
            const devolver = {};
            for (const r of reservasPrevias) {
                devolver[r.IDZonaPrecio] = (devolver[r.IDZonaPrecio] || 0) + 1;
            }
            for (const [idZP, cant] of Object.entries(devolver)) {
                await conn.query(
                    `UPDATE EventoxZonaPrecio SET CupoDisponible = CupoDisponible + ? WHERE IDZonaPrecio = ?`,
                    [cant, Number(idZP)]
                );
            }
        }

        //verificar si está disponible y crear boletos y reservas por cada zona 
        for (const item of items) {
            const idZonaPrecio = Number(item.IDZonaPrecio);
            const cantidad = Number(item.cantidad);

            if (!Number.isInteger(idZonaPrecio) || !Number.isInteger(cantidad) || cantidad <= 0) {
                continue;
            }

            const [zonas] = await conn.query(`
                SELECT IDZonaPrecio, IDEvento, Precio, CupoDisponible
                FROM EventoxZonaPrecio
                WHERE IDZonaPrecio = ? AND IDEvento = ?
                FOR UPDATE
            `, [idZonaPrecio, idEvento]);

            if (zonas.length === 0) {
                throw new Error('Una de las localidades seleccionadas no existe.');
            }

            if (zonas[0].CupoDisponible < cantidad) {
                throw new Error(`Cupo insuficiente para la localidad seleccionada (disponibles: ${zonas[0].CupoDisponible}).`);
            }

            await conn.query(
                `UPDATE EventoxZonaPrecio SET CupoDisponible = CupoDisponible - ? WHERE IDZonaPrecio = ?`,
                [cantidad, idZonaPrecio]
            );

            for (let i = 0; i < cantidad; i++) {
                const codigo = generarCodigoBoleto(idEvento);
                //IDEstadoBoleto = 5 reservado
                const [resBoleto] = await conn.query(`
                    INSERT INTO Boletos (CodigoAlfanumerico, EsAcompañante, NombreAcompañante, DNIAcompañante, IDZonaPrecio, IDEstadoBoleto, IDBoletoTitular, IDEvento)
                    VALUES (?, 0, NULL, NULL, ?, 5, NULL, ?)
                `, [codigo, idZonaPrecio, idEvento]);

                await conn.query(`
                    INSERT INTO Reserva (FechaReserva, FechaExpiracion, Estado, IDCarrito, IDBoleto)
                    VALUES (NOW(), DATE_ADD(NOW(), INTERVAL 10 MINUTE), 1, ?, ?)
                `, [idCarrito, resBoleto.insertId]);
            }
        }

        await conn.commit();
        return idCarrito;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

//consulta los ítems del carrito activo del usuario, descuentos y tiempo restante
const obtenerCarritoUsuario = async (idUsuario) => {
    await limpiarReservasExpiradas();

    const [items] = await conexion.query(`
        SELECT 
            c.IDCarrito,
            e.IDEvento,
            e.Titulo AS NombreEvento,
            e.Fecha AS FechaEvento,
            e.HoraInicio,
            rec.NombreRecinto,
            ezp.IDZonaPrecio,
            zr.NombreZona,
            ezp.Precio AS PrecioUnitario,
            COUNT(r.IDReserva) AS Cantidad,
            SUM(ezp.Precio) AS Subtotal,
            MIN(r.FechaExpiracion) AS FechaExpiracion,
            GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(), MIN(r.FechaExpiracion))) AS SegundosRestantes
        FROM Carrito c
        INNER JOIN Reserva r ON c.IDCarrito = r.IDCarrito AND r.Estado = 1 AND r.FechaExpiracion > NOW()
        INNER JOIN Boletos b ON r.IDBoleto = b.IDBoleto AND b.IDEstadoBoleto = 5
        INNER JOIN EventoxZonaPrecio ezp ON b.IDZonaPrecio = ezp.IDZonaPrecio
        INNER JOIN ZonasRecinto zr ON ezp.IDZonasRecinto = zr.IDZonasRecinto
        INNER JOIN Evento e ON b.IDEvento = e.IDEvento
        INNER JOIN Recinto rec ON e.IDRecinto = rec.IDRecinto
        WHERE c.IDUsuario = ?
        GROUP BY c.IDCarrito, e.IDEvento, e.Titulo, e.Fecha, e.HoraInicio, rec.NombreRecinto, ezp.IDZonaPrecio, zr.NombreZona, ezp.Precio
        ORDER BY e.Fecha ASC, ezp.Precio DESC
    `, [idUsuario]);

    const [descuentos] = await conexion.query(`
        SELECT IDTipoDescuento, Nombre, Descuento
        FROM TipoDescuento
        ORDER BY IDTipoDescuento ASC
    `);

    const segundosRestantes = items.length > 0
        ? Math.min(...items.map(i => Number(i.SegundosRestantes)))
        : 0;

    return {
        items,
        descuentos,
        segundosRestantes
    };
};

//elimina una localidad cuando todos los boletos reservados de esa IDZonaPrecio están en el carrito activo
const eliminarLocalidadCarrito = async (idUsuario, idZonaPrecio) => {
    const conn = await conexion.getConnection();
    try {
        await conn.beginTransaction();

        const [reservas] = await conn.query(`
            SELECT r.IDReserva, r.IDBoleto
            FROM Reserva r
            INNER JOIN Carrito c ON r.IDCarrito = c.IDCarrito
            INNER JOIN Boletos b ON r.IDBoleto = b.IDBoleto
            WHERE c.IDUsuario = ? AND r.Estado = 1 AND b.IDZonaPrecio = ?
        `, [idUsuario, idZonaPrecio]);

        if (reservas.length === 0) {
            await conn.commit();
            return 0;
        }

        await conn.query(
            `UPDATE Reserva SET Estado = 0 WHERE IDReserva IN (?)`,
            [reservas.map(r => r.IDReserva)]
        );

        await conn.query(
            `UPDATE Boletos SET IDEstadoBoleto = 4 WHERE IDBoleto IN (?)`,
            [reservas.map(r => r.IDBoleto)]
        );

        await conn.query(
            `UPDATE EventoxZonaPrecio SET CupoDisponible = CupoDisponible + ? WHERE IDZonaPrecio = ?`,
            [reservas.length, idZonaPrecio]
        );

        await conn.commit();
        return reservas.length;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

//confirma la compra
const confirmarCompra = async (idUsuario, idTipoDescuento, idTarjeta) => {
    const conn = await conexion.getConnection();
    try {
        await conn.beginTransaction();
        await limpiarReservasExpiradas(conn);

        const [boletosReservados] = await conn.query(`
            SELECT 
                c.IDCarrito,
                r.IDReserva,
                b.IDBoleto,
                ezp.Precio
            FROM Carrito c
            INNER JOIN Reserva r ON c.IDCarrito = r.IDCarrito AND r.Estado = 1 AND r.FechaExpiracion > NOW()
            INNER JOIN Boletos b ON r.IDBoleto = b.IDBoleto AND b.IDEstadoBoleto = 5
            INNER JOIN EventoxZonaPrecio ezp ON b.IDZonaPrecio = ezp.IDZonaPrecio
            WHERE c.IDUsuario = ?
            FOR UPDATE
        `, [idUsuario]);

        if (boletosReservados.length === 0) {
            throw new Error('Tu reserva ha expirado o el carrito está vacío.');
        }

        // Validar descuento
        const [descRows] = await conn.query(
            `SELECT IDTipoDescuento, Descuento FROM TipoDescuento WHERE IDTipoDescuento = ?`,
            [idTipoDescuento || 1]
        );
        const tipoDesc = descRows.length > 0 ? descRows[0] : { IDTipoDescuento: 1, Descuento: 0 };
        const porcentajeDesc = Number(tipoDesc.Descuento) / 100;

        //validar tarjeta
        let tarjetaValidaId = null;
        let idMetodoPago = 1; // 1 = efectivo, 2 = tarjeta
        if (idTarjeta) {
            const [tarjetas] = await conn.query(
                `SELECT IDTarjeta FROM Tarjeta WHERE IDTarjeta = ? AND IDUsuario = ?`,
                [idTarjeta, idUsuario]
            );
            if (tarjetas.length === 0) {
                throw new Error('El método de pago seleccionado no es válido.');
            }
            tarjetaValidaId = tarjetas[0].IDTarjeta;
            idMetodoPago = 2; // 'Tarjeta'
        }

        const idCarrito = boletosReservados[0].IDCarrito;

        //crear orden
        const [resOrden] = await conn.query(`
            INSERT INTO Orden (IDUsuario, FechaCompra, IDEstadoOrden, IDCarrito)
            VALUES (?, NOW(), 2, ?)
        `, [idUsuario, idCarrito]);
        const idOrden = resOrden.insertId;

        //insertar detalleOrden por cada boleto y calcular monto total
        let totalOrden = 0;
        for (const boleto of boletosReservados) {
            const precio = Number(boleto.Precio);
            const montoDescuento = Number((precio * porcentajeDesc).toFixed(2));
            const subtotalLinea = Number((precio - montoDescuento).toFixed(2));
            totalOrden += subtotalLinea;

            await conn.query(`
                INSERT INTO DetalleOrden (IDBoleto, IDTipoDescuento, IDOrden, MontoDescuento, Subtotal)
                VALUES (?, ?, ?, ?, ?)
            `, [boleto.IDBoleto, tipoDesc.IDTipoDescuento, idOrden, montoDescuento, subtotalLinea]);
        }

        totalOrden = Number(totalOrden.toFixed(2));

        //registrar pago y detallePago
        const [resPago] = await conn.query(`
            INSERT INTO Pago (IDOrden, FechaPago, Monto, EstadoPago)
            VALUES (?, CURDATE(), ?, 1)
        `, [idOrden, totalOrden]);

        const referencia = `CBX-${Date.now()}-${idOrden}`;
        await conn.query(`
            INSERT INTO DetallePago (IDTarjeta, IDPago, IDMetodoPago, Monto, Referencia, FechaTransaccion)
            VALUES (?, ?, ?, ?, ?, NOW())
        `, [tarjetaValidaId, resPago.insertId, idMetodoPago, totalOrden, referencia]);

        //actualizar boletos a vendido y cerrar reservas
        const idsBoletos = boletosReservados.map(b => b.IDBoleto);
        const idsReservas = boletosReservados.map(r => r.IDReserva);

        await conn.query(`UPDATE Boletos SET IDEstadoBoleto = 2 WHERE IDBoleto IN (?)`, [idsBoletos]);
        await conn.query(`UPDATE Reserva SET Estado = 0 WHERE IDReserva IN (?)`, [idsReservas]);

        await conn.commit();
        return {
            idOrden,
            totalPagado: totalOrden,
            cantidadBoletos: idsBoletos.length,
            referencia
        };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

module.exports = {
    reservarEntradas,
    obtenerCarritoUsuario,
    eliminarLocalidadCarrito,
    confirmarCompra
};