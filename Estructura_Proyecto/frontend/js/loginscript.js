function mostrarLogin() {
    document.getElementById("login-section").style.display = "flex";
    document.getElementById("register-section").style.display = "none";
}

function mostrarRegistro() {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("register-section").style.display = "flex";
}


window.mostrarLogin = mostrarLogin;
window.mostrarRegistro = mostrarRegistro;

const formRegister = document.getElementById("form-register");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

function validarContrasenas() {
    const pass = passwordInput.value;
    const confirmPass = confirmPasswordInput.value;

    if (confirmPass === "") {
        confirmPasswordInput.classList.remove("is-invalid", "is-valid");
        return false;
    }

    if (pass === confirmPass) {
        confirmPasswordInput.classList.remove("is-invalid");
        confirmPasswordInput.classList.add("is-valid");
        return true;
    } else {
        confirmPasswordInput.classList.remove("is-valid");
        confirmPasswordInput.classList.add("is-invalid");
        return false;
    }
}

passwordInput.addEventListener("input", validarContrasenas);
confirmPasswordInput.addEventListener("input", validarContrasenas);

formRegister.addEventListener("submit", function (e) {
    if (!validarContrasenas()) {
        e.preventDefault();
        confirmPasswordInput.focus();
    }
});

/* registro 
const formRegistro = document.getElementById("form-registro");

formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault();

    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let pass1 = document.getElementById("password").value;
    let pass2 = document.getElementById("password2").value;

    let error = document.getElementById("error-registro");

    error.style.display = "none";
    error.innerText = "";

    if (pass1 !== pass2) {
        error.innerText = "Las contraseñas no coinciden.";
        error.style.display = "block";
        return;
    }

    let res = await fetch("http://localhost:4000/api/auth/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contraseña: pass1 })
    });

    let json = await res.json();

    if (res.ok) {
        localStorage.setItem("usuario", JSON.stringify(json.usuario));
        window.location.href = "projects.html";
    } else {
        alert(json.mensaje);
    }
});

// login
const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    let correo = document.getElementById("login-correo").value;
    let contraseña = document.getElementById("login-password").value;

    let res = await fetch("http://localhost:4000/api/auth/iniciar-sesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña })
    });

    let json = await res.json();

    if (res.ok) {
        localStorage.setItem("usuario", JSON.stringify(json.usuario));
        window.location.href = "projects.html";
    } else {
        alert(json.mensaje);
    }
});
*/