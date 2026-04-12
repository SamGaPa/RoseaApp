import * as api from "./api.js";
import * as ui from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#loginForm");

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
       
        const data = await api.login(email, password);

        if (!data) return;

        // SI requiere MFA
        if (data.requiresMfa) {

            ui.showMfaInput(email);
            return;
        }

        // LOGIN NORMAL
        completeLogin(data, email);
    });

});

async function submitMfa() {

    const email = sessionStorage.getItem("mfaEmail");
    const code = document.querySelector("#mfaCode").value;

    const data = await api.verifyMfa(email, code);

    if (!data) return;

    completeLogin(data, email);
}

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.querySelector("#btnVerifyMfa");

    if (!btn) return;

    btn.addEventListener("click", submitMfa);

});

async function completeLogin(data, email) {

    // guardar JWT en cookie
    document.cookie = "jwt=" + data.token + "; path=/";
    sessionStorage.setItem("token", data.token); // opcional, para usar en JS
    // llamar al endpoint para que el servidor cree Session["Usuario"] y ["Rol"]
    try {
        await fetch("/Account/SetSession", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: email,
                rol: data.rol
            })
        });
    } catch (err) {
        console.error("Error seteando sesión:", err);
    }

    if (data.rol === "ADMIN")
        window.location = "/Admin";
    else
        window.location = "/Store";
}