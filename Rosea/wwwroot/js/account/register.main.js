//import { register } from "./register.api.js";
//import { getData, showMessage } from "./register.ui.js";

import * as api from "./register.api.js";
import * as ui from  "./register.ui.js";


document.getElementById("btnRegister").addEventListener("click", async () => {


    // comentar para hackear el capcha en pruebas, pero no olvidar descomentar para producción
    const captcha = grecaptcha.getResponse();

    if (!captcha) {
        alert("Por favor completa el captcha");
        return;
    }


    const data = ui.getData();

    const res = await api.register(data);

    ui.showMessage(res + " Redirigiendo en 5 segundos...");

  
    // Esperar 5 segundos antes de redirigir
    if (res.includes("Usuario creado")) {
        setTimeout(() => {
            window.location = "/Account/Login";
        }, 5000);
    }
    else {
        ui.showMessage(res + ", Error al crear usuario Intenta nuevamente");
    }

});