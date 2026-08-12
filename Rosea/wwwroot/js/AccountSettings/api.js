
//const API_URL = "http://localhost:5223/api/auth"; // cambia puerto


const API_URL = "/api/auth"; // cambia puerto



export async function SaveChanges(email, password, passwordOld, passwordNew, passwordConfirm, enableMfa) {
    ///todo modify 
    return enableMfa(email);


    //  return retur null;
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
        body: JSON.stringify({ Email: email })
    });

    return await res.json();
}


export async function enableMfa(email, code) {

    const res = await fetch(API_URL + "/enable-mfa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify({
            Email: email,
            Code: code
        })
    });

    return await res.json();
}

export async function disableMfa(email, code) {

    const res = await fetch(API_URL + "/disable-mfa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify({
            email: email,
            code: code
        })
    });

    return await res.json();
}

export async function getMfaCurrentStatus(email) {

    const res = await fetch(API_URL + "/mfa-status/" + email, {
        headers: {
          
        }
    });

    return await res.json();
}

export async function changePassword(data) {

    const res = await fetch(API_URL + "/change-password", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },

        body: JSON.stringify(data)
    });

    return await res.json();
}

//,
//"Authorization": "Bearer " + sessionStorage.getItem("token")
// GENERAR QR PARA ACTIVAR MFA
//export async function setupMfa(email) {

//    const res = await fetch(API_URL + "/setup-mfa", {
//        method: "POST",
//        headers: {
//            "Content-Type": "application/json"
//        },
//        body: JSON.stringify({
//            email: email
//        })
//    });

//    return await res.json();
//}


// ACTIVAR MFA
//export async function enableMfa(email) {

//    const res = await fetch(API_URL + "/enable-mfa", {
//        method: "POST",
//        headers: {
//            "Content-Type": "application/json"
//        },
//        body: JSON.stringify({
//            email: email
//        })
//    });

//    return await res.json();
//}