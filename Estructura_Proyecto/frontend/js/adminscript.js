
const API_URL = 'http://127.0.0.1:3000/api/admin/dashboard';

let datosOcupacion = [];

const elementos = {
    nombre: document.getElementById('nombre-admin'),
    ingresos: document.getElementById('total-ingresos'),
    boletos: document.getElementById('total-boletos'),
    eventos: document.getElementById('total-eventos'),
    clientes: document.getElementById('total-clientes'),
    listaEventos: document.getElementById('lista-eventos')
};

// Cargar dashboard
document.addEventListener('DOMContentLoaded', cargarDashboard);

async function cargarDashboard() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const respuesta = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const datos = await respuesta.json();

        if (respuesta.status === 401 || respuesta.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = 'login.html';
            return;
        }

        if (!respuesta.ok || !datos.exitoso) {
            throw new Error(datos.mensaje || 'Error al cargar el dashboard.');
        }

        mostrarAdministrador(datos.administrador);
        mostrarEstadisticas(datos.estadisticas);
        mostrarProximosEventos(datos.proximosEventos);

        mostrarGraficoIngresos(datos.graficos.ingresosPorEvento || []);

        datosOcupacion = datos.graficos.ocupacionPorZona || [];
        prepararSelectorOcupacion();
        mostrarRankingEventos(datos.graficos.eventosMasVendidos || []);
    } catch (error) {
        console.error('Error en dashboard:', error);
        alert(error.message);
    }
}

// Nombre del administrador
function mostrarAdministrador(admin) {
    if (elementos.nombre) {
        elementos.nombre.textContent = admin.Nombre;
    }
}

// Estadísticas generales
function mostrarEstadisticas(datos) {
    elementos.ingresos.textContent =
        `L ${Number(datos.ingresos).toLocaleString('es-HN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    elementos.boletos.textContent =
        Number(datos.boletos).toLocaleString('es-HN');

    elementos.eventos.textContent =
        Number(datos.eventos).toLocaleString('es-HN');

    elementos.clientes.textContent =
        Number(datos.clientes).toLocaleString('es-HN');
}

// Próximos eventos
function mostrarProximosEventos(eventos) {
    const contenedor = document.getElementById('lista-eventos');

    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (!eventos || eventos.length === 0) {
        contenedor.innerHTML = `
            <p class="barras-vacio">
                No hay próximos eventos registrados.
            </p>
        `;
        return;
    }

    eventos.forEach(evento => {
        const fecha = String(evento.Fecha).split('T')[0];
        const partesFecha = fecha.split('-');

        const dia = partesFecha[2];
        const mes = new Date(
            Number(partesFecha[0]),
            Number(partesFecha[1]) - 1,
            1
        ).toLocaleDateString('es-HN', { month: 'short' });

        const tarjeta = document.createElement('div');
        tarjeta.className = 'evento-card';

        const fechaElemento = document.createElement('div');
        fechaElemento.className = 'evento-fecha';

        const numeroDia = document.createElement('span');
        numeroDia.className = 'evento-dia';
        numeroDia.textContent = dia;

        const nombreMes = document.createElement('span');
        nombreMes.className = 'evento-mes';
        nombreMes.textContent = mes.replace('.', '');

        fechaElemento.append(numeroDia, nombreMes);

        const informacion = document.createElement('div');
        informacion.className = 'evento-info';

        const titulo = document.createElement('h4');
        titulo.className = 'evento-titulo';
        titulo.textContent = evento.Titulo;

        const recinto = document.createElement('p');
        recinto.className = 'evento-detalle';
        recinto.innerHTML = '<i class="fa-solid fa-location-dot"></i>';
        recinto.append(
            document.createTextNode(
                `${evento.NombreRecinto || 'Recinto pendiente'} · ${evento.Municipio || ''}`
            )
        );

        const hora = document.createElement('p');
        hora.className = 'evento-detalle';
        hora.innerHTML = '<i class="fa-regular fa-clock"></i>';
        hora.append(
            document.createTextNode(evento.HoraInicio || 'Hora pendiente')
        );

        informacion.append(titulo, recinto, hora);
        tarjeta.append(fechaElemento, informacion);
        contenedor.appendChild(tarjeta);
    });
}

// Crear una barra de progreso
function crearBarra(nombre, porcentaje, detalle, color = '#277dff') {
    const porcentajeSeguro = Math.max(0, Math.min(100, Number(porcentaje) || 0));

    const item = document.createElement('div');
    item.className = 'barra-item';

    const informacion = document.createElement('div');
    informacion.className = 'barra-info';

    const titulo = document.createElement('span');
    titulo.className = 'barra-nombre';
    titulo.textContent = nombre;

    const valor = document.createElement('span');
    valor.className = 'barra-porcentaje';
    valor.textContent = `${porcentajeSeguro.toFixed(2)}%`;

    informacion.append(titulo, valor);

    const fondo = document.createElement('div');
    fondo.className = 'barra-fondo';

    const progreso = document.createElement('div');
    progreso.className = 'barra-progreso';
    progreso.style.width = `${porcentajeSeguro}%`;
    progreso.style.backgroundColor = color;

    fondo.appendChild(progreso);

    const descripcion = document.createElement('p');
    descripcion.className = 'barra-detalle';
    descripcion.textContent = detalle;

    item.append(informacion, fondo, descripcion);

    return item;
}

// Barras de ingresos por evento
function mostrarGraficoIngresos(datos) {
    const contenedor = document.getElementById('grafico-ingresos');

    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (!datos || datos.length === 0) {
        contenedor.innerHTML =
            '<p class="barras-vacio">No hay información de ingresos.</p>';
        return;
    }

    // Ordenar de mayor a menor ingreso
    const eventosOrdenados = [...datos].sort(
        (a, b) => Number(b.IngresosTotales) - Number(a.IngresosTotales)
    );

    const ingresoMaximo = Math.max(
        ...eventosOrdenados.map(e => Number(e.IngresosTotales)),
        0
    );

    eventosOrdenados.forEach(evento => {
        const ingreso = Number(evento.IngresosTotales) || 0;

        const porcentaje = ingresoMaximo > 0
            ? (ingreso / ingresoMaximo) * 100
            : 0;

        const detalle = `L ${ingreso.toLocaleString('es-HN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

        contenedor.appendChild(
            crearBarra(evento.NombreEvento, porcentaje, detalle, '#277dff')
        );
    });
}

// Preparar selector de eventos
function prepararSelectorOcupacion() {
    const contenedor = document.getElementById('grafico-ocupacion');

    if (!contenedor) return;

    contenedor.innerHTML = '';

    const selector = document.createElement('select');
    selector.id = 'selector-evento-ocupacion';
    selector.className = 'selector-evento-grafico';

    contenedor.appendChild(selector);

    const zonasContainer = document.createElement('div');
    zonasContainer.id = 'barras-ocupacion';
    zonasContainer.className = 'barras-container';

    contenedor.appendChild(zonasContainer);

    // Obtener eventos disponibles
    const eventos = new Map();

    datosOcupacion.forEach(zona => {
        const id = zona.IDEvento ?? zona.NombreEvento;

        if (!eventos.has(id)) {
            eventos.set(id, zona.NombreEvento);
        }
    });

    if (eventos.size === 0) {
        selector.style.display = 'none';
        zonasContainer.innerHTML =
            '<p class="barras-vacio">No hay información de ocupación.</p>';
        return;
    }

    eventos.forEach((nombre, id) => {
        const opcion = document.createElement('option');
        opcion.value = id;
        opcion.textContent = nombre;
        selector.appendChild(opcion);
    });

    selector.addEventListener('change', () => {
        mostrarGraficoOcupacion(selector.value);
    });

    mostrarGraficoOcupacion(selector.value);
}

// Mostrar ocupación por zona del evento seleccionado
function mostrarGraficoOcupacion(idEvento) {
    const contenedor = document.getElementById('barras-ocupacion');

    if (!contenedor) return;

    contenedor.innerHTML = '';

    const zonas = datosOcupacion.filter(zona => {
        const id = zona.IDEvento ?? zona.NombreEvento;
        return String(id) === String(idEvento);
    });

    if (zonas.length === 0) {
        contenedor.innerHTML =
            '<p class="barras-vacio">No hay zonas disponibles.</p>';
        return;
    }

    zonas.forEach(zona => {
        const capacidad = Number(zona.CapacidadTotal) || 0;
        const ocupados = Number(zona.CuposOcupados) || 0;
        const disponibles = Math.max(0, capacidad - ocupados);

        const porcentaje = capacidad > 0
            ? (ocupados / capacidad) * 100
            : 0;

        const detalle =
            `${ocupados.toLocaleString('es-HN')} ocupados · ${disponibles.toLocaleString('es-HN')} disponibles`;

        contenedor.appendChild(
            crearBarra(
                zona.NombreZona,
                porcentaje,
                detalle,
                '#277dff'
            )
        );
    });
}
function mostrarRankingEventos(eventos) {
    const contenedor = document.getElementById('ranking-eventos');

    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (!eventos || eventos.length === 0) {
        contenedor.innerHTML = `
            <p class="barras-vacio">
                Todavía no hay eventos con boletos vendidos.
            </p>
        `;
        return;
    }

    eventos.slice(0, 10).forEach((evento, indice) => {

        const tarjeta = document.createElement('div');
        tarjeta.className = 'ranking-item';

        const posicion = document.createElement('span');
        posicion.className = 'ranking-posicion';
        posicion.textContent = `#${indice + 1}`;

        const imagen = document.createElement('img');
        imagen.className = 'ranking-imagen';

        // Imagen predeterminada mientras conectamos las imágenes de cada evento.
        imagen.src = '../assets/poster%20prueba.jpg';
        imagen.alt = evento.NombreEvento;

        imagen.onerror = () => {
            imagen.style.display = 'none';
        };

        const informacion = document.createElement('div');
        informacion.className = 'ranking-info';

        const nombre = document.createElement('p');
        nombre.className = 'ranking-nombre';
        nombre.textContent = evento.NombreEvento;

        const vendidos = document.createElement('p');
        vendidos.className = 'ranking-vendidos';
        vendidos.innerHTML = `
            <strong>${Number(evento.TotalBoletosVendidos).toLocaleString('es-HN')}</strong>
            boletos vendidos
        `;

        informacion.append(nombre, vendidos);
        tarjeta.append(posicion, imagen, informacion);

        contenedor.appendChild(tarjeta);
    });
}
// Cerrar sesión
const botonCerrarSesion = document.getElementById('logout-btn');

if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = 'login.html';
    });
}
