

export function showQr(email, secret) {

    const section = document.querySelector("#mfaSetupSection");

    section.style.display = "block";

    document.querySelector("#mfaSecret").innerText = secret;

    const qrText = `otpauth://totp/Rosea:${email}?secret=${secret}&issuer=Rosea`;

    const qrContainer = document.getElementById("qrcode");

    qrContainer.innerHTML = "";

    new QRCode(qrContainer, {
        text: qrText,
        width: 200,
        height: 200
    });
}

export function showDisableMfa() {

    const section = document.querySelector("#disableMfaSection");

    section.style.display = "block";


}

export function showMfaInput(email) {

    sessionStorage.setItem("mfaEmail", email);

    document.querySelector("#loginSection").style.display = "none";

    document.querySelector("#mfaSection").style.display = "block";
}

