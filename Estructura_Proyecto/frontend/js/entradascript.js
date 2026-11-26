const API_ENTRADAS_URL = 'http://localhost:3000/api/entradas/evento';

const parametros = new URLSearchParams(window.location.search);
const idEvento = Number(parametros.get('idEvento'));
const listaEntradas = document.getElementById('tickets-list');
const enlaceAtras = document.getElementById('btn-back');

if (Number.isInteger(idEvento) && idEvento > 0) {
    enlaceAtras.href = `detalleevento.html?idEvento=${idEvento}`;
    cargarEntradas();
} else {
    mostrarMensaje('No se indicó un evento válido.');
}

async function cargarEntradas() {
    try {
        const respuesta = await fetch(`${API_ENTRADAS_URL}/${idEvento}`);
        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar las entradas.');
        }

        const entradas = await respuesta.json();
        mostrarEntradas(entradas);
    } catch (error) {
        console.error('Error al cargar las entradas:', error);
        mostrarMensaje('Ocurrió un error al cargar las entradas.');
    }
}

function mostrarEntradas(entradas) {
    listaEntradas.replaceChildren();

    if (entradas.length === 0) {
        mostrarMensaje('Este evento no tiene entradas disponibles.');
        return;
    }

    entradas.forEach(entrada => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('ticket-card');

        const informacion = document.createElement('div');
        informacion.classList.add('ticket-info');

        const nombre = document.createElement('p');
        nombre.classList.add('ticket-name');
        nombre.textContent = entrada.NombreZona;

        const detalles = document.createElement('span');
        detalles.classList.add('ticket-details');
        detalles.textContent = entrada.Detalles || 'Sin detalles adicionales';

        const cupo = Number(entrada.CupoDisponible);
        const disponibles = document.createElement('span');
        disponibles.classList.add('ticket-dispo');
        disponibles.textContent = cupo > 0
            ? `Disponibles: ${cupo}`
            : 'Agotado';

        const precio = document.createElement('p');
        precio.classList.add('ticket-price');
        precio.textContent = `L ${Number(entrada.Precio).toLocaleString('es-HN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

        informacion.append(nombre, detalles, disponibles, precio);
        tarjeta.appendChild(informacion);

        const selectorCantidad = crearSelectorCantidad(cupo);
        tarjeta.appendChild(selectorCantidad);
        listaEntradas.appendChild(tarjeta);
    });
}

function crearSelectorCantidad(cupoDisponible) {
    const cantidadMaxima = Math.max(0, cupoDisponible);
    let cantidad = 0;

    const selector = document.createElement('div');
    selector.classList.add('ticket-qty');

    const botonMenos = document.createElement('button');
    botonMenos.type = 'button';
    botonMenos.classList.add('qty-btn');
    botonMenos.textContent = '-';
    botonMenos.disabled = true;
    botonMenos.setAttribute('aria-label', 'Restar una entrada');

    const valor = document.createElement('span');
    valor.classList.add('qty-value');
    valor.textContent = cantidad;

    const botonMas = document.createElement('button');
    botonMas.type = 'button';
    botonMas.classList.add('qty-btn');
    botonMas.textContent = '+';
    botonMas.disabled = cantidadMaxima === 0;
    botonMas.setAttribute('aria-label', 'Agregar una entrada');

    botonMenos.addEventListener('click', () => {
        if (cantidad > 0) {
            cantidad--;
            actualizarCantidad();
        }
    });

    botonMas.addEventListener('click', () => {
        if (cantidad < cantidadMaxima) {
            cantidad++;
            actualizarCantidad();
        }
    });

    function actualizarCantidad() {
        valor.textContent = cantidad;
        botonMenos.disabled = cantidad === 0;
        botonMas.disabled = cantidad === cantidadMaxima;
    }

    selector.append(botonMenos, valor, botonMas);
    return selector;
}

function mostrarMensaje(mensaje) {
    listaEntradas.replaceChildren();
    const texto = document.createElement('p');
    texto.textContent = mensaje;
    listaEntradas.appendChild(texto);
}