export function showMfaInput(email) {

    sessionStorage.setItem("mfaEmail", email);

    document.querySelector("#loginForm").style.display = "none";

    document.querySelector("#mfaSection").style.display = "block";
}

