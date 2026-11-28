
const API_URL = 'http://127.0.0.1:3000/api/eventos';

let todosLosEventos = [];
let categoriaSeleccionada = 'all';
async function cargarEventos() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            throw new Error('Error al obtener los eventos');
        }
        todosLosEventos = await respuesta.json();

        // Carrusel de fondo (si la página tiene #hero-carousel-track)
        mostrarCarruselFondo(todosLosEventos);

        if (document.querySelector('.events-container')) {
            const hoy = new Date().toISOString().substring(0, 10);
            const proximos = todosLosEventos
                .filter(evento => evento.Fecha.substring(0, 10) >= hoy)
                .sort((a, b) => a.Fecha.localeCompare(b.Fecha))
                .slice(0, 3);
            mostrarEventos(proximos);
        } else {
            mostrarEventos(todosLosEventos);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function mostrarEventos(eventos) {
    const contenedor = document.getElementById('events-container')
        || document.querySelector('.events-container');

    contenedor.replaceChildren();
    if (eventos.length === 0) {
        contenedor.textContent = 'No se encontraron eventos.';
        return;
    }
    eventos.forEach(evento => {
        const tarjeta = document.createElement('a');
        tarjeta.classList.add('event-card');
        const rutaDetalle = location.pathname.includes('/pantallas/')
            ? 'detalleevento.html'
            : 'pantallas/detalleevento.html';
        tarjeta.href = `${rutaDetalle}?idEvento=${evento.IDEvento}`;
        tarjeta.style.textDecoration = 'none';
        const contenedorImagen = document.createElement('div');
        contenedorImagen.classList.add('event-img');
        const imagen = document.createElement('img');
        imagen.classList.add('event-image');
        // Obtener la ruta correcta según la página
        const rutaBase = location.pathname.includes('/pantallas/')
            ? '../'
            : '';
        imagen.src = evento.RutaImagen
        ? rutaBase + evento.RutaImagen
        : rutaBase + 'assets/poster prueba.jpg';
        imagen.alt = evento.Titulo;
        imagen.onerror = () => {
            imagen.onerror = null;
            imagen.src = rutaBase + 'assets/poster prueba.jpg';
        };
        contenedorImagen.appendChild(imagen);
        const informacion = document.createElement('div');
        informacion.classList.add('event-info');
        const categorias = document.createElement('p');
        categorias.classList.add('event-category');
        categorias.textContent = (evento.Categorias || []).join(' · ');
        const titulo = document.createElement('h4');
        titulo.classList.add('event-title');
        titulo.textContent = evento.Titulo;
        const fecha = document.createElement('p');
        fecha.classList.add('event-date');
        fecha.textContent = formatearFecha(evento.Fecha);
        const ubicacion = document.createElement('p');
        ubicacion.classList.add('event-location');
        const icono = document.createElement('i');
        icono.classList.add('fa-solid', 'fa-location-dot');
        ubicacion.append(
            icono,
            document.createTextNode(
                ` ${evento.NombreRecinto}, ${evento.Municipio}`
            )
        );
        informacion.append(
            categorias,
            titulo,
            fecha,
            ubicacion
        );
        tarjeta.append(contenedorImagen, informacion);
        contenedor.appendChild(tarjeta);
    });
}

let intervaloCarruselFondo = null;

function mostrarCarruselFondo(eventos) {
    const track = document.getElementById('hero-carousel-track');
    if (!track) return;

    track.replaceChildren();

    if (intervaloCarruselFondo) {
        clearInterval(intervaloCarruselFondo);
    }

    const rutaBase = location.pathname.includes('/pantallas/')
        ? '../'
        : '';

    const rutaImagen = rutaBase + 'assets/poster prueba.jpg';

    // Tres imágenes visibles y una copia para el desplazamiento
    for (let i = 0; i < 4; i++) {
        const img = document.createElement('img');
        img.src = rutaImagen;
        img.alt = '';
        track.appendChild(img);
    }

    let posicion = 0;

    intervaloCarruselFondo = setInterval(() => {
        posicion++;

        track.style.transition = 'transform 1s ease';
        track.style.transform = `translateX(-${posicion * 33.333}%)`;

        if (posicion === 1) {
            setTimeout(() => {
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                posicion = 0;
            }, 1000);
        }
    }, 4000);
}



function formatearFecha(fecha) {
    if (!fecha) return 'Fecha por confirmar';
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

function aplicarFiltros() {
    const busqueda = document.getElementById('search-input')
        .value.toLowerCase().trim();
    const eventosFiltrados = todosLosEventos.filter(evento => {
        const coincideTitulo = evento.Titulo
            ?.toLowerCase().includes(busqueda);
        const categorias = evento.Categorias || [];
        const coincideCategoria =
            categoriaSeleccionada === 'all' ||
            categorias.some(categoria =>
                categoria.toLowerCase() ===
                categoriaSeleccionada.toLowerCase()
            );
        return coincideTitulo && coincideCategoria;
    });
    mostrarEventos(eventosFiltrados);
}
const campoBusqueda = document.getElementById('search-input');
if (campoBusqueda) {
    campoBusqueda.addEventListener('input', aplicarFiltros);
}
async function cargarCategorias() {
    const contenedor = document.getElementById('category-filters');
    if (!contenedor) return;
    try {
        const respuesta = await fetch(
            'http://127.0.0.1:3000/api/eventos/categorias'
        );
        if (!respuesta.ok) {
            throw new Error('Error al obtener categorías');
        }
        const categorias = await respuesta.json();
        categorias.forEach(fila => {
            const boton = document.createElement('button');
            boton.classList.add('filter-btn');
            boton.dataset.category = fila.Categoria;
            boton.textContent = fila.Categoria;
            // Evento para seleccionar la categoría
            boton.addEventListener('click', () => {
                document.querySelector('.filter-btn.active')
                    ?.classList.remove('active');
                boton.classList.add('active');
                categoriaSeleccionada = fila.Categoria;
                aplicarFiltros();
            });
            contenedor.appendChild(boton);
        });
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
    const botonTodos = contenedor.querySelector('[data-category="all"]');
    botonTodos.addEventListener('click', () => {
    document.querySelector('.filter-btn.active')
        ?.classList.remove('active');
    botonTodos.classList.add('active');
    categoriaSeleccionada = 'all';
    aplicarFiltros();
});
}
cargarEventos();
if (document.getElementById('category-filters')) {
    cargarCategorias();
}