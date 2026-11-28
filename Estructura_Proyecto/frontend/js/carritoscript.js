const API_CARRITO_URL = 'http://127.0.0.1:3000/api/carrito';
const API_TARJETAS_URL = 'http://127.0.0.1:3000/api/cuenta/metodos-pago';

const token = localStorage.getItem('token');

if (!token) {
    window.location.replace('login.html?redirect=carrito.html');
}

const timerBanner = document.getElementById('reservation-timer-banner');
const timerCountdown = document.getElementById('timer-countdown');
const cartItemsList = document.getElementById('cart-items-list');
const cartBadge = document.getElementById('cart-badge');
const discountSelect = document.getElementById('discount-select');
const paymentMethodSelect = document.getElementById('payment-method-select');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryDiscount = document.getElementById('summary-discount');
const summaryTotal = document.getElementById('summary-total');
const btnConfirmOrder = document.getElementById('btn-confirm-order');

let itemsActuales = [];
let subtotalActual = 0;
let intervaloTemporizador = null;

function formatearMoneda(monto) {
    return `L ${Number(monto).toLocaleString('es-HN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return 'Fecha por confirmar';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-HN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await sincronizarCarritoPendiente();
    await Promise.all([cargarCarrito(), cargarMetodosPago()]);
});

//si el usuario viene de otra pantalla
async function sincronizarCarritoPendiente() {
    const pendienteRaw = localStorage.getItem('carrito_pendiente');
    if (!pendienteRaw) return;

    try {
        const pendiente = JSON.parse(pendienteRaw);
        if (!pendiente || !pendiente.idEvento || !Array.isArray(pendiente.items) || pendiente.items.length === 0) {
            localStorage.removeItem('carrito_pendiente');
            return;
        }

        const resp = await fetch(`${API_CARRITO_URL}/reservar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                idEvento: pendiente.idEvento,
                items: pendiente.items.map(i => ({
                    IDZonaPrecio: i.IDZonaPrecio,
                    cantidad: i.cantidad
                }))
            })
        });

        const data = await resp.json();
        localStorage.removeItem('carrito_pendiente');

        if (!resp.ok) {
            alert(data.mensaje || 'No se pudieron reservar algunas entradas.');
        }
    } catch (error) {
        console.error('Error sincronizando selección pendiente:', error);
    }
}

async function cargarCarrito() {
    try {
        const resp = await fetch(API_CARRITO_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (resp.status === 401 || resp.status === 403) {
            localStorage.removeItem('token');
            window.location.replace('login.html?redirect=carrito.html');
            return;
        }

        if (!resp.ok) throw new Error('Error al obtener carrito');

        const data = await resp.json();
        itemsActuales = data.items || [];

        renderizarDescuentos(data.descuentos || []);
        renderizarItems(itemsActuales);
        iniciarTemporizador(data.segundosRestantes || 0);
        recalcularTotales();
    } catch (error) {
        console.error('Error cargando carrito:', error);
        cartItemsList.innerHTML = `<p style="color: #9ca3af; text-align: center; padding: 1.5rem;">No se pudo cargar tu carrito.</p>`;
    }
}

async function cargarMetodosPago() {
    try {
        const resp = await fetch(API_TARJETAS_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resp.ok) throw new Error('Error al cargar tarjetas');

        const tarjetas = await resp.json();
        paymentMethodSelect.replaceChildren();

        if (tarjetas.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No tienes tarjetas guardadas (Agrega una en Mi Cuenta)';
            paymentMethodSelect.appendChild(opt);
            return;
        }

        tarjetas.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.IDTarjeta;
            opt.textContent = `${t.Marca} terminada en •••• ${t.Ultimos4} (${t.Titular})`;
            paymentMethodSelect.appendChild(opt);
        });
    } catch (error) {
        console.error('Error cargando métodos de pago:', error);
    }
}

function renderizarDescuentos(descuentos) {
    if (!descuentos || descuentos.length === 0) return;

    const valorPrevio = discountSelect.value;
    discountSelect.replaceChildren();

    descuentos.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.IDTipoDescuento;
        opt.dataset.percent = (Number(d.Descuento) / 100).toString();
        opt.textContent = `${d.Nombre} (${Number(d.Descuento)}%)`;
        discountSelect.appendChild(opt);
    });

    if ([...discountSelect.options].some(o => o.value === valorPrevio)) {
        discountSelect.value = valorPrevio;
    }
}

function renderizarItems(items) {
    cartItemsList.replaceChildren();

    const totalBoletos = items.reduce((acc, item) => acc + Number(item.Cantidad), 0);
    if (cartBadge) cartBadge.textContent = totalBoletos;

    if (items.length === 0) {
        if (timerBanner) timerBanner.style.display = 'none';
        btnConfirmOrder.disabled = true;
        btnConfirmOrder.style.opacity = '0.5';

        cartItemsList.innerHTML = `
            <div style="text-align: center; padding: 2.5rem 1rem; color: #9ca3af;">
                <i class="fa-solid fa-cart-arrow-down" style="font-size: 2.5rem; margin-bottom: 0.8rem; color: #277dff;"></i>
                <p style="margin-bottom: 1rem; font-size: 1.05rem;">Tu carrito está vacío o tu reserva expiró.</p>
                <a href="eventos.html" class="continue-link">Explorar eventos disponibles</a>
            </div>
        `;
        return;
    }

    if (timerBanner) timerBanner.style.display = 'flex';
    btnConfirmOrder.disabled = false;
    btnConfirmOrder.style.opacity = '1';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'cart-item';

        card.innerHTML = `
            <div class="cart-item-info">
                <span class="item-event-title">${item.NombreEvento}</span>
                <p class="item-zone">Zona ${item.NombreZona} • ${item.Cantidad} entrada(s)</p>
                <span class="item-meta">
                    <i class="fa-solid fa-calendar-days"></i> ${formatearFecha(item.FechaEvento)} • 
                    <i class="fa-solid fa-location-dot"></i> ${item.NombreRecinto}
                </span>
            </div>
            <div class="cart-item-actions">
                <span class="item-subtotal">${formatearMoneda(item.Subtotal)}</span>
                <button type="button" class="btn-remove" data-zona="${item.IDZonaPrecio}" title="Eliminar entrada">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        const btnRemove = card.querySelector('.btn-remove');
        btnRemove.addEventListener('click', () => eliminarItem(item.IDZonaPrecio));

        cartItemsList.appendChild(card);
    });
}

async function eliminarItem(idZonaPrecio) {
    try {
        const resp = await fetch(`${API_CARRITO_URL}/item/${idZonaPrecio}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resp.ok) {
            const err = await resp.json();
            alert(err.mensaje || 'No se pudo eliminar la entrada.');
            return;
        }

        await cargarCarrito();
    } catch (error) {
        console.error('Error al eliminar ítem:', error);
    }
}

function recalcularTotales() {
    subtotalActual = itemsActuales.reduce((acc, item) => acc + Number(item.Subtotal), 0);

    const opcionSeleccionada = discountSelect.options[discountSelect.selectedIndex];
    const porcentaje = opcionSeleccionada ? Number(opcionSeleccionada.dataset.percent || 0) : 0;

    const descuento = Number((subtotalActual * porcentaje).toFixed(2));
    const total = Math.max(0, Number((subtotalActual - descuento).toFixed(2)));

    summarySubtotal.textContent = formatearMoneda(subtotalActual);
    summaryDiscount.textContent = `- ${formatearMoneda(descuento)}`;
    summaryTotal.textContent = formatearMoneda(total);
}

discountSelect.addEventListener('change', recalcularTotales);

function iniciarTemporizador(segundosIniciales) {
    if (intervaloTemporizador) clearInterval(intervaloTemporizador);

    let restantes = Number(segundosIniciales);
    if (restantes <= 0) {
        timerCountdown.textContent = '00:00';
        return;
    }

    const actualizarTexto = () => {
        const min = Math.floor(restantes / 60);
        const seg = restantes % 60;
        timerCountdown.textContent = `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
    };

    actualizarTexto();

    intervaloTemporizador = setInterval(async () => {
        restantes--;
        if (restantes <= 0) {
            clearInterval(intervaloTemporizador);
            timerCountdown.textContent = '00:00';
            alert('El tiempo de reserva de tus entradas ha expirado.');
            await cargarCarrito();
            return;
        }
        actualizarTexto();
    }, 1000);
}

btnConfirmOrder.addEventListener('click', async () => {
    if (itemsActuales.length === 0) return;

    const idTarjeta = paymentMethodSelect.value;
    if (!idTarjeta) {
        alert('Debes seleccionar o agregar una tarjeta en "Mi cuenta" antes de confirmar la compra.');
        return;
    }

    const idTipoDescuento = Number(discountSelect.value) || 1;

    btnConfirmOrder.disabled = true;
    btnConfirmOrder.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Procesando compra...`;

    try {
        const resp = await fetch(`${API_CARRITO_URL}/confirmar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                idTipoDescuento,
                idTarjeta: Number(idTarjeta)
            })
        });

        const resultado = await resp.json();

        if (!resp.ok) {
            alert(resultado.mensaje || 'No se pudo completar la compra.');
            btnConfirmOrder.disabled = false;
            btnConfirmOrder.innerHTML = `<i class="fa-solid fa-lock"></i> Confirmar Compra`;
            await cargarCarrito();
            return;
        }

        if (intervaloTemporizador) clearInterval(intervaloTemporizador);
        alert(`${resultado.mensaje}\nOrden #${resultado.idOrden} • Total pagado: ${formatearMoneda(resultado.totalPagado)}`);
        window.location.href = 'tickets.html';
    } catch (error) {
        console.error('Error al confirmar orden:', error);
        alert('Ocurrió un error de conexión al procesar tu pago.');
        btnConfirmOrder.disabled = false;
        btnConfirmOrder.innerHTML = `<i class="fa-solid fa-lock"></i> Confirmar Compra`;
    }
});