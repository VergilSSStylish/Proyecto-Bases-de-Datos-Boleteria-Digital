// Etiqueta de la vista vw_MisBoletos → clase de color en tickets.css
const CLASE_ESTADO = { Activo: "active", Utilizado: "used", Vencido: "expired", Cancelado: "cancelled" };
const TEXTO_DEVOLUCION = { 1: "Devolución solicitada", 2: "Devolución aprobada", 3: "Devolución rechazada" };

document.addEventListener("DOMContentLoaded", () => {
    const API = "http://127.0.0.1:3000/api";
    const token = localStorage.getItem("token");
    const lista = document.getElementById("purchased-tickets-list");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const molde = lista.querySelector(".purchased-ticket-item"); // la tarjeta de ejemplo sirve de molde
    lista.replaceChildren();                                     // quita las tarjetas de ejemplo
    const qrModal = document.getElementById("qr-modal");
    const btnCloseQr = document.getElementById("btn-close-qr-modal");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const devolucionModal = document.getElementById("devolucion-modal");
    let grupos = {};          // boletos agrupados por orden y zona
    let boletoADevolver = null;

    // Toda petición lleva el token; sin token válido se vuelve al login
    async function api(ruta, opciones = {}) {
        const respuesta = await fetch(`${API}/tickets${ruta}`, {
            ...opciones,
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });
        if (respuesta.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
        return respuesta.json();
    }

    const formatoFecha = (b) => new Date(`${b.Fecha}T${b.HoraInicio}`).toLocaleString("es-HN",
        { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
    const icono = (nombre) => { const i = document.createElement("i"); i.className = `fa-solid ${nombre}`; return i; };
    const etiqueta = (texto, clase) => { const s = document.createElement("span"); s.className = clase; s.textContent = texto; return s; };

    // Consultar los tickets del usuario y agruparlos por orden + zona
    async function cargarTickets() {
        try {
            const resultado = await api("");
            if (!resultado.exitoso) throw new Error(resultado.mensaje || "Error al cargar tickets");

            grupos = {};
            resultado.tickets.forEach(b => {
                const clave = `${b.IDOrden}-${b.IDZonaPrecio}`;
                (grupos[clave] = grupos[clave] || []).push(b);
            });

            lista.replaceChildren();
            if (!resultado.tickets.length) {
                lista.textContent = "No tienes tickets comprados.";
                return;
            }
            Object.entries(grupos).forEach(([clave, boletos]) => lista.appendChild(crearTarjeta(clave, boletos)));
        } catch (error) {
            console.error("Error al cargar tickets:", error);
            lista.textContent = "No se pudieron cargar los tickets.";
        }
    }

    function crearTarjeta(clave, boletos) {
        const b = boletos[0];
        const tarjeta = molde.cloneNode(true);
        const hayActivos = boletos.some(x => x.Estado === "Activo");
        tarjeta.dataset.grupo = clave;
        tarjeta.dataset.status = hayActivos ? "active" : "past";
        tarjeta.classList.toggle("past-ticket", !hayActivos);
        tarjeta.querySelector(".ticket-order-id").textContent = `Orden #${String(b.IDOrden).padStart(5, "0")}`;
        tarjeta.querySelector(".ticket-event-name").textContent = b.Titulo;
        tarjeta.querySelector(".ticket-info").replaceChildren(
            icono("fa-calendar-days"), ` ${formatoFecha(b)} • `, icono("fa-location-dot"), ` ${b.NombreRecinto}`);
        tarjeta.querySelector(".badge-zone").textContent = `${b.NombreZona} (x${boletos.length})`;

        // Una etiqueta si todos tienen el mismo estado; si no, una por estado con su cantidad
        const conteo = {};
        boletos.forEach(x => conteo[x.Estado] = (conteo[x.Estado] || 0) + 1);
        const insignias = tarjeta.querySelector(".ticket-badges");
        insignias.querySelectorAll(".badge-status").forEach(e => e.remove());
        Object.entries(conteo).forEach(([estado, n]) => {
            const texto = Object.keys(conteo).length > 1 ? `${estado} (${n})` : estado;
            insignias.appendChild(etiqueta(texto, `badge-status ${CLASE_ESTADO[estado]}`));
        });

        tarjeta.querySelector(".btn-view-qr").disabled = !hayActivos;
        return tarjeta;
    }

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

    // "Ver entrada": muestra cada boleto del grupo; el QR solo de los activos
    lista.addEventListener("click", (e) => {
        const btnQr = e.target.closest(".btn-view-qr");
        if (!btnQr || btnQr.disabled) return;

        const ticketCard = btnQr.closest(".purchased-ticket-item");
        const boletos = grupos[ticketCard.dataset.grupo];
        document.getElementById("modal-qr-order").textContent = ticketCard.querySelector(".ticket-order-id").textContent;
        document.getElementById("modal-qr-event").textContent = boletos[0].Titulo;
        document.getElementById("modal-qr-meta").replaceChildren(...ticketCard.querySelector(".ticket-info").cloneNode(true).childNodes);
        document.getElementById("modal-qr-zone").textContent = ticketCard.querySelector(".badge-zone").textContent;

        document.getElementById("modal-qr-list").replaceChildren(...boletos.map((b, i) => crearItemQr(b, i + 1, boletos.length)));
        qrModal.classList.add("active");
    });

    // Cada boleto es una fila: el QR a la izquierda y sus datos a la derecha
    
function crearItemQr(b, numero, total) {
    const item = document.createElement("div");
    item.className = "qr-boleto";

    const devolucionPendiente =
        Number(b.TieneDevolucion) === 1 ||
        Number(b.EstadoDevolucion) === 1;

    const puedeMostrarQr =
        b.Estado === "Activo" && !devolucionPendiente;

    item.classList.toggle("inactivo", !puedeMostrarQr);

    const marco = document.createElement("div");
    marco.className = "qr-code-wrapper";

    if (puedeMostrarQr) {
        const img = document.createElement("img");
        img.alt = `QR del boleto ${b.CodigoAlfanumerico}`;
        marco.appendChild(img);

        api(`/${b.IDBoleto}/qr`).then(r => {
            if (r.exitoso) img.src = r.qr;
        });
    } else {
        marco.appendChild(icono("fa-qrcode qr-placeholder-icon"));
    }

    const info = document.createElement("div");
    info.className = "qr-info";

    const quien = b.EsAcompanante
        ? `Acompañante: ${b.NombreAcompanante}`
        : "Titular";

    info.appendChild(
        etiqueta(
            `Boleto ${numero} de ${total} · ${quien}`,
            "qr-order-tag"
        )
    );

    info.appendChild(
        etiqueta(b.Estado, `badge-status ${CLASE_ESTADO[b.Estado]}`)
    );

    if (devolucionPendiente) {
        info.appendChild(
            etiqueta("Devolución solicitada", "devolucion-tag")
        );
    } else if (b.EstadoDevolucion) {
        info.appendChild(
            etiqueta(
                TEXTO_DEVOLUCION[b.EstadoDevolucion],
                "devolucion-tag"
            )
        );
    }

    if (!devolucionPendiente) {
        info.appendChild(
            etiqueta(`Código: ${b.CodigoAlfanumerico}`, "qr-hint")
        );
    }

    if (!devolucionPendiente && !b.EstadoDevolucion && b.PuedeDevolver) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "btn-devolver";
        boton.textContent = "Solicitar devolución";
        boton.addEventListener("click", () => abrirDevolucion(b));
        info.appendChild(boton);
    }

    item.append(marco, info);
    return item;
}


    function cerrarModalQr() {
        qrModal.classList.remove("active");
    }

    btnCloseQr.addEventListener("click", cerrarModalQr);
    qrModal.addEventListener("click", (e) => {
        if (e.target === qrModal) cerrarModalQr();
    });
    document.getElementById("btn-print-qr").addEventListener("click", () => window.print());

    // Devolución: un motivo y el servidor decide si procede
    function abrirDevolucion(b) {
        boletoADevolver = b;
        document.getElementById("devolucion-info").textContent = b.EsAcompanante
            ? `Boleto ${b.CodigoAlfanumerico} (acompañante).`
            : `Boleto ${b.CodigoAlfanumerico}. Si tiene acompañantes, también se devolverán.`;
        document.getElementById("devolucion-motivo").value = "";
        document.getElementById("devolucion-error").hidden = true;
        devolucionModal.classList.add("active");
    }

    const cerrarDevolucion = () => devolucionModal.classList.remove("active");
    document.getElementById("btn-close-devolucion").addEventListener("click", cerrarDevolucion);

    document.getElementById("btn-enviar-devolucion").addEventListener("click", async () => {
        const resultado = await api("/devoluciones", {
            method: "POST",
            body: JSON.stringify({ idBoleto: boletoADevolver.IDBoleto, motivo: document.getElementById("devolucion-motivo").value.trim() })
        });
        if (!resultado.exitoso) {
            const error = document.getElementById("devolucion-error");
            error.textContent = resultado.mensaje;
            error.hidden = false;
            return;
        }
        cerrarDevolucion();
        cerrarModalQr();
        cargarTickets();
    });

    cargarTickets();
});
