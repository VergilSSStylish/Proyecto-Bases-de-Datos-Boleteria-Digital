USE Proyecto_basedeDatos;

-- 1. Restricciones: la base rechaza los datos inválidos
ALTER TABLE Boletos
    ADD CONSTRAINT uq_Boletos_Codigo UNIQUE (CodigoAlfanumerico);

ALTER TABLE Devoluciones
    ADD CONSTRAINT checkMotivo CHECK (CHAR_LENGTH(TRIM(Motivo)) > 0),
    ADD CONSTRAINT checkEstadoDevolucion CHECK (Estado IN (1, 2, 3));

-- 2. Vista: una fila por boleto comprado, con su estado ya calculado
CREATE OR REPLACE VIEW vw_MisBoletos AS
SELECT o.IDUsuario, o.IDOrden, d.IDDetalleOrden, d.Subtotal,
       b.IDBoleto, b.CodigoAlfanumerico, b.IDBoletoTitular, b.IDZonaPrecio,
       b.`EsAcompañante` AS EsAcompanante, b.`NombreAcompañante` AS NombreAcompanante,
       z.NombreZona, e.Titulo, e.Fecha, e.HoraInicio, r.NombreRecinto,
       CASE
           WHEN eb.NombreEstado = 'Canjeado' THEN 'Utilizado'
           WHEN eb.NombreEstado = 'Anulado' THEN 'Cancelado'
           WHEN TIMESTAMP(e.Fecha, e.HoraInicio) > NOW() THEN 'Activo'
           ELSE 'Vencido'
       END AS Estado,
       dv.Estado AS EstadoDevolucion,
       (eb.NombreEstado = 'Vendido'
        AND TIMESTAMPDIFF(HOUR, NOW(), TIMESTAMP(e.Fecha, e.HoraInicio)) >= 48
        AND dv.IDDevoluciones IS NULL) AS PuedeDevolver
FROM Boletos b
JOIN DetalleOrden d       ON d.IDBoleto = b.IDBoleto
JOIN Orden o              ON o.IDOrden = d.IDOrden
JOIN EstadoBoleto eb      ON eb.IDEstadoBoleto = b.IDEstadoBoleto
JOIN EventoxZonaPrecio zp ON zp.IDZonaPrecio = b.IDZonaPrecio
JOIN ZonasRecinto z       ON z.IDZonasRecinto = zp.IDZonasRecinto
JOIN Evento e             ON e.IDEvento = b.IDEvento
JOIN Recinto r            ON r.IDRecinto = e.IDRecinto
LEFT JOIN Devoluciones dv ON dv.IDDetalleOrden = d.IDDetalleOrden
WHERE eb.NombreEstado IN ('Vendido', 'Canjeado', 'Anulado');
