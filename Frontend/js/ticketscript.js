document.addEventListener("DOMContentLoaded", () => {
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
});