// PARTE DE OMAR
const API = 'http://localhost:3000/api';
const token = localStorage.getItem('token');

// Ajusta el nombre de la página de login cuando tu compañero la tenga
if (!token) location.href = 'login.html';

async function api(ruta, opciones = {}) {
    const res = await fetch(API + ruta, {
        ...opciones,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    if (res.status === 401) {
        localStorage.removeItem('token');
        location.href = 'login.html';
        return;
    }
    return res.json();
}
//PARTE DE TRINA

document.addEventListener("DOMContentLoaded", () => {
    const btnOpenModal = document.getElementById("btn-add-payment");
    const paymentModal = document.getElementById("payment-modal");
    const btnCloseModal = document.getElementById("btn-close-payment-modal");
    const btnCancel = document.getElementById("btn-cancel-payment");
    const paymentForm = document.getElementById("add-payment-form");

    const cardNumberInput = document.getElementById("card-number");
    const cardExpiryInput = document.getElementById("card-expiry");

    btnOpenModal.addEventListener("click", () => {
        paymentModal.classList.add("active");
    });

    function cerrarModal() {
        paymentModal.classList.remove("active");
        paymentForm.reset();
    }

    btnCloseModal.addEventListener("click", cerrarModal);
    btnCancel.addEventListener("click", cerrarModal);

    paymentModal.addEventListener("click", (e) => {
        if (e.target === paymentModal) {
            cerrarModal();
        }
    });

    cardNumberInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/(.{4})/g, "$1 ").trim();
        e.target.value = value;
    });

    cardExpiryInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 3) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4);
        }
        e.target.value = value;
    });
    //PARTE DE OMAR DE CONEXION DE FRONTED CON BACKEND, como odio esto
        // Perfil
    async function cargarPerfil() {
        const u = await api('/cuenta/perfil');
        if (!u) return;
        document.getElementById('profile-name').textContent = u.Nombre;
        document.getElementById('profile-email').textContent = u.Correo;
    }

    // Tarjetas
    const iconos = { visa: 'fa-cc-visa', mastercard: 'fa-cc-mastercard' };

    async function cargarTarjetas() {
        const tarjetas = await api('/cuenta/metodos-pago');
        if (!tarjetas) return;
        const lista = document.getElementById('payment-methods-list');
        lista.innerHTML = '';

        if (tarjetas.length === 0) {
            lista.innerHTML = '<p class="payment-expiry">No tienes métodos de pago guardados.</p>';
            return;
        }

        tarjetas.forEach(t => {
            const clave = t.Marca.toLowerCase();
            const icono = iconos[clave] ? 'fa-brands ' + iconos[clave] : 'fa-solid fa-credit-card';
            const mes = String(t.MesExp).padStart(2, '0');
            const anio = String(t.AnioExp).slice(-2);
            lista.insertAdjacentHTML('beforeend', `
                <div class="payment-item">
                    <div class="payment-details">
                        <i class="${icono} payment-icon"></i>
                        <div>
                            <p class="payment-title">${t.Marca} terminada en •••• ${t.Ultimos4}</p>
                            <span class="payment-expiry">Expira: ${mes}/${anio}</span>
                        </div>
                    </div>
                    <button type="button" class="btn-icon-delete" data-id="${t.IDTarjeta}" title="Eliminar método">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>`);
        });
    }

    // Eliminar tarjeta
    document.getElementById('payment-methods-list').addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-icon-delete');
        if (!btn) return;
        if (!confirm('¿Eliminar esta tarjeta?')) return;
        const r = await api('/cuenta/metodos-pago/' + btn.dataset.id, { method: 'DELETE' });
        if (r && r.mensaje === 'Método de pago eliminado') {
            cargarTarjetas();
        } else {
            alert(r?.mensaje || 'No se pudo eliminar la tarjeta');
        }
    });

    // QUITE LA PARTE DE TRINA PARA PONER LA PARTE CORRECTA
     paymentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const datos = {
            titular: document.getElementById('card-holder').value,
            numero: cardNumberInput.value,
            expiracion: cardExpiryInput.value
            // el CVV NO se envía ni se guarda
        };
        const r = await api('/cuenta/metodos-pago', { method: 'POST', body: JSON.stringify(datos) });
        if (r && r.IDTarjeta) {
            cerrarModal();
            cargarTarjetas();
        } else {
            alert(r?.mensaje || 'No se pudo guardar la tarjeta');
        }
    });


    //PARTE DE OMAR
        // Cerrar sesión
    document.getElementById('btn-logout').addEventListener('click', async () => {
        await api('/cuenta/logout', { method: 'POST' });
        localStorage.removeItem('token');
        location.href = 'login.html';
    });

    // Al cargar la página SIEMPRE PASARA ESO
    cargarPerfil();
    cargarTarjetas();
});