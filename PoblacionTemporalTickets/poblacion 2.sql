USE proyecto_basededatos;

-- A. Correcciones a la población temporal
-- El monto reembolsado siempre es lo que se pagó por ese boleto
UPDATE Devoluciones d
  JOIN DetalleOrden o ON o.IDDetalleOrden = d.IDDetalleOrden
   SET d.MontoReembolsado = o.Subtotal;

-- La devolución aprobada del boleto 20 se aplica: vuelve su cupo y el boleto se anula
UPDATE EventoxZonaPrecio SET CupoDisponible = CupoDisponible + 1 WHERE IDZonaPrecio = 11;
UPDATE Boletos SET IDEstadoBoleto = 4 WHERE IDBoleto = 20;            -- 4 = Anulado

-- B. Casos de prueba para Sofía (ID 4, usuario4@ejemplo.test, contraseña Prueba123, orden 1)
UPDATE Usuario
   SET PasswordEncriptado = '$2b$10$gm3n/NArxwQXf11JtPVbxe1mDFZCE9a3LGKXqgin3EvspJlXyoSHu'
 WHERE IDUsuario = 4;

-- Utilizado: el boleto VIP 4 ya entró al evento
UPDATE Boletos SET IDEstadoBoleto = 3 WHERE IDBoleto = 4;             -- 3 = Canjeado

-- Cancelado: devolución aprobada del boleto General 3 (con su cupo devuelto)
INSERT INTO Devoluciones (IDDetalleOrden, Motivo, MontoReembolsado, Estado)
SELECT IDDetalleOrden, 'Prueba de devolución aprobada', Subtotal, 2
  FROM DetalleOrden
 WHERE IDBoleto = 3;
UPDATE EventoxZonaPrecio SET CupoDisponible = CupoDisponible + 1 WHERE IDZonaPrecio = 3;
UPDATE Boletos SET IDEstadoBoleto = 4 WHERE IDBoleto = 3;

-- Acompañante: el boleto VIP 1 lleva un acompañante (consume cupo y se paga)
UPDATE Evento SET PermiteAcompanante = 1, MaxAcompanantes = 2 WHERE IDEvento = 1;
INSERT INTO Boletos (CodigoAlfanumerico, `EsAcompañante`, `NombreAcompañante`, `DNIAcompañante`, IDZonaPrecio, IDEstadoBoleto, IDBoletoTitular, IDEvento)
VALUES ('EV01TK006', 1, 'María López', '0801199912345', 1, 2, 1, 1);
INSERT INTO DetalleOrden (IDBoleto, IDTipoDescuento, IDOrden, MontoDescuento, Subtotal)
VALUES (LAST_INSERT_ID(), 1, 1, 0, 1200);
UPDATE EventoxZonaPrecio SET CupoDisponible = CupoDisponible - 1 WHERE IDZonaPrecio = 1;

-- Vencido: una compra de Sofía (ID 4) para un evento que ya pasó (inactivo, no sale en la cartelera)
INSERT INTO Evento (Titulo, Descripcion, RestriccionXEdad, Estado, Fecha, HoraInicio, HoraFin, IDRecinto, codVestimenta, RutaImagen, PermiteAcompanante, MaxAcompanantes)
VALUES ('Concierto de Otoño', 'Evento pasado para pruebas', 'Todo público', 2, '2026-10-10', '19:00:00', '22:00:00', 1, NULL, '/assets/poster prueba.jpg', 0, 0);
SET @evento = LAST_INSERT_ID();

INSERT INTO EventoxZonaPrecio (IDEvento, IDZonasRecinto, Precio, CupoDisponible)
VALUES (@evento, 3, 350, 2999);
SET @zona = LAST_INSERT_ID();

INSERT INTO Carrito (IDUsuario, FechaCreacion)
VALUES (4, '2026-10-01 10:00:00');
SET @carrito = LAST_INSERT_ID();

INSERT INTO Orden (IDUsuario, FechaCompra, IDEstadoOrden, IDCarrito)
VALUES (4, '2026-10-01 12:00:00', 2, @carrito);
SET @orden = LAST_INSERT_ID();

INSERT INTO Boletos (CodigoAlfanumerico, `EsAcompañante`, `NombreAcompañante`, `DNIAcompañante`, IDZonaPrecio, IDEstadoBoleto, IDBoletoTitular, IDEvento)
VALUES ('EVPRTK001', 0, NULL, NULL, @zona, 2, NULL, @evento);
INSERT INTO DetalleOrden (IDBoleto, IDTipoDescuento, IDOrden, MontoDescuento, Subtotal)
VALUES (LAST_INSERT_ID(), 1, @orden, 0, 350);

-- Comprobar lo que verá Sofía
SELECT IDOrden, NombreZona, CodigoAlfanumerico, EsAcompanante, Estado, EstadoDevolucion, PuedeDevolver
  FROM vw_MisBoletos
 WHERE IDUsuario = 4
 ORDER BY IDOrden, IDZonaPrecio, IDBoleto;