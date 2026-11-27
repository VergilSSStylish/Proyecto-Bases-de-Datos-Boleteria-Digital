const API_ENTRADAS_URL = 'http://127.0.0.1:3000/api/entradas/evento';

const parametros = new URLSearchParams(window.location.search);
const idEvento = Number(parametros.get('idEvento'));
const listaEntradas = document.getElementById('tickets-list');
const btnAtras = document.getElementById('btn-back');

if (!Number.isInteger(idEvento) || idEvento <=0){
    mostrarMensaje('Evento no valido')
}else {
    btnAtras.href = `detalleevento.html?idEvento=${idEvento}`;
    const token = localStorage.getItem('token');

    if(!token){
        mostrarMensaje('Registrate para consultar las entradas')
    }else{
        cargarEntradas(token);
    }
}

async function cargarEntradas(token) {
    try {
        const respuesta = await fetch(`${API_ENTRADAS_URL}/${idEvento}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (respuesta.status === 401) {
            localStorage.removeItem('token');
            mostrarMensaje('Sesion Expirada - Inicia Sesion nuevamente');
            return;
        }

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

    entradas.forEach(entrada => {
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

function mostrarMensaje(mensaje) {
    listaEntradas.replaceChildren();

    const texto = document.createElement('p');
    texto.textContent = mensaje;
    listaEntradas.appendChild(texto);
}