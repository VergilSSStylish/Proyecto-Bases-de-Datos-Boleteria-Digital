CREATE DATABASE Proyecto_basedeDatos;
USE Proyecto_basedeDatos;

-- TABLAS INDEPENDIENTES
CREATE TABLE TipoUsuario(
IDTipoUsuario       INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
Nombre              VARCHAR(100) NOT NULL,
Descripcion         VARCHAR(200) null
)ENGINE=InnoDB;

CREATE TABLE Departamentos(
IDDpto                     INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
NombreDpt                  VARCHAR(50) NOT NULL
)ENGINE=InnoDB;

CREATE TABLE CategoriaEventos(
IDCategoriaEventos          INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
Nombre                      VARCHAR(100) NOT NULL,
Descripcion         VARCHAR(200) null
)ENGINE=InnoDB;

CREATE TABLE ZonasRecinto(
IDZonasRecinto        INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
NombreZona            VARCHAR(50) NOT NULL,
Detalles              VARCHAR(200),
RutaImagen            VARCHAR(2000),
Estado                INT NOT NULL  
)ENGINE=InnoDB;

CREATE TABLE EstadoBoleto(
IDEstadoBoleto     INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
NombreEstado        VARCHAR(100) NOT NULL    
)ENGINE=InnoDB;

CREATE TABLE EstadoOrden(
IDEstadoOrden       INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
Nombre              VARCHAR(100) NOT NULL
)ENGINE=InnoDB;

CREATE TABLE MetodoPago(
IDMetodoPago        INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
Nombre              VARCHAR(40) NOT NULL,
Descripcion         VARCHAR(100)
)ENGINE=InnoDB;

CREATE TABLE TiposTarjetas(
IDTiposTarjetas     INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
NombreTipo          VARCHAR(50) NOT NULL,
Descripcion         VARCHAR(100)
)ENGINE=InnoDB;

CREATE TABLE ConfiguracionEdades(
IDConfiguracionEdades     INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
NombreRango         VARCHAR(50) NOT NULL,
EdadMinima          INT NOT NULL,
EdadMaxima          INT,

-- RESTRICCIONES
CONSTRAINT checkEdadMinima CHECK(EdadMinima >= 0),
CONSTRAINT checkEdadMaxima CHECK(EdadMaxima >= 0)
)ENGINE=InnoDB;

-- Nivel 2
CREATE TABLE Municipio (
    IDMunicipio INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    IDDpto INT NOT NULL,
    CONSTRAINT fk_Municipio_Departamentos FOREIGN KEY (IDDpto) REFERENCES Departamentos (IDDpto)
) ENGINE=InnoDB;

CREATE TABLE Usuario (
    IDUsuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    PNombre VARCHAR(120) NOT NULL,
    SNombre VARCHAR(120) NULL,
    PApellido VARCHAR(120) NOT NULL,
    SApellido VARCHAR(120) NULL,
    Telefono VARCHAR(20) NOT NULL UNIQUE,
    Correo VARCHAR(100) NOT NULL UNIQUE,
    FechaNac DATE NOT NULL,
    Genero VARCHAR(1) NULL,
    RTN VARCHAR(14) NULL UNIQUE,
    FechaReg DATE NOT NULL DEFAULT (CURRENT_DATE),
    PasswordEncriptado Varchar(300) NOT NULL,
    IDTipoUsuario INT NOT NULL,
    CONSTRAINT fk_Tipo_Usuaio FOREIGN KEY (IDTipoUsuario) REFERENCES TipoUsuario (IDTipoUsuario)
) ENGINE=InnoDB;

CREATE TABLE TipoDescuento (
    IDTipoDescuento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Descuento DECIMAL(10,2) NOT NULL CHECK (Descuento >= 0),
    IdConfiguracionEdades INT NOT NULL,
    CONSTRAINT fk_Tipos_Edades FOREIGN KEY (IdConfiguracionEdades) REFERENCES ConfiguracionEdades (IdConfiguracionEdades)
) ENGINE=InnoDB;

-- NIVEL 3 --

CREATE TABLE Direccion (
    IDDireccion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Colonia VARCHAR(50) NOT NULL,
    Calle VARCHAR(50) NOT NULL,
    Referencia VARCHAR(100) NOT NULL,
    RutaImagen VARCHAR(2000) NULL,
    IDMunicipio INT NOT NULL,
    CONSTRAINT fk_Direccion_Municipio FOREIGN KEY (IDMunicipio) REFERENCES Municipio (IDMunicipio)
) ENGINE=InnoDB;



CREATE TABLE Tarjeta (
    IDTarjeta INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    PAN VARCHAR(19) NOT NULL,
    NombreTitular VARCHAR(300) NOT NULL,
    CVV VARCHAR(3) NOT NULL,
    FechaExp DATE NOT NULL,
    IDTiposTarjetas INT NOT NULL,
    IDUsuario INT NOT NULL,
    CONSTRAINT fk_Tipos_Targetas FOREIGN KEY (IDTiposTarjetas) REFERENCES TiposTarjetas (IDTiposTarjetas),
    CONSTRAINT fk_Usuario_Targetas FOREIGN KEY (IDUsuario) REFERENCES Usuario (IDUsuario)
) ENGINE=InnoDB;

CREATE TABLE Carrito (
    IDCarrito INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    IDUsuario INT NOT NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Carrito_Usuario FOREIGN KEY (IDUsuario) REFERENCES Usuario (IDUsuario)
) ENGINE=InnoDB;

-- nivel 4
CREATE TABLE Empresa (
    IDEmpresa INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    RazonSocial VARCHAR(200) NOT NULL,
    RTNEmpresa VARCHAR(14) NOT NULL UNIQUE,
    IDDireccion INT NOT NULL,
    Telefono_Empresa VARCHAR(20) NOT NULL UNIQUE,
    Correo_Empresa VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT fk_Empresa_Direccion FOREIGN KEY (IDDireccion) REFERENCES Direccion(IDDireccion)
) ENGINE=InnoDB;

CREATE TABLE Recinto (
    IDRecinto INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    IDDireccion INT NOT NULL,
    NombreRecinto VARCHAR(100) NOT NULL,
    CapacidadTotal INT NOT NULL,
    Estado INT NOT NULL,
    CONSTRAINT fk_Recinto_Direccion FOREIGN KEY (IDDireccion) REFERENCES Direccion(IDDireccion),
    -- RESTRICCIONES
    CONSTRAINT checkCapacidadTotal CHECK(CapacidadTotal>0)
)ENGINE=InnoDB;

CREATE TABLE Orden(
    IDOrden INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    IDUsuario INT NOT NULL,
    FechaCompra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IDEstadoOrden INT NOT NULL,
    IDCarrito INT NOT NULL,
    CONSTRAINT fk_Orden_EstadoOrde FOREIGN KEY (IDEstadoOrden) REFERENCES EstadoOrden(IDEstadoOrden),
    CONSTRAINT fk_Orden_Carrito FOREIGN KEY (IDCarrito) REFERENCES Carrito(IDCarrito),
    CONSTRAINT fk_Orden_Usuario FOREIGN KEY (IDUsuario) REFERENCES Usuario(IDUsuario)
)ENGINE=InnoDB;

CREATE TABLE ConfiguracionSAR(
    IDConfigSAR INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IDMunicipio INT NOT NULL,
    IDEmpresa INT NOT NULL,
    CAI VARCHAR(37) NOT NULL,
    TipoDocumento VARCHAR(20) NOT NULL DEFAULT 'Factura',
    CodigoDocumento VARCHAR(2) NOT NULL,
    PuntoEmision VARCHAR(3) NOT NULL,
    RangoInicial BIGINT NOT NULL,
    RangoFinal BIGINT NOT NULL,
    CorrelativoActual BIGINT NOT NULL,
    FechaLimiteEmision DATE NOT NULL,
    FechaAutorizacion DATE NOT NULL,
    Activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_Municipio FOREIGN KEY (IDMunicipio) REFERENCES Municipio(IDMunicipio),
    CONSTRAINT fk_Empresa FOREIGN KEY (IDEmpresa) REFERENCES Empresa(IDEmpresa),
    -- RESTRICCIONES
    CONSTRAINT CHKRango CHECK (RangoFinal >= RangoInicial)
    
)ENGINE=InnoDB;

CREATE TABLE Evento(
    IDEvento INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Titulo VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(500) NOT NULL,
    RestriccionXEdad VARCHAR(50) NOT NULL,
    Estado INT NOT NULL,
    Fecha DATE NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFin TIME NOT NULL,
    IDRecinto INT NOT NULL,
    codVestimenta VARCHAR(100) NULL,
    RutaImagen VARCHAR(200) NOT NULL,
    PermiteAcompanante BOOLEAN NOT NULL,
    MaxAcompanantes INT NULL,
    CONSTRAINT Fk_RecintoEvento FOREIGN KEY (IDRecinto) REFERENCES Recinto(IDRecinto),
    -- RESTRICCIONS
    CONSTRAINT checkMaxAcompanantes CHECK(MaxAcompanantes>=0)
)ENGINE=InnoDB;

CREATE TABLE AsignacionCapacidad(
    IDAsignacion INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    CapacidadAsignada INT NOT NULL,
    IDRecinto INT NOT NULL,
    IDZonasRecinto INT NOT NULL,
    CONSTRAINT fk_Recinto_Asignacion FOREIGN KEY (IDRecinto) REFERENCES Recinto(IDRecinto),
    CONSTRAINT fk_Capacidad_ZonaRecinto FOREIGN KEY (IDZonasRecinto) REFERENCES ZonasRecinto(IDZonasRecinto),
    -- RESTRICCIONES
    CONSTRAINT checkCapacidadAsignada CHECK(CapacidadAsignada>=0)
)ENGINE=InnoDB;

CREATE TABLE Pago(
    IDPago INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IDOrden INT NOT NULL,
    FechaPago DATE NOT NULL,
    Monto DECIMAL(10,2) NOT NULL,
    EstadoPago INT NOT NULL,
    CONSTRAINT fk_Orden FOREIGN KEY (IDOrden) REFERENCES Orden(IDOrden),
    -- RESTRICCIONES
    CONSTRAINT checkMonto CHECK(Monto>=0)
)ENGINE=InnoDB;

-- nivel 6 
CREATE TABLE DetalleCategoria(
    IDDetalleCategoria INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    IDCategoriaEventos INT NOT NULL,
    IDEvento INT NOT NULL,
    CONSTRAINT fk_IDDetalle_Categoria FOREIGN KEY (IDCategoriaEventos) REFERENCES CategoriaEventos(IDCategoriaEventos),
    CONSTRAINT fk_Eventos_Detalle FOREIGN KEY (IDEvento) REFERENCES Evento(IDEvento)
)ENGINE=InnoDB;

CREATE TABLE EventoxZonaPrecio(
    IDZonaPrecio INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    IDEvento INT NOT NULL,
    IDZonasRecinto INT NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    CupoDisponible INT NOT NULL,
    CONSTRAINT fk_EventoXZonaPrecio_ZonaRecinto FOREIGN KEY (IDZonasRecinto) REFERENCES ZonasRecinto(IDZonasRecinto),
    CONSTRAINT fk_EventoXZonaPrecio_Evento FOREIGN KEY (IDEvento) REFERENCES Evento(IDEvento),
    -- RESTRICCIONES
    CONSTRAINT checkPrecio CHECK(Precio>=0)
)ENGINE=InnoDB;

CREATE TABLE Factura (
    IDFactura INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    IDUsuario INT NOT NULL,
    NumeroFactura VARCHAR(20) NOT NULL UNIQUE,
    FechaEmision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ISV DECIMAL(10,2) NOT NULL,
    Estado INT NOT NULL,
    Subtotal DECIMAL(10,2) NOT NULL,
    TotalDescuento DECIMAL(10,2) NOT NULL DEFAULT 0,
    ImporteExento DECIMAL(10,2) NOT NULL DEFAULT 0,
    ImporteExonerado DECIMAL(10,2) NOT NULL DEFAULT 0,
    ImporteGravado15 DECIMAL(10,2) NOT NULL DEFAULT 0,
    ImporteGravado18 DECIMAL(10,2) NOT NULL DEFAULT 0,
    Total DECIMAL(10,2) NOT NULL,
    IDConfigSAR INT NOT NULL,
    IDOrden INT NOT NULL,
    CONSTRAINT fk_Factura_Usuario FOREIGN KEY (IDUsuario) REFERENCES Usuario(IDUsuario),
    CONSTRAINT fk_Factura_ConfigSAR FOREIGN KEY (IDConfigSAR) REFERENCES ConfiguracionSAR(IDConfigSAR),
    CONSTRAINT fk_Factura_Orden FOREIGN KEY (IDOrden) REFERENCES Orden(IDOrden),
    -- RESTRICCIONES
    CONSTRAINT checkSubtotal CHECK(Subtotal>=0),
    CONSTRAINT checkTotalDescuento CHECK(TotalDescuento>=0),
    CONSTRAINT checkTotal CHECK(Total>=0),
    CONSTRAINT checkImporteExonerado CHECK(ImporteExonerado>=0),
    CONSTRAINT checkImporteGravado15 CHECK(ImporteGravado15>=0),
    CONSTRAINT checkImporteGravado18 CHECK(ImporteGravado18>=0)
) ENGINE=InnoDB;

CREATE TABLE DetallePago(
    IDDetallePago INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    IDTarjeta INT NULL,
    IDPago INT NOT NULL,
    IDMetodoPago INT NOT NULL,
    Monto DECIMAL(10,2) NOT NULL,
    Referencia VARCHAR(100) NULL,
    FechaTransaccion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_DetallePago_Tarjeta FOREIGN KEY (IDTarjeta) REFERENCES Tarjeta(IDTarjeta),
    CONSTRAINT fk_DetallePago_Pago FOREIGN KEY (IDPago) REFERENCES Pago(IDPago),
    CONSTRAINT fk_DetallePago_MetodoPago FOREIGN KEY (IDMetodoPago) REFERENCES MetodoPago(IDMetodoPago),
    -- RESTRICCIONES
    CONSTRAINT checkMonto2 CHECK(Monto>=0)
)ENGINE=InnoDB;

CREATE TABLE Boletos (
    IDBoleto INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    CodigoAlfanumerico VARCHAR(20) NOT NULL,
    EsAcompañante BOOLEAN NOT NULL,
    NombreAcompañante VARCHAR(50) NULL,
    DNIAcompañante VARCHAR(13) NULL,
    IDZonaPrecio INT NOT NULL,
    IDEstadoBoleto INT NOT NULL,
    IDBoletoTitular INT NULL,
    IDEvento INT NOT NULL,
    CONSTRAINT fk_Boletos_Evento FOREIGN KEY (IDEvento) REFERENCES Evento(IDEvento),
    CONSTRAINT fk_Boletos_Titular FOREIGN KEY (IDBoletoTitular) REFERENCES Boletos(IDBoleto),
    CONSTRAINT fk_Boleto_Estado FOREIGN KEY (IDEstadoBoleto) REFERENCES EstadoBoleto(IDEstadoBoleto),
    CONSTRAINT fk_Boleto_ZonaPrecio FOREIGN KEY (IDZonaPrecio) REFERENCES EventoxZonaPrecio(IDZonaPrecio)
)ENGINE=InnoDB;

CREATE TABLE Reserva(
    IDReserva INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    FechaReserva DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaExpiracion DATETIME NOT NULL,
    Estado BOOLEAN NOT NULL,
    IDCarrito INT NOT NULL,
    IDBoleto INT NOT NULL,
    CONSTRAINT fk_Reservas_Carrito FOREIGN KEY (IDCarrito) REFERENCES Carrito(IDCarrito),
    CONSTRAINT fk_Reservas_Boletos FOREIGN KEY (IDBoleto) REFERENCES Boletos(IDBoleto)
)ENGINE=InnoDB;

CREATE TABLE DetalleOrden(
    IDDetalleOrden INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IDBoleto INT NOT NULL,
    IDTipoDescuento INT NOT NULL,
    IDOrden INT NOT NULL,
    MontoDescuento DECIMAL(10,2) NOT NULL,
    Subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_Detalle_Orden FOREIGN KEY(IDOrden) REFERENCES orden(IDOrden),
    CONSTRAINT fk_Detalle_Boleto FOREIGN KEY (IDBoleto) REFERENCES Boletos(IDBoleto),
    CONSTRAINT fk_Detalle_TipoDescuento FOREIGN KEY (IDTipoDescuento) REFERENCES TipoDescuento(IDTipoDescuento),
    -- RESTRICCIONES
    CONSTRAINT checkmontodescuento CHECK(MontoDescuento>=0),
    CONSTRAINT checkSubtotaldetalleorden CHECK(Subtotal>=0)
)ENGINE=InnoDB;

CREATE TABLE DetalleFactura (
    IDDetalleFactura INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    IDBoleto INT NOT NULL,
    IDFactura INT NOT NULL,
    Descripcion VARCHAR(300) NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    Descuento DECIMAL(10,2) NOT NULL,
    TasaISV DECIMAL(10,2) NOT NULL,
    ISV DECIMAL(10,2) NOT NULL DEFAULT 0,
    Subtotal DECIMAL(10,2) NOT NULL,
    TotalDetalle DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_DetalleFactura_Boletos FOREIGN KEY (IDBoleto) REFERENCES Boletos(IDBoleto),
    CONSTRAINT FK_DetalleFactura_Factura FOREIGN KEY (IDFactura) REFERENCES Factura(IDFactura)
) ENGINE=InnoDB;

CREATE TABLE Devoluciones(
    IDDevoluciones INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IDDetalleOrden INT,
    FechaDevolucion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Motivo VARCHAR(500) NOT NULL,
    MontoReembolsado DECIMAL(10,2) NOT NULL,
    Estado INT NOT NULL,
    CONSTRAINT fk_Devoluciones_DetalleOrden FOREIGN KEY (IDDetalleOrden) REFERENCES DetalleOrden(IDDetalleOrden),
    -- RESTRICCIONES
    CONSTRAINT checkMontoReembolsado CHECK(MontoReembolsado>=0)
)ENGINE=InnoDB;