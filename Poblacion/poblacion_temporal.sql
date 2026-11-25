-- POBLACION DE PRUEBA PARA Proyecto_basedeDatos
-- Ejecutar DESPUES de crear todas las tablas y sobre una base de datos vacia.
-- Datos ficticios. No usar datos de tarjetas ni credenciales reales.
USE Proyecto_basedeDatos;
SET NAMES utf8mb4;

INSERT INTO TipoUsuario (Nombre, Descripcion) VALUES
    ('Administrador', 'Administra la plataforma y sus catálogos'),
    ('Taquilla', 'Gestiona ventas presenciales'),
    ('Validador', 'Valida boletos en los accesos'),
    ('Cliente', 'Compra y consulta boletos');

INSERT INTO Departamentos (NombreDpt) VALUES
    ('Francisco Morazán'),
    ('Cortés'),
    ('Atlántida'),
    ('Comayagua'),
    ('Copán');

INSERT INTO Municipio (Nombre, IDDpto) VALUES
    ('Distrito Central', 1),
    ('Valle de Ángeles', 1),
    ('Santa Lucía', 1),
    ('San Pedro Sula', 2),
    ('Choloma', 2),
    ('Puerto Cortés', 2),
    ('La Ceiba', 3),
    ('Tela', 3),
    ('Comayagua', 4),
    ('Santa Rosa de Copán', 5);

INSERT INTO CategoriaEventos (Nombre, Descripcion) VALUES
    ('Música', 'Conciertos y presentaciones musicales'),
    ('Teatro', 'Obras y presentaciones escénicas'),
    ( 'Deportes', 'Competencias deportivas'),
    ( 'Comedia', 'Espectáculos de humor'),
    ( 'Familiar', 'Actividades para toda la familia'),
    ( 'Cultura', 'Actividades culturales'),
    ( 'Danza', 'Presentaciones de danza'),
    ( 'Conferencia', 'Charlas y encuentros');
 
INSERT INTO ZonasRecinto (NombreZona, Detalles, RutaImagen, Estado) VALUES
    ( 'VIP', 'Asientos preferenciales cercanos al escenario', '/img/zonas/vip.jpg', 1),
    ( 'Preferencial', 'Zona intermedia con buena visibilidad', '/img/zonas/preferencial.jpg', 1),
    ('General', 'Acceso general', '/img/zonas/general.jpg', 1);

INSERT INTO EstadoBoleto ( NombreEstado) VALUES
    ('Disponible'),
    ('Vendido'),
    ('Canjeado'),
    ('Anulado'),
    ('Reservado');

INSERT INTO EstadoOrden (Nombre) VALUES
    ('Pendiente'),
    ('Pagado'),
    ('Cancelado'),
    ('Reembolsado');

INSERT INTO MetodoPago (Nombre, Descripcion) VALUES
    ('Efectivo', 'Pago en efectivo'),
    ( 'Tarjeta', 'Tarjeta de crédito o débito'),
    ( 'Transferencia', 'Transferencia bancaria');

INSERT INTO TiposTarjetas (NombreTipo, Descripcion) VALUES
    ('Visa', 'Tarjeta de prueba Visa'),
    ('Mastercard', 'Tarjeta de prueba Mastercard');

INSERT INTO ConfiguracionEdades (NombreRango, EdadMinima, EdadMaxima) VALUES
    ( 'Todo público', 0, NULL),
    ('Mayores de 12', 12, NULL),
    ('Mayores de 18', 18, NULL),
    ('Tercera Edad',60,79),
    ('Cuarta Edad',80,NULL);
SELECT * from tipodescuento;
INSERT INTO TipoDescuento (Nombre, Descuento, IdConfiguracionEdades) VALUES
    ('Sin descuento', 0.0, 1),
    ('Estudiante', 10.0, 1),
    ('Adulto mayor - Tercera Edad', 25.0, 4),
    ('Adulto mayor - Cuarta Edad',35.0,5),
    ('Promoción especial', 5.0, 1);

INSERT INTO Usuario (PNombre, SNombre, PApellido, SApellido, Telefono, Correo, FechaNac, Genero, RTN, FechaReg, PasswordEncriptado, IDRol, IDTipoUsuario) VALUES
    ('Ana', NULL, 'López', 'Hernández', '999100001', 'usuario1@ejemplo.test', '1992-02-15', 'F', NULL, '2026-02-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 1),
    ('Carlos', NULL, 'Méndez', 'García', '999100002', 'usuario2@ejemplo.test', '1993-03-15', 'M', NULL, '2026-03-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 2),
    ('María', NULL, 'Pineda', 'Hernández', '999100003', 'usuario3@ejemplo.test', '1994-04-15', 'F', NULL, '2026-04-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 3),
    ( 'Sofía', NULL, 'Reyes', 'García', '999100004', 'usuario4@ejemplo.test', '1995-05-15', 'M', NULL, '2026-05-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4),
    ('Daniel', NULL, 'Castillo', 'Hernández', '999100005', 'usuario5@ejemplo.test', '1996-06-15', 'F', NULL, '2026-06-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4),
    ( 'Valeria', NULL, 'Flores', 'García', '999100006', 'usuario6@ejemplo.test', '1997-07-15', 'M', NULL, '2026-07-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4),
    ( 'José', NULL, 'Mejía', 'Hernández', '999100007', 'usuario7@ejemplo.test', '1998-08-15', 'F', NULL, '2026-08-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4),
    ( 'Camila', NULL, 'Cruz', 'García', '999100008', 'usuario8@ejemplo.test', '1999-09-15', 'M', NULL, '2026-09-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4),
    ('Andrés', NULL, 'Rivera', 'Hernández', '999100009', 'usuario9@ejemplo.test', '1991-01-15', 'F', NULL, '2026-10-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4),
    ( 'Lucía', NULL, 'Paz', 'García', '999100010', 'usuario10@ejemplo.test', '1992-02-15', 'M', NULL, '2026-11-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4),
    ( 'Mateo', NULL, 'Molina', 'Hernández', '999100011', 'usuario11@ejemplo.test', '1993-03-15', 'F', NULL, '2026-01-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4),
    ( 'Isabella', NULL, 'Vargas', 'García', '999100012', 'usuario12@ejemplo.test', '1994-04-15', 'M', NULL, '2026-02-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4),
    ( 'David', NULL, 'Díaz', 'Hernández', '999100013', 'usuario13@ejemplo.test', '1995-05-15', 'F', NULL, '2026-03-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4),
    ( 'Gabriela', NULL, 'Ramos', 'García', '999100014', 'usuario14@ejemplo.test', '1996-06-15', 'M', NULL, '2026-04-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4),
    ( 'Samuel', NULL, 'Aguilar', 'Hernández', '999100015', 'usuario15@ejemplo.test', '1997-07-15', 'F', NULL, '2026-05-01', 'HASH_DE_PRUEBA_NO_VALIDO', 1, 4);
select * from usuario;
INSERT INTO Direccion (Colonia, Calle, Referencia, RutaImagen, IDMunicipio) VALUES
    ('Colonia Palmira', 'Avenida República', 'Frente a la plaza', NULL, 1),
    ('Colonia Kennedy', 'Boulevard Kennedy', 'Cerca del mercado', NULL, 1),
    ('Residencial El Trapiche', 'Calle principal', 'A 200 metros del parque', NULL, 1),
    ( 'Barrio Río de Piedras', 'Avenida Circunvalación', 'Frente al centro comercial', NULL, 4),
    ( 'Colonia Trejo', '15 calle', 'A un costado del estadio', NULL, 4),
    ('Barrio La Isla', 'Avenida San Isidro', 'Cerca del muelle', NULL, 7),
    ('Barrio El Centro', 'Calle del comercio', 'Frente a la municipalidad', NULL, 9),
    ('Barrio El Calvario', 'Avenida Central', 'Cerca del parque central', NULL, 10),
    ( 'Colonia Cangrejal', 'Carretera principal', 'Entrada a la ciudad', NULL, 7),
    ( 'Colonia Suyapa', 'Calle universitaria', 'Frente a la universidad', NULL, 1),
    ( 'Barrio Medina', 'Tercera avenida', 'Cerca del parque', NULL, 4),
    ( 'Barrio El Centro', 'Calle principal', 'A una cuadra de la plaza', NULL, 8),
    ( 'Colonia Las Minitas', 'Boulevard Los Próceres', 'Cerca de la rotonda', NULL, 1),
    ( 'Barrio Abajo', 'Avenida Cervantes', 'Frente al museo', NULL, 1),
    ( 'Colonia Satélite', 'Salida al norte', 'Cerca de la terminal', NULL, 4);

INSERT INTO Empresa ( Nombre, RazonSocial, RTNEmpresa, IDDireccion, Telefono_Empresa, Correo_Empresa) VALUES
    ('Eventos Honduras', 'Eventos Honduras S. de R.L.', '08011999123456', 1, '22340001', 'contacto@eventoshonduras.test');
SELECT * from recinto;
INSERT INTO Recinto ( IDDireccion, NombreRecinto, CapacidadTotal, Estado) VALUES
    (2, 'Arena Central', 5000, 1),
    (4, 'Centro de Eventos del Norte', 3500, 1),
    (6, 'Anfiteatro del Caribe', 2200, 1),
    (7, 'Polideportivo Comayagua', 4000, 1),
    (8, 'Teatro Copán', 900, 1);

INSERT INTO ConfiguracionSAR ( IDMunicipio, IDEmpresa, CAI, TipoDocumento, CodigoDocumento, PuntoEmision, RangoInicial, RangoFinal, CorrelativoActual, FechaLimiteEmision, FechaAutorizacion, Activo) VALUES
    ( 1, 1, 'CAI-2026-0000000000000000000000000000', 'Factura', '01', '001', 1, 99999999999999, 1, '2027-12-31', '2026-01-15', 1);

INSERT INTO AsignacionCapacidad ( CapacidadAsignada, IDRecinto, IDZonasRecinto) VALUES
    ( 500, 1, 1),
    ( 1500, 1, 2),
    ( 3000, 1, 3),
    (350, 2, 1),
    (1050, 2, 2),
    (2100, 2, 3),
    (220, 3, 1),
    ( 660, 3, 2),
    ( 1320, 3, 3),
    ( 400, 4, 1),
    ( 1200, 4, 2),
    ( 2400, 4, 3),
    ( 90, 5, 1),
    ( 270, 5, 2),
    ( 540, 5, 3);

INSERT INTO Evento ( Titulo, Descripcion, RestriccionXEdad, Estado, Fecha, HoraInicio, HoraFin, IDRecinto, codVestimenta, RutaImagen, PermiteAcompanante, MaxAcompanantes) VALUES
    ( 'Festival de Verano', 'Música en vivo y artistas invitados', 'Todo público', 1, '2026-12-12', '18:00:00', '22:00:00', 1, NULL, '/img/eventos/evento1.jpg', 0, 0),
    ( 'Noche de Rock', 'Concierto de bandas nacionales', 'Todo público', 1, '2026-12-19', '18:00:00', '22:00:00', 1, NULL, '/img/eventos/evento2.jpg', 0, 0),
    ('Concierto Sinfónico', 'Presentación de orquesta', 'Mayores de 18', 1, '2026-12-26', '18:00:00', '22:00:00', 1, NULL, '/img/eventos/evento3.jpg', 0, 0),
    ( 'Feria Familiar', 'Actividades recreativas para familias', 'Todo público', 1, '2027-01-02', '18:00:00', '22:00:00', 2, NULL, '/img/eventos/evento4.jpg', 0, 0),
    ( 'Campeonato de Baloncesto', 'Jornada deportiva regional', 'Todo público', 1, '2027-01-09', '18:00:00', '22:00:00', 2, NULL, '/img/eventos/evento5.jpg', 0, 0),
    ( 'Festival de Comedia', 'Noche de humor', 'Mayores de 18', 1, '2027-01-16', '18:00:00', '22:00:00', 2, NULL, '/img/eventos/evento6.jpg', 0, 0),
    ( 'Danza de Honduras', 'Presentación de danza tradicional', 'Todo público', 1, '2027-01-23', '18:00:00', '22:00:00', 3, NULL, '/img/eventos/evento7.jpg', 0, 0),
    ('Encuentro Cultural', 'Muestra de arte y cultura', 'Todo público', 1, '2027-01-30', '18:00:00', '22:00:00', 3, NULL, '/img/eventos/evento8.jpg', 0, 0),
    ( 'Concierto Caribeño', 'Ritmos del Caribe', 'Mayores de 18', 1, '2027-02-06', '18:00:00', '22:00:00', 3, NULL, '/img/eventos/evento9.jpg', 0, 0),
    ( 'Copa de la Ciudad', 'Torneo deportivo', 'Todo público', 1, '2027-02-13', '18:00:00', '22:00:00', 4, NULL, '/img/eventos/evento10.jpg', 0, 0),
    ( 'Teatro en Escena', 'Obra teatral contemporánea', 'Todo público', 1, '2027-02-20', '18:00:00', '22:00:00', 5, NULL, '/img/eventos/evento11.jpg', 0, 0),
    ( 'Concierto Acústico', 'Presentación musical acústica', 'Mayores de 18', 1, '2027-02-27', '18:00:00', '22:00:00', 5, NULL, '/img/eventos/evento12.jpg', 0, 0),
    ( 'Charlas de Innovación', 'Conferencias y tecnología', 'Todo público', 1, '2027-03-06', '18:00:00', '22:00:00', 4, NULL, '/img/eventos/evento13.jpg', 0, 0),
    ('Festival de la Juventud', 'Música y actividades juveniles', 'Todo público', 1, '2027-03-13', '18:00:00', '22:00:00', 1, NULL, '/img/eventos/evento14.jpg', 0, 0),
    ( 'Noche de Boleros', 'Concierto de música romántica', 'Mayores de 18', 1, '2027-03-20', '18:00:00', '22:00:00', 5, NULL, '/img/eventos/evento15.jpg', 0, 0);

INSERT INTO DetalleCategoria (IDCategoriaEventos, IDEvento) VALUES
    ( 1, 1),
    ( 1, 2),
    ( 1, 3),
    ( 5, 3),
    ( 2, 4),
    ( 3, 5),
    ( 8, 5),
    ( 4, 6),
    ( 5, 6),
    ( 7, 7),
    ( 6, 8),
    ( 1, 9),
    ( 5, 9),
    ( 3, 10),
    ( 8, 10),
    ( 2, 11),
    ( 1, 12),
    ( 5, 12),
    ( 8, 13),
    ( 5, 14),
    (1, 15),
    ( 5, 15),
    ( 8, 15);

INSERT INTO EventoxZonaPrecio (IDEvento, IDZonasRecinto, Precio, CupoDisponible) VALUES
    (1, 1, 1200, 498),
    (1, 2, 750, 1498),
    (1, 3, 350, 2999),
    (2, 1, 1200, 498),
    (2, 2, 750, 1498),
    (2, 3, 350, 2999),
    (3, 1, 1200, 498),
    ( 3, 2, 750, 1498),
    ( 3, 3, 350, 2999),
    ( 4, 1, 1200, 348),
    ( 4, 2, 750, 1048),
    ( 4, 3, 350, 2099),
    ( 5, 1, 1200, 348),
    ( 5, 2, 750, 1048),
    ( 5, 3, 350, 2099),
    ( 6, 1, 1200, 348),
    ( 6, 2, 750, 1048),
    ( 6, 3, 350, 2099),
    ( 7, 1, 1200, 218),
    ( 7, 2, 750, 658),
    ( 7, 3, 350, 1319),
    ( 8, 1, 1200, 218),
    ( 8, 2, 750, 658),
    ( 8, 3, 350, 1319),
    ( 9, 1, 1200, 218),
    ( 9, 2, 750, 658),
    ( 9, 3, 350, 1319),
    ( 10, 1, 1200, 398),
    (10, 2, 750, 1198),
    ( 10, 3, 350, 2399),
    ( 11, 1, 1200, 88),
    ( 11, 2, 750, 268),
    ( 11, 3, 350, 539),
    ( 12, 1, 1200, 88),
    ( 12, 2, 750, 268),
    ( 12, 3, 350, 539),
    ( 13, 1, 1200, 400),
    ( 13, 2, 750, 1200),
    ( 13, 3, 350, 2400),
    ( 14, 1, 1200, 500),
    ( 14, 2, 750, 1500),
    ( 14, 3, 350, 3000),
    ( 15, 1, 1200, 90),
    ( 15, 2, 750, 270),
    ( 15, 3, 350, 540);

INSERT INTO Carrito ( IDUsuario, FechaCreacion) VALUES
    (4, '2026-02-01 10:00:00'),
    ( 5, '2026-03-01 10:00:00'),
    (6, '2026-04-01 10:00:00'),
    ( 7, '2026-05-01 10:00:00'),
    ( 8, '2026-06-01 10:00:00'),
    ( 9, '2026-07-01 10:00:00'),
    (10, '2026-08-01 10:00:00'),
    (11, '2026-09-01 10:00:00'),
    (12, '2026-10-01 10:00:00'),
    ( 13, '2026-11-01 10:00:00'),
    ( 14, '2026-01-01 10:00:00'),
    ( 15, '2026-02-01 10:00:00');

INSERT INTO Orden (IDUsuario, FechaCompra, IDEstadoOrden, IDCarrito) VALUES
    ( 4, '2026-02-02 12:00:00', 2, 1),
    ( 5, '2026-03-02 12:00:00', 2, 2),
    ( 6, '2026-04-02 12:00:00', 2, 3),
    ( 7, '2026-05-02 12:00:00', 2, 4),
    ( 8, '2026-06-02 12:00:00', 2, 5),
    ( 9, '2026-07-02 12:00:00', 2, 6),
    ( 10, '2026-08-02 12:00:00', 2, 7),
    ( 11, '2026-09-02 12:00:00', 2, 8),
    ( 12, '2026-10-02 12:00:00', 2, 9),
    ( 13, '2026-11-02 12:00:00', 2, 10),
    ( 14, '2026-01-02 12:00:00', 2, 11),
    ( 15, '2026-02-02 12:00:00', 2, 12);

INSERT INTO Tarjeta ( PAN, NombreTitular, CVV, FechaExp, IDTiposTarjetas, IDUsuario) VALUES
    ('4111111111110001', 'CLIENTE PRUEBA 01', '000', '2030-12-31', 1, 4),
    ( '4111111111110002', 'CLIENTE PRUEBA 02', '000', '2030-12-31', 1, 5),
    ( '4111111111110003', 'CLIENTE PRUEBA 03', '000', '2030-12-31', 1, 6),
    ( '4111111111110004', 'CLIENTE PRUEBA 04', '000', '2030-12-31', 1, 7),
    ( '4111111111110005', 'CLIENTE PRUEBA 05', '000', '2030-12-31', 1, 8),
    ( '4111111111110006', 'CLIENTE PRUEBA 06', '000', '2030-12-31', 1, 9),
    ( '4111111111110007', 'CLIENTE PRUEBA 07', '000', '2030-12-31', 1, 10),
    ( '4111111111110008', 'CLIENTE PRUEBA 08', '000', '2030-12-31', 1, 11),
    ( '4111111111110009', 'CLIENTE PRUEBA 09', '000', '2030-12-31', 1, 12),
    ( '4111111111110010', 'CLIENTE PRUEBA 10', '000', '2030-12-31', 1, 13),
    ( '4111111111110011', 'CLIENTE PRUEBA 11', '000', '2030-12-31', 1, 14),
    ('4111111111110012', 'CLIENTE PRUEBA 12', '000', '2030-12-31', 1, 15);

INSERT INTO Boletos (CodigoAlfanumerico, EsAcompañante, NombreAcompañante, DNIAcompañante, IDZonaPrecio, IDEstadoBoleto, IDBoletoTitular, IDEvento) VALUES
    ('EV01TK001', 0, NULL, NULL, 1, 2, NULL, 1),
    ('EV01TK002', 0, NULL, NULL, 2, 2, NULL, 1),
    ( 'EV01TK003', 0, NULL, NULL, 3, 2, NULL, 1),
    ('EV01TK004', 0, NULL, NULL, 1, 2, NULL, 1),
    ('EV01TK005', 0, NULL, NULL, 2, 2, NULL, 1),
    ('EV02TK001', 0, NULL, NULL, 4, 2, NULL, 2),
    ('EV02TK002', 0, NULL, NULL, 5, 2, NULL, 2),
    ('EV02TK003', 0, NULL, NULL, 6, 2, NULL, 2),
    ('EV02TK004', 0, NULL, NULL, 4, 2, NULL, 2),
    ( 'EV02TK005', 0, NULL, NULL, 5, 2, NULL, 2),
    ( 'EV03TK001', 0, NULL, NULL, 7, 2, NULL, 3),
    ( 'EV03TK002', 0, NULL, NULL, 8, 2, NULL, 3),
    ( 'EV03TK003', 0, NULL, NULL, 9, 2, NULL, 3),
    ( 'EV03TK004', 0, NULL, NULL, 7, 2, NULL, 3),
    ( 'EV03TK005', 0, NULL, NULL, 8, 2, NULL, 3),
    ( 'EV04TK001', 0, NULL, NULL, 10, 2, NULL, 4),
    ( 'EV04TK002', 0, NULL, NULL, 11, 2, NULL, 4),
    ( 'EV04TK003', 0, NULL, NULL, 12, 2, NULL, 4),
    ( 'EV04TK004', 0, NULL, NULL, 10, 2, NULL, 4),
    ( 'EV04TK005', 0, NULL, NULL, 11, 2, NULL, 4),
    ( 'EV05TK001', 0, NULL, NULL, 13, 2, NULL, 5),
    ('EV05TK002', 0, NULL, NULL, 14, 2, NULL, 5),
    ( 'EV05TK003', 0, NULL, NULL, 15, 2, NULL, 5),
    ( 'EV05TK004', 0, NULL, NULL, 13, 2, NULL, 5),
    ( 'EV05TK005', 0, NULL, NULL, 14, 2, NULL, 5),
     ('EV06TK001', 0, NULL, NULL, 16, 2, NULL, 6),
    ( 'EV06TK002', 0, NULL, NULL, 17, 2, NULL, 6),
    ( 'EV06TK003', 0, NULL, NULL, 18, 2, NULL, 6),
    ( 'EV06TK004', 0, NULL, NULL, 16, 2, NULL, 6),
    ( 'EV06TK005', 0, NULL, NULL, 17, 2, NULL, 6),
    ( 'EV07TK001', 0, NULL, NULL, 19, 2, NULL, 7),
    ( 'EV07TK002', 0, NULL, NULL, 20, 2, NULL, 7),
    ( 'EV07TK003', 0, NULL, NULL, 21, 2, NULL, 7),
    ( 'EV07TK004', 0, NULL, NULL, 19, 2, NULL, 7),
    ( 'EV07TK005', 0, NULL, NULL, 20, 2, NULL, 7),
    ( 'EV08TK001', 0, NULL, NULL, 22, 2, NULL, 8),
    ( 'EV08TK002', 0, NULL, NULL, 23, 2, NULL, 8),
    ( 'EV08TK003', 0, NULL, NULL, 24, 2, NULL, 8),
    ( 'EV08TK004', 0, NULL, NULL, 22, 2, NULL, 8),
    ( 'EV08TK005', 0, NULL, NULL, 23, 2, NULL, 8),
    ( 'EV09TK001', 0, NULL, NULL, 25, 2, NULL, 9),
    ( 'EV09TK002', 0, NULL, NULL, 26, 2, NULL, 9),
    ( 'EV09TK003', 0, NULL, NULL, 27, 2, NULL, 9),
    ( 'EV09TK004', 0, NULL, NULL, 25, 2, NULL, 9),
    ( 'EV09TK005', 0, NULL, NULL, 26, 2, NULL, 9),
    ( 'EV10TK001', 0, NULL, NULL, 28, 2, NULL, 10),
    ('EV10TK002', 0, NULL, NULL, 29, 2, NULL, 10),
    ( 'EV10TK003', 0, NULL, NULL, 30, 2, NULL, 10),
    ('EV10TK004', 0, NULL, NULL, 28, 2, NULL, 10),
    ( 'EV10TK005', 0, NULL, NULL, 29, 2, NULL, 10),
    ( 'EV11TK001', 0, NULL, NULL, 31, 2, NULL, 11),
    ( 'EV11TK002', 0, NULL, NULL, 32, 2, NULL, 11),
    ( 'EV11TK003', 0, NULL, NULL, 33, 2, NULL, 11),
    ( 'EV11TK004', 0, NULL, NULL, 31, 2, NULL, 11),
    ( 'EV11TK005', 0, NULL, NULL, 32, 2, NULL, 11),
    ( 'EV12TK001', 0, NULL, NULL, 34, 2, NULL, 12),
    ( 'EV12TK002', 0, NULL, NULL, 35, 2, NULL, 12),
    ( 'EV12TK003', 0, NULL, NULL, 36, 2, NULL, 12),
    ( 'EV12TK004', 0, NULL, NULL, 34, 2, NULL, 12),
    ( 'EV12TK005', 0, NULL, NULL, 35, 2, NULL, 12);

INSERT INTO Reserva (FechaReserva, FechaExpiracion, Estado, IDCarrito, IDBoleto) VALUES
    ( '2026-02-01 10:05:00', '2026-02-03 10:05:00', 1, 1, 1),
    ('2026-02-01 10:05:00', '2026-02-03 10:05:00', 1, 1, 2),
    ( '2026-02-01 10:05:00', '2026-02-03 10:05:00', 1, 1, 3),
    ('2026-02-01 10:05:00', '2026-02-03 10:05:00', 1, 1, 4),
    ('2026-02-01 10:05:00', '2026-02-03 10:05:00', 1, 1, 5),
    ('2026-03-01 10:05:00', '2026-03-03 10:05:00', 1, 2, 6),
    ('2026-03-01 10:05:00', '2026-03-03 10:05:00', 1, 2, 7),
    ('2026-03-01 10:05:00', '2026-03-03 10:05:00', 1, 2, 8),
    ('2026-03-01 10:05:00', '2026-03-03 10:05:00', 1, 2, 9),
    ( '2026-03-01 10:05:00', '2026-03-03 10:05:00', 1, 2, 10),
    ( '2026-04-01 10:05:00', '2026-04-03 10:05:00', 1, 3, 11),
    ( '2026-04-01 10:05:00', '2026-04-03 10:05:00', 1, 3, 12),
    ( '2026-04-01 10:05:00', '2026-04-03 10:05:00', 1, 3, 13),
    ( '2026-04-01 10:05:00', '2026-04-03 10:05:00', 1, 3, 14),
    ( '2026-04-01 10:05:00', '2026-04-03 10:05:00', 1, 3, 15),
    ( '2026-05-01 10:05:00', '2026-05-03 10:05:00', 1, 4, 16),
    ( '2026-05-01 10:05:00', '2026-05-03 10:05:00', 1, 4, 17),
    ( '2026-05-01 10:05:00', '2026-05-03 10:05:00', 1, 4, 18),
    ( '2026-05-01 10:05:00', '2026-05-03 10:05:00', 1, 4, 19),
    ( '2026-05-01 10:05:00', '2026-05-03 10:05:00', 1, 4, 20),
    ( '2026-06-01 10:05:00', '2026-06-03 10:05:00', 1, 5, 21),
    ( '2026-06-01 10:05:00', '2026-06-03 10:05:00', 1, 5, 22),
    ( '2026-06-01 10:05:00', '2026-06-03 10:05:00', 1, 5, 23),
    ( '2026-06-01 10:05:00', '2026-06-03 10:05:00', 1, 5, 24),
    ( '2026-06-01 10:05:00', '2026-06-03 10:05:00', 1, 5, 25),
    ( '2026-07-01 10:05:00', '2026-07-03 10:05:00', 1, 6, 26),
    ( '2026-07-01 10:05:00', '2026-07-03 10:05:00', 1, 6, 27),
    ( '2026-07-01 10:05:00', '2026-07-03 10:05:00', 1, 6, 28),
    ( '2026-07-01 10:05:00', '2026-07-03 10:05:00', 1, 6, 29),
    ( '2026-07-01 10:05:00', '2026-07-03 10:05:00', 1, 6, 30),
    ('2026-08-01 10:05:00', '2026-08-03 10:05:00', 1, 7, 31),
    ( '2026-08-01 10:05:00', '2026-08-03 10:05:00', 1, 7, 32),
    ( '2026-08-01 10:05:00', '2026-08-03 10:05:00', 1, 7, 33),
    ( '2026-08-01 10:05:00', '2026-08-03 10:05:00', 1, 7, 34),
    ( '2026-08-01 10:05:00', '2026-08-03 10:05:00', 1, 7, 35),
    ( '2026-09-01 10:05:00', '2026-09-03 10:05:00', 1, 8, 36),
    ( '2026-09-01 10:05:00', '2026-09-03 10:05:00', 1, 8, 37),
    ( '2026-09-01 10:05:00', '2026-09-03 10:05:00', 1, 8, 38),
    ( '2026-09-01 10:05:00', '2026-09-03 10:05:00', 1, 8, 39),
    ( '2026-09-01 10:05:00', '2026-09-03 10:05:00', 1, 8, 40),
    ( '2026-10-01 10:05:00', '2026-10-03 10:05:00', 1, 9, 41),
    ( '2026-10-01 10:05:00', '2026-10-03 10:05:00', 1, 9, 42),
    ( '2026-10-01 10:05:00', '2026-10-03 10:05:00', 1, 9, 43),
    ( '2026-10-01 10:05:00', '2026-10-03 10:05:00', 1, 9, 44),
    ( '2026-10-01 10:05:00', '2026-10-03 10:05:00', 1, 9, 45),
    ( '2026-11-01 10:05:00', '2026-11-03 10:05:00', 1, 10, 46),
    ( '2026-11-01 10:05:00', '2026-11-03 10:05:00', 1, 10, 47),
    ('2026-11-01 10:05:00', '2026-11-03 10:05:00', 1, 10, 48),
    ( '2026-11-01 10:05:00', '2026-11-03 10:05:00', 1, 10, 49),
    ( '2026-11-01 10:05:00', '2026-11-03 10:05:00', 1, 10, 50),
    ( '2026-01-01 10:05:00', '2026-01-03 10:05:00', 1, 11, 51),
    ( '2026-01-01 10:05:00', '2026-01-03 10:05:00', 1, 11, 52),
    ( '2026-01-01 10:05:00', '2026-01-03 10:05:00', 1, 11, 53),
    ( '2026-01-01 10:05:00', '2026-01-03 10:05:00', 1, 11, 54),
    ( '2026-01-01 10:05:00', '2026-01-03 10:05:00', 1, 11, 55),
    ( '2026-02-01 10:05:00', '2026-02-03 10:05:00', 1, 12, 56),
    ( '2026-02-01 10:05:00', '2026-02-03 10:05:00', 1, 12, 57),
    ( '2026-02-01 10:05:00', '2026-02-03 10:05:00', 1, 12, 58),
    ( '2026-02-01 10:05:00', '2026-02-03 10:05:00', 1, 12, 59),
    ( '2026-02-01 10:05:00', '2026-02-03 10:05:00', 1, 12, 60);

INSERT INTO DetalleOrden ( IDBoleto, IDTipoDescuento, IDOrden, MontoDescuento, Subtotal) VALUES
    ( 1, 1, 1, 0, 1200),
    ( 2, 1, 1, 0, 750),
    ( 3, 1, 1, 0, 350),
    ( 4, 1, 1, 0, 1200),
    ( 5, 2, 1, 75.0, 675.0),
    ( 6, 1, 2, 0, 1200),
    ( 7, 1, 2, 0, 750),
    ( 8, 1, 2, 0, 350),
    ( 9, 1, 2, 0, 1200),
    ( 10, 2, 2, 75.0, 675.0),
    ( 11, 1, 3, 0, 1200),
    ( 12, 1, 3, 0, 750),
    ( 13, 1, 3, 0, 350),
    ( 14, 1, 3, 0, 1200),
    ( 15, 2, 3, 75.0, 675.0),
    ( 16, 1, 4, 0, 1200),
    ( 17, 1, 4, 0, 750),
    ( 18, 1, 4, 0, 350),
    ( 19, 1, 4, 0, 1200),
    ( 20, 2, 4, 75.0, 675.0),
    ( 21, 1, 5, 0, 1200),
    ( 22, 1, 5, 0, 750),
    ( 23, 1, 5, 0, 350),
    ( 24, 1, 5, 0, 1200),
    ( 25, 2, 5, 75.0, 675.0),
    ( 26, 1, 6, 0, 1200),
    ( 27, 1, 6, 0, 750),
    ( 28, 1, 6, 0, 350),
    ( 29, 1, 6, 0, 1200),
    ( 30, 2, 6, 75.0, 675.0),
    ( 31, 1, 7, 0, 1200),
    ( 32, 1, 7, 0, 750),
    ( 33, 1, 7, 0, 350),
    ( 34, 1, 7, 0, 1200),
    ( 35, 2, 7, 75.0, 675.0),
    ( 36, 1, 8, 0, 1200),
    ( 37, 1, 8, 0, 750),
    ( 38, 1, 8, 0, 350),
    ( 39, 1, 8, 0, 1200),
    ( 40, 2, 8, 75.0, 675.0),
    ( 41, 1, 9, 0, 1200),
    ( 42, 1, 9, 0, 750),
    ( 43, 1, 9, 0, 350),
    ( 44, 1, 9, 0, 1200),
    ( 45, 2, 9, 75.0, 675.0),
    ( 46, 1, 10, 0, 1200),
    ( 47, 1, 10, 0, 750),
    ( 48, 1, 10, 0, 350),
    ( 49, 1, 10, 0, 1200),
    ( 50, 2, 10, 75.0, 675.0),
    ( 51, 1, 11, 0, 1200),
    ( 52, 1, 11, 0, 750),
    (53, 1, 11, 0, 350),
    ( 54, 1, 11, 0, 1200),
    ( 55, 2, 11, 75.0, 675.0),
    ( 56, 1, 12, 0, 1200),
    ( 57, 1, 12, 0, 750),
    ( 58, 1, 12, 0, 350),
    ( 59, 1, 12, 0, 1200),
    ( 60, 2, 12, 75.0, 675.0);
   
-- SELECT * from detalleorden;
 -- SET FOREIGN_KEY_CHECKS = 0;
 -- TRUNCATE TABLE DetalleOrden; --
-- SET FOREIGN_KEY_CHECKS = 1; --
INSERT INTO Pago ( IDOrden, FechaPago, Monto, EstadoPago) VALUES
    ( 1, '2026-02-02', 4175.0, 1),
    ( 2, '2026-03-02', 4175.0, 1),
    ( 3, '2026-04-02', 4175.0, 1),
    (4, '2026-05-02', 4175.0, 1),
    ( 5, '2026-06-02', 4175.0, 1),
    ( 6, '2026-07-02', 4175.0, 1),
    (7, '2026-08-02', 4175.0, 1),
    (8, '2026-09-02', 4175.0, 1),
    (9, '2026-10-02', 4175.0, 1),
    ( 10, '2026-11-02', 4175.0, 1),
    (11, '2026-01-02', 4175.0, 1),
    (12, '2026-02-02', 4175.0, 1);

INSERT INTO DetallePago (IDTarjeta, IDPago, IDMetodoPago, Monto, Referencia, FechaTransaccion) VALUES
    (1, 1, 2, 4175.0, 'REF-DEMO-0001', '2026-02-02 12:05:00'),
    (2, 2, 2, 4175.0, 'REF-DEMO-0002', '2026-03-02 12:05:00'),
    (3, 3, 2, 4175.0, 'REF-DEMO-0003', '2026-04-02 12:05:00'),
    (4, 4, 2, 4175.0, 'REF-DEMO-0004', '2026-05-02 12:05:00'),
    (5, 5, 2, 4175.0, 'REF-DEMO-0005', '2026-06-02 12:05:00'),
    (6, 6, 2, 4175.0, 'REF-DEMO-0006', '2026-07-02 12:05:00'),
    (7, 7, 2, 4175.0, 'REF-DEMO-0007', '2026-08-02 12:05:00'),
    (8, 8, 2, 4175.0, 'REF-DEMO-0008', '2026-09-02 12:05:00'),
    (9, 9, 2, 4175.0, 'REF-DEMO-0009', '2026-10-02 12:05:00'),
    (10, 10, 2, 4175.0, 'REF-DEMO-0010', '2026-11-02 12:05:00'),
    (11, 11, 2, 4175.0, 'REF-DEMO-0011', '2026-01-02 12:05:00'),
    (12, 12, 2, 4175.0, 'REF-DEMO-0012', '2026-02-02 12:05:00');

INSERT INTO Factura ( IDUsuario, NumeroFactura, FechaEmision, ISV, Estado, Subtotal, TotalDescuento, ImporteExento, ImporteExonerado, ImporteGravado15, ImporteGravado18, Total, IDConfigSAR, IDOrden) VALUES
    (1, '000-001-01-00000001', '2026-02-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 1),
    (2, '000-001-01-00000002', '2026-03-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 2),
    (3, '000-001-01-00000003', '2026-04-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 3),
    (4, '000-001-01-00000004', '2026-05-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 4),
    (5, '000-001-01-00000005', '2026-06-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 5),
    ( 6, '000-001-01-00000006', '2026-07-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 6),
    ( 7, '000-001-01-00000007', '2026-08-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 7),
    ( 8, '000-001-01-00000008', '2026-09-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 8),
    (9, '000-001-01-00000009', '2026-10-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 9),
    ( 10, '000-001-01-00000010', '2026-11-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 10),
    ( 11, '000-001-01-00000011', '2026-01-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 11),
    ( 12, '000-001-01-00000012', '2026-02-02 12:10:00', 626.25, 1, 4175.0, 0, 0, 0, 4175.0, 0, 4801.25, 1, 12);

INSERT INTO DetalleFactura (IDBoleto, IDFactura, Descripcion, PrecioUnitario, Descuento, TasaISV, ISV, Subtotal, TotalDetalle) VALUES
    ( 1, 1, 'Boleto para Festival de Verano', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 2, 1, 'Boleto para Festival de Verano', 750, 0, 0.15, 112.5, 750, 862.5),
    ( 3, 1, 'Boleto para Festival de Verano', 350, 0, 0.15, 52.5, 350, 402.5),
    ( 4, 1, 'Boleto para Festival de Verano', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 5, 1, 'Boleto para Festival de Verano', 750, 75.0, 0.15, 101.25, 675.0, 776.25),
    ( 6, 2, 'Boleto para Noche de Rock', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 7, 2, 'Boleto para Noche de Rock', 750, 0, 0.15, 112.5, 750, 862.5),
    ( 8, 2, 'Boleto para Noche de Rock', 350, 0, 0.15, 52.5, 350, 402.5),
    ( 9, 2, 'Boleto para Noche de Rock', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 10, 2, 'Boleto para Noche de Rock', 750, 75.0, 0.15, 101.25, 675.0, 776.25),
    ( 11, 3, 'Boleto para Concierto Sinfónico', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 12, 3, 'Boleto para Concierto Sinfónico', 750, 0, 0.15, 112.5, 750, 862.5),
    ( 13, 3, 'Boleto para Concierto Sinfónico', 350, 0, 0.15, 52.5, 350, 402.5),
    ( 14, 3, 'Boleto para Concierto Sinfónico', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 15, 3, 'Boleto para Concierto Sinfónico', 750, 75.0, 0.15, 101.25, 675.0, 776.25),
    ( 16, 4, 'Boleto para Feria Familiar', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 17, 4, 'Boleto para Feria Familiar', 750, 0, 0.15, 112.5, 750, 862.5),
    ( 18, 4, 'Boleto para Feria Familiar', 350, 0, 0.15, 52.5, 350, 402.5),
    ( 19, 4, 'Boleto para Feria Familiar', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 20, 4, 'Boleto para Feria Familiar', 750, 75.0, 0.15, 101.25, 675.0, 776.25),
    ( 21, 5, 'Boleto para Campeonato de Baloncesto', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 22, 5, 'Boleto para Campeonato de Baloncesto', 750, 0, 0.15, 112.5, 750, 862.5),
    ( 23, 5, 'Boleto para Campeonato de Baloncesto', 350, 0, 0.15, 52.5, 350, 402.5),
    ( 24, 5, 'Boleto para Campeonato de Baloncesto', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 25, 5, 'Boleto para Campeonato de Baloncesto', 750, 75.0, 0.15, 101.25, 675.0, 776.25),
    ( 26, 6, 'Boleto para Festival de Comedia', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 27, 6, 'Boleto para Festival de Comedia', 750, 0, 0.15, 112.5, 750, 862.5),
    ( 28, 6, 'Boleto para Festival de Comedia', 350, 0, 0.15, 52.5, 350, 402.5),
    ( 29, 6, 'Boleto para Festival de Comedia', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 30, 6, 'Boleto para Festival de Comedia', 750, 75.0, 0.15, 101.25, 675.0, 776.25),
    ( 31, 7, 'Boleto para Danza de Honduras', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 32, 7, 'Boleto para Danza de Honduras', 750, 0, 0.15, 112.5, 750, 862.5),
    ( 33, 7, 'Boleto para Danza de Honduras', 350, 0, 0.15, 52.5, 350, 402.5),
    ( 34, 7, 'Boleto para Danza de Honduras', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 35, 7, 'Boleto para Danza de Honduras', 750, 75.0, 0.15, 101.25, 675.0, 776.25),
    ( 36, 8, 'Boleto para Encuentro Cultural', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 37, 8, 'Boleto para Encuentro Cultural', 750, 0, 0.15, 112.5, 750, 862.5),
    (38, 8, 'Boleto para Encuentro Cultural', 350, 0, 0.15, 52.5, 350, 402.5),
    (39, 8, 'Boleto para Encuentro Cultural', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 40, 8, 'Boleto para Encuentro Cultural', 750, 75.0, 0.15, 101.25, 675.0, 776.25),
    ( 41, 9, 'Boleto para Concierto Caribeño', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 42, 9, 'Boleto para Concierto Caribeño', 750, 0, 0.15, 112.5, 750, 862.5),
    ( 43, 9, 'Boleto para Concierto Caribeño', 350, 0, 0.15, 52.5, 350, 402.5),
    ( 44, 9, 'Boleto para Concierto Caribeño', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    (45, 9, 'Boleto para Concierto Caribeño', 750, 75.0, 0.15, 101.25, 675.0, 776.25),
    ( 46, 10, 'Boleto para Copa de la Ciudad', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 47, 10, 'Boleto para Copa de la Ciudad', 750, 0, 0.15, 112.5, 750, 862.5),
    ( 48, 10, 'Boleto para Copa de la Ciudad', 350, 0, 0.15, 52.5, 350, 402.5),
    ( 49, 10, 'Boleto para Copa de la Ciudad', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 50, 10, 'Boleto para Copa de la Ciudad', 750, 75.0, 0.15, 101.25, 675.0, 776.25),
    ( 51, 11, 'Boleto para Teatro en Escena', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 52, 11, 'Boleto para Teatro en Escena', 750, 0, 0.15, 112.5, 750, 862.5),
    ( 53, 11, 'Boleto para Teatro en Escena', 350, 0, 0.15, 52.5, 350, 402.5),
    ( 54, 11, 'Boleto para Teatro en Escena', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 55, 11, 'Boleto para Teatro en Escena', 750, 75.0, 0.15, 101.25, 675.0, 776.25),
    ( 56, 12, 'Boleto para Concierto Acústico', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 57, 12, 'Boleto para Concierto Acústico', 750, 0, 0.15, 112.5, 750, 862.5),
    ( 58, 12, 'Boleto para Concierto Acústico', 350, 0, 0.15, 52.5, 350, 402.5),
    ( 59, 12, 'Boleto para Concierto Acústico', 1200, 0, 0.15, 180.0, 1200, 1380.0),
    ( 60, 12, 'Boleto para Concierto Acústico', 750, 75.0, 0.15, 101.25, 675.0, 776.25);

INSERT INTO Carrito ( IDUsuario, FechaCreacion) VALUES
    ( 4, '2026-11-20 09:00:00'),
    ( 5, '2026-11-20 10:00:00'),
    ( 6, '2026-11-21 11:00:00');

INSERT INTO Orden ( IDUsuario, FechaCompra, IDEstadoOrden, IDCarrito) VALUES
    ( 4, '2026-11-20 09:10:00', 1, 13),
    ( 5, '2026-11-20 10:10:00', 3, 14),
    ( 6, '2026-11-21 11:10:00', 1, 15);

INSERT INTO Devoluciones ( IDDetalleOrden, FechaDevolucion, Motivo, MontoReembolsado, Estado) VALUES
    ( 5, '2026-11-10 14:00:00', 'Devolución de prueba por cambio de planes', 350.0, 1),
    ( 20, '2026-11-12 16:30:00', 'Solicitud de devolución de prueba', 750.0, 2);

-- CONSULTAS PARA COMPROBAR LAS VISTAS
-- SELECT * FROM vw_DireccionesRecintos;
-- SELECT * FROM vw_CarteleraEventos ORDER BY Fecha, HoraInicio;
-- SELECT * FROM vw_TaquillaOcupacion;
-- SELECT * FROM Vista_EventosMasVendidos ORDER BY TotalBoletosVendidos DESC LIMIT 5;
-- SELECT * FROM vw_IngresosPorEvento ORDER BY IngresosTotales DESC;

-- NOTAS:
-- 1) Los IDRol se cargan como valores de prueba porque en el DDL compartido
--    no aparece una tabla Roles ni una clave foránea para IDRol.
-- 2) Los valores de PAN/CVV y PasswordEncriptado son ficticios de prueba.
-- 3) En este conjunto cada orden pagada corresponde a un evento y contiene cinco boletos.
-- 4) Las filas adicionales de órdenes pendientes/canceladas sirven para probar filtros.
