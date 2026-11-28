const API_ENTRADAS_URL = 'http://127.0.0.1:3000/api/entradas/evento';

const parametros = new URLSearchParams(window.location.search);
const idEvento = Number(parametros.get('idEvento'));
const listaEntradas = document.getElementById('tickets-list');
const btnAtras = document.getElementById('btn-back');
const btnCarrito = document.getElementById('btn-add-to-cart');
const linkCarrito = document.getElementById('link-carrito');
const cartBadge = document.getElementById('cart-badge');

const seleccionEntradas = {};


if (!Number.isInteger(idEvento) || idEvento <=0){
    mostrarMensaje('Evento no valido')
}else {
    btnAtras.href = `detalleevento.html?idEvento=${idEvento}`;
    cargarEntradas();

}

async function cargarEntradas() {
    try {
        const respuesta = await fetch(`${API_ENTRADAS_URL}/${idEvento}`);

        if(!respuesta.ok){
            throw new Error('No se pudieron cargar las entradas');
        }

        const entradas = await respuesta.json();
        mostrarEntradas(entradas);
    } catch (error) {
        console.error('Error cargando las entradas', error);
        mostrarMensaje('Error');
    }
    
}

function mostrarEntradas(entradas){
    listaEntradas.replaceChildren();

    if (entradas.length === 0) {
        mostrarMensaje('Entradas no disponibles');
        return;
    }

    entradas.forEach((entrada, index) => {
        const claveZona = entrada.IDZonasRecinto || entrada.IDAsignacion || index;
        seleccionEntradas[claveZona] = {
            ...entrada,
            cantidad: 0
        };

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('ticket-card');

        const info = document.createElement('div');
        info.classList.add('ticket-info');

        const nombre = document.createElement('p');
        nombre.classList.add('ticket-name');
        nombre.textContent = entrada.NombreZona;

        const detalles = document.createElement('span');
        detalles.classList.add('ticket-details');
        detalles.textContent =
            entrada.Detalles || 'Sin detalles para mostrar';

        const cupo = Number(entrada.CupoDisponible);

        const disponibles = document.createElement('span');
        disponibles.classList.add('ticket-dispo')
        disponibles.textContent = cupo > 0 ? `Disponibles: ${cupo}` : 'Agotado' ;

        const precio = document.createElement('p');
        precio.classList.add('ticket-price');
        precio.textContent = `L. ${Number(entrada.Precio).toFixed(2)}`;

        info.append(nombre, detalles, disponibles, precio);
        tarjeta.appendChild(info);

        const slctCantidad = crearSlctrCantidad(cupo);
        tarjeta.appendChild(slctCantidad);

        listaEntradas.appendChild(tarjeta);
    });
}

function crearSlctrCantidad(cuposDisp){
    const cantidadMax = Math.max(0, cuposDisp);
    let cantidad = 0;

    const selector = document.createElement('div');
    selector.classList.add('ticket-qty');

    const btnMenos = document.createElement('button');
    btnMenos.type = 'button';
    btnMenos.classList.add('qty-btn');
    btnMenos.textContent = '-';
    btnMenos.disabled = true;
    btnMenos.setAttribute('aria-label' , 'Restar entrada');


    const valor = document.createElement('span');
    valor.classList.add('qty-value');
    valor.textContent = cantidad;

    const btnMas = document.createElement('button');
    btnMas.type = 'button';
    btnMas.classList.add('qty-btn');
    btnMas.textContent = '+';
    btnMas.disabled = cantidadMax === 0;
    btnMas.setAttribute('aria-label' ,  'Agregar entrada')

    btnMenos.addEventListener('click', () => {
        if(cantidad > 0 ) {
            cantidad--;
            actualizarCantidad();
        }
    });

    btnMas.addEventListener('click', ()=>{
        if(cantidad < cantidadMax) {
            cantidad++;
            actualizarCantidad();
        }
    });

    function actualizarCantidad(){
        valor.textContent = cantidad;
        btnMenos.disabled = cantidad === 0;
        btnMas.disabled = cantidad === cantidadMax;
    }

    selector.append(btnMenos, valor, btnMas);
    return selector;
}

function actualizarEstadoCarrito() {
    const totalSeleccionadas = Object.value(seleccionEntradas).reduce(
        (acum, item) => acum + item.cantidad,
        0
    );

    if(cartBadge) {
        cartBadge.textContent = totalSeleccionadas;
    }

    if(btnCarrito) {
        btnCarrito.textContent = totalSeleccionadas === 0;
    }
}

if (btnCarrito) {
    btnCarrito.addEventListener('click', () => {
        const itemsElegidos = Object.values(seleccionEntradas).filter(item => item.cantidad > 0);
        if (itemsElegidos.length === 0) return;

        localStorage.setItem('carrito_pendiente', JSON.stringify({
            idEvento,
            items: itemsElegidos
        }));

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para continuar al carrito.');
            window.location.href = 'login.html?redirect=carrito.html';
            return;
        }

        window.location.href = 'carrito.html';
    });
}

if (linkCarrito) {
    linkCarrito.addEventListener('click', (e) => {
        const token = localStorage.getItem('token');
        if (!token) {
            e.preventDefault();
            alert('Debes iniciar sesión para ver tu carrito.');
            window.location.href = 'login.html?redirect=carrito.html';
        }
    });
}

function mostrarMensaje(mensaje) {
    listaEntradas.replaceChildren();

    const texto = document.createElement('p');
    texto.textContent = mensaje;
    listaEntradas.appendChild(texto);
}