const parametrosLogin = new URLSearchParams(window.location.search);
const urlRedireccion = parametrosLogin.get("redirect");

// Si ya hay una sesión válida, no se muestra el login: se va a Mi cuenta.
// Así nadie inicia sesión con otro usuario sin antes cerrar la sesión abierta.
const tokenGuardado = localStorage.getItem("token");
if (tokenGuardado) {
    document.body.style.visibility = "hidden"; // evita que el formulario se vea un instante
    fetch("http://127.0.0.1:3000/api/cuenta/perfil", { headers: { "Authorization": `Bearer ${tokenGuardado}` } })
        .then(r => {
            if (r.ok) return window.location.replace("cuenta.html");
            localStorage.removeItem("token"); // vencido o inválido: se queda en el login
            document.body.style.visibility = "";
        })
        .catch(() => { document.body.style.visibility = ""; });
}


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

// INICIO DE SESIÓN
const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", async function (e) {
    e.preventDefault();

    const correo = document.getElementById("login-correo").value;
    const contrasena = document.getElementById("login-contrasena").value;
    const recordarme = document.getElementById("recordarme").checked;

    try {
        const respuesta = await fetch(
            "http://127.0.0.1:3000/api/usuarios/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo,
                    contrasena,
                    recordarme
                })
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje);
            return;
        }

        localStorage.setItem("token", resultado.token);
        window.location.href = resultado.destino;

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("No se pudo conectar con el servidor.");
    }
});

// REGISTRO
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

formRegister.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validarContrasenas()) {
        confirmPasswordInput.focus();
        return;
    }

    const datos = {
        primerNombre: document.getElementById("pnombre").value,
        segundoNombre: document.getElementById("snombre").value,
        primerApellido: document.getElementById("papellido").value,
        segundoApellido: document.getElementById("sapellido").value,
        telefono: document.getElementById("telefono").value,
        correo: document.getElementById("correo").value,
        fechaNacimiento: document.getElementById("fechanac").value,
        genero: document.getElementById("genero").value,
        rtn: document.getElementById("RTN").value,
        contrasena: passwordInput.value
    };

    try {
        const respuesta = await fetch(
            "http://127.0.0.1:3000/api/usuarios/registro",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje || "No se pudo registrar el usuario.");
            return;
        }

        alert(resultado.mensaje);
        formRegister.reset();
        confirmPasswordInput.classList.remove("is-valid", "is-invalid");
        mostrarLogin();

    } catch (error) {
        console.error("Error al registrar:", error);
        alert("No se pudo conectar con el servidor.");
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