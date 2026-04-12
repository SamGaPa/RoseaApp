
//const API_URL = "http://localhost:5223/api/auth"; // cambia puerto
const API_URL = "/api/auth"; // cambia puerto

// LOGIN
export async function login(email, password) {

    const res = await fetch(API_URL + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Email: email,
            PasswordHash: password
        })
    });

    if (!res.ok) {
        alert("Credenciales incorrectas");
        return null;
    }

    return await res.json();
}



// VALIDAR CÓDIGO MFA
export async function verifyMfa(email, code) {

    const res = await fetch(API_URL + "/verify-mfa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            code: code
        })
    });

    if (!res.ok) {
        alert("Código MFA incorrecto");
        return null;
    }

    return await res.json();
}


// GENERAR QR PARA ACTIVAR MFA
export async function setupMfa(email) {

    const res = await fetch(API_URL + "/setup-mfa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email
        })
    });

    return await res.json();
}


// ACTIVAR MFA
export async function enableMfa(email) {

    const res = await fetch(API_URL + "/enable-mfa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email
        })
    });

    return await res.json();
}