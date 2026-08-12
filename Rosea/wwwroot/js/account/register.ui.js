export function getData() {
    return {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };
}

export function showMessage(msg) {
    document.getElementById("msg").innerText = msg;
}