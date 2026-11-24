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

    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Método de pago registrado temporalmente.");
        cerrarModal();
    });
});