document.addEventListener("DOMContentLoaded", () => {
    const API = "http://127.0.0.1:3000/api";//añadí esta
const token = localStorage.getItem("token");
const lista = document.getElementById("purchased-tickets-list");//oj
if (!token) {
    window.location.href = "login.html";
    return;
}
//Agregué este


    // Consultar los tickets del usuario
    async function cargarTickets() {
        try {
            const respuesta = await fetch(`${API}/tickets`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const resultado = await respuesta.json();

            if (respuesta.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "login.html";
                return;
            }

            if (!respuesta.ok || !resultado.exitoso) {
                throw new Error(resultado.mensaje || "Error al cargar tickets");
            }

            mostrarTickets(resultado.tickets);

        } catch (error) {
            console.error("Error al cargar tickets:", error);
            lista.textContent = "No se pudieron cargar los tickets.";
        }
    }


 // Mostrar tickets
    function mostrarTickets(tickets) {
        lista.innerHTML = "";

        if (!tickets || tickets.length === 0) {
            lista.textContent = "No tienes tickets comprados.";
            return;
        }

        // Agrupar por orden, evento y zona
        const grupos = {};

        tickets.forEach(ticket => {
            const clave = `${ticket.IDOrden}-${ticket.IDEvento}-${ticket.NombreZona}`;

            if (!grupos[clave]) {
                grupos[clave] = {
                    ...ticket,
                    cantidad: 0
                };
            }

            grupos[clave].cantidad++;
        });

        Object.values(grupos).forEach(ticket => {
            const fecha = String(ticket.FechaEvento).slice(0, 10);
            const fechaActual = new Date().toISOString().slice(0, 10);
            const activo = fecha >= fechaActual;

            const tarjeta = document.createElement("div");
            tarjeta.className = "purchased-ticket-item";
            tarjeta.dataset.status = activo ? "active" : "past";

            tarjeta.innerHTML = `
                <div class="ticket-main">
                    <span class="ticket-order-id">
                        Orden #${String(ticket.IDOrden).padStart(5, "0")}
                    </span>

                    <h3 class="ticket-event-name">${ticket.Evento}</h3>

                    <p class="ticket-info">
                        <i class="fa-solid fa-calendar-days"></i> ${fecha}
                        •
                        <i class="fa-solid fa-location-dot"></i>
                        ${ticket.NombreRecinto || "Recinto no disponible"}
                    </p>

                    <div class="ticket-badges">
                        <span class="badge-zone">
                            ${ticket.NombreZona} (x${ticket.cantidad})
                        </span>
                        <span class="badge-status ${activo ? "active" : "used"}">
                            ${activo ? "Activo" : "Utilizado"}
                        </span>
                    </div>
                </div>

                <div class="ticket-actions">
                    <button type="button" class="btn-view-qr" ${activo ? "" : "disabled"}>
                        <i class="fa-solid fa-qrcode"></i> Ver entrada
                    </button>
                </div>
            `;

            lista.appendChild(tarjeta);
        });

        aplicarFiltro("all");
    }

function aplicarFiltro(filtro) {
    document.querySelectorAll(".purchased-ticket-item").forEach(item => {
        const status = item.getAttribute("data-status");
        item.style.display =
            (filtro === "all" || status === filtro) ? "flex" : "none";
    });
}


    const qrModal = document.getElementById("qr-modal");
    const btnCloseQr = document.getElementById("btn-close-qr-modal");
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.getAttribute("data-filter");
            document.querySelectorAll(".purchased-ticket-item").forEach(item => {
                const status = item.getAttribute("data-status");
                item.style.display = (filter === "all" || status === filter) ? "flex" : "none";
            });
        });
    });

    document.getElementById("purchased-tickets-list").addEventListener("click", (e) => {
        const btnQr = e.target.closest(".btn-view-qr");
        if (!btnQr || btnQr.disabled) return;

        const ticketCard = btnQr.closest(".purchased-ticket-item");
        const orderText = ticketCard.querySelector(".ticket-order-id").textContent;
        const eventName = ticketCard.querySelector(".ticket-event-name").textContent;
        const eventInfo = ticketCard.querySelector(".ticket-info").innerHTML;
        const zoneBadge = ticketCard.querySelector(".badge-zone").textContent;

        document.getElementById("modal-qr-order").textContent = orderText;
        document.getElementById("modal-qr-event").textContent = eventName;
        document.getElementById("modal-qr-meta").innerHTML = eventInfo;
        document.getElementById("modal-qr-zone").textContent = zoneBadge;
    
        qrModal.classList.add("active");
    });

    function cerrarModalQr() {
        qrModal.classList.remove("active");
    }

    btnCloseQr.addEventListener("click", cerrarModalQr);
    qrModal.addEventListener("click", (e) => {
        if (e.target === qrModal) cerrarModalQr();
    });
    cargarTickets();
});