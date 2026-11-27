use proyecto_basededatos;
#vista de direcciones para la vista de catalogo
CREATE VIEW vw_DireccionesRecintos AS 
SELECT D.Colonia,D.Calle,D.Referencia,M.Nombre AS Municipio,
DP.NombreDpt AS Departamento,R.NombreRecinto,R.IDRecinto
FROM Direccion D
INNER JOIN Municipio M ON D.IDMunicipio = M.IDMunicipio
INNER JOIN Departamentos DP ON M.IDDpto = DP.IDDpto
INNER JOIN Recinto R ON D.IDDireccion = R.IDDireccion;

#vista de catalogo y evento 
CREATE VIEW vw_CarteleraEventos AS
SELECT E.IDEvento,E.Titulo, E.Descripcion, E.Fecha, E.HoraInicio, E.HoraFin, E.RestriccionXEdad,
    E.RutaImagen,C.IDCategoriaEventos, C.Nombre AS Categoria,DR.IDRecinto, DR.NombreRecinto,
    DR.Colonia, DR.Calle, DR.Municipio, DR.Departamento
FROM Evento E
INNER JOIN DetalleCategoria DC
    ON E.IDEvento = DC.IDEvento
INNER JOIN CategoriaEventos C
    ON DC.IDCategoriaEventos = C.IDCategoriaEventos #Obtener las categorías como registros independientes y después agruparlas en Node.js
INNER JOIN vw_DireccionesRecintos DR
    ON E.IDRecinto = DR.IDRecinto
WHERE E.Estado = 1 #Mientras el estado del evento esté activo se añadirá a esta vista (1=activo)
ORDER BY E.Fecha ASC, E.HoraInicio ASC;
SELECT * From vw_CarteleraEventos;

#vista para disponibilidad por zona
CREATE VIEW vw_DisponibilidadZonas AS
SELECT E.IDEvento, E.Titulo AS NombreEvento, ZP.IDZonaPrecio,Z.IDZonasRecinto,
    Z.NombreZona, ZP.Precio,ZP.CupoDisponible
FROM Evento E
INNER JOIN EventoxZonaPrecio ZP
    ON E.IDEvento = ZP.IDEvento
INNER JOIN ZonasRecinto Z
    ON ZP.IDZonasRecinto = Z.IDZonasRecinto
WHERE E.Estado = 1;
Select * from vw_disponibilidadZonas;

#vista para reportes gerenciales /Ingresos por evento (Dinero)
CREATE VIEW vw_IngresosPorEvento AS
SELECT E.IDEvento, E.Titulo AS NombreEvento, SUM(DO.Subtotal) AS IngresosTotales
FROM Evento E
INNER JOIN Boletos B ON E.IDEvento = B.IDEvento
INNER JOIN DetalleOrden DO ON B.IDBoleto = DO.IDBoleto
INNER JOIN Orden O ON DO.IDOrden = O.IDOrden
WHERE O.IDEstadoOrden = 2 #Si la orden está pagada (2=Pagado) 
GROUP BY E.IDEvento, E.Titulo;
SELECT * FROM vw_IngresosPorEvento;

#vista para reportes gerenciales /porcentaje de ocupacion Por Zona
CREATE VIEW vw_TaquillaOcupacion AS
SELECT E.Titulo AS NombreEvento,z.NombreZona,
AC.CapacidadAsignada AS CapacidadTotal, zp.CupoDisponible, 
(AC.CapacidadAsignada-zp.CupoDisponible) AS CuposOcupados,
ROUND(((AC.CapacidadAsignada-zp.CupoDisponible)*100/(NULLIF(AC.CapacidadAsignada,0))),2) AS PorcentajeOcupacion
FROM Evento E 
INNER JOIN eventoxzonaprecio zp ON E.IDEvento=zp.IDEvento
INNER JOIN zonasrecinto z ON zp.IDZonasRecinto=z.IDZonasRecinto
INNER JOIN asignacioncapacidad AC ON zp.IDZonasRecinto=AC.IDZonasRecinto and E.IDRecinto=AC.IDRecinto
WHERE AC.CapacidadAsignada>0; #no aparecerá en la vista si una zona de recinto no se le asignó capacidad;
SELECT * FROM vw_TaquillaOcupacion;

#vista para reportes gerenciales /eventos mas vendidos
CREATE VIEW vw_EventosMasVendidos AS
SELECT  E.IDEvento, E.Titulo AS NombreEvento, COUNT(B.IDBoleto) AS TotalBoletosVendidos
FROM Evento E
INNER JOIN Boletos B ON E.IDEvento = B.IDEvento
INNER JOIN DetalleOrden DO ON B.IDBoleto = DO.IDBoleto
INNER JOIN Orden O ON DO.IDOrden = O.IDOrden
WHERE O.IDEstadoOrden = 2 #Si la orden está pagada (2=Pagado) 
GROUP BY E.IDEvento, E.Titulo;
SELECT * FROM vw_EventosMasVendidos LIMIT 5;





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





