const API_EVENTOS_URL = 'http://127.0.0.1:3000/api/eventos';

const parametrosEvento = new URLSearchParams(window.location.search);
const idEventoDetalle = Number(parametrosEvento.get('idEvento'));
const botonComprarEntradas = document.getElementById('btn-buy-tickets');

if (Number.isInteger(idEventoDetalle) && idEventoDetalle > 0) {
    cargarDetalleEvento();
    botonComprarEntradas.addEventListener('click', () => {
        window.location.href = `entradas.html?idEvento=${idEventoDetalle}`;
    });
} else {
    document.getElementById('detail-title').textContent =
        'No se indicó un evento válido';
    botonComprarEntradas.disabled = true;
}

async function cargarDetalleEvento() {
    try {
        const respuesta = await fetch(API_EVENTOS_URL);
        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el evento.');
        }

        const eventos = await respuesta.json();
        const evento = eventos.find(
            elemento => Number(elemento.IDEvento) === idEventoDetalle
        );

        if (!evento) {
            document.getElementById('detail-title').textContent =
                'No se encontró el evento';
            botonComprarEntradas.disabled = true;
            return;
        }

        mostrarDetalleEvento(evento);
    } catch (error) {
        console.error('Error al cargar el detalle del evento:', error);
        document.getElementById('detail-title').textContent =
            'Error al cargar el evento';
        botonComprarEntradas.disabled = true;
    }
}

function mostrarDetalleEvento(evento) {
    document.getElementById('detail-title').textContent = evento.Titulo;
    document.getElementById('detail-description').textContent =
        evento.Descripcion || 'Sin descripción disponible';
    document.getElementById('detail-date').textContent =
        formatearFechaEvento(evento.Fecha);
    document.getElementById('start-time').textContent =
        evento.HoraInicio.substring(0, 5);
    document.getElementById('end-time').textContent =
        evento.HoraFin.substring(0, 5);
    document.getElementById('detail-venue').textContent =
        `${evento.NombreRecinto}, ${evento.Municipio}`;
    document.getElementById('detail-age').textContent =
        evento.RestriccionXEdad || 'Sin restricción especificada';

    const codigoVestimenta = document.getElementById('detail-dresscode');
    codigoVestimenta.textContent =
        evento.codVestimenta || 'Información no disponible';

    const acompanantes = document.getElementById('detail-companions');
    if (typeof evento.PermiteAcompanante === 'undefined') {
        acompanantes.textContent = 'Información no disponible';
    } else if (evento.PermiteAcompanante) {
        acompanantes.textContent =
            `Permite hasta ${evento.MaxAcompanantes || 0} acompañantes`;
    } else {
        acompanantes.textContent = 'No permite acompañantes';
    }

    if (evento.RutaImagen) {
        const imagen = document.getElementById('detail-img');
        imagen.src = `../${evento.RutaImagen}`;
        imagen.alt = `Póster de ${evento.Titulo}`;
        imagen.onerror = () => {
            imagen.onerror = null;
            imagen.src = '../assets/poster prueba.jpg';
        };
    }
}

function formatearFechaEvento(fecha) {
    if (!fecha) {
        return 'Fecha por confirmar';
    }

    const [anio, mes, dia] = fecha.substring(0, 10).split('-');
    const fechaLocal = new Date(
        Number(anio),
        Number(mes) - 1,
        Number(dia)
    );

    return fechaLocal.toLocaleDateString('es-HN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
