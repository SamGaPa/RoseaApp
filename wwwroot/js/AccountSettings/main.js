import * as api from "./api.js";
import * as ui from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {

    const form = document.querySelector("#accountSettingsForm");
    const toggle = document.querySelector("#enable2FA");
    const email = document.querySelector("#UserMail").value;



    const MFA2STATUS =await  api.getMfaCurrentStatus(email);


    if (MFA2STATUS.enabled) {

        toggle.checked = true;

        document.querySelector("#mfaStatus").innerText =
            "La autenticación de dos factores está activa"; 

    }
    else
    {

        toggle.checked = false;

        document.querySelector("#mfaStatus").innerText =
            "Activar autenticación de dos factores";

    }
    

    toggle.addEventListener("change", async function () {

        if (this.checked) {

                if (!this.checked)
                    return;

                const data = await api.setupMfa(email);

                ui.showQr(email, data.secret);

        } else {

            ui.showDisableMfa();

        }

    });

    //toggle.addEventListener("change", async function () {

    //    if (!this.checked)
    //        return;

    //    const data = await api.setupMfa(email);

    //    ui.showQr(email, data.secret);

    //});


    btnDisableMfa.addEventListener("click", async () => {

        const email = document.querySelector("#UserMail").value;
        const code = document.querySelector("#disableCode").value;

        const res = await api.disableMfa(email, code);

        if (!res.success) {
            alert("Código incorrecto");
            return;
        }

        alert("MFA desactivado");

        location.reload();

    });


    const btnVerify = document.querySelector("#btnVerifyMfa");

    btnVerify.addEventListener("click", async () => {

        const email = document.querySelector("#UserMail").value;
        const code = document.querySelector("#mfaCode").value;

        const res = await api.enableMfa(email, code);

        if (!res.success) {
            alert("Código incorrecto");
            return;
        }

        alert("Autenticación de dos factores activada");

        location.reload();
    });


    //form.addEventListener("submit", async function (e) {

    //    e.preventDefault();

    //    const email = document.querySelector("#UserMail").value;
    //    const passwordOld = document.querySelector("#passwordCurrent").value;
    //    const passwordNew = document.querySelector("#passwordNew").value;
    //    const passwordConfirm = document.querySelector("#passwordConfirm").value;
    //    const enableMfa = document.querySelector("#enable2FA").value;
    //   //const data = await api.SaveChanges(email, password, passwordOld, passwordNew, passwordConfirm, enableMfa);

    //    //----show the QR to setup MFA if enabled and not setup yet
    //    //if (data.requiresMfaSetup) {
    //    //    ui.showMfaSetup(data.qrCode);
    //    //    return;
    //    //}
    //});


    document.querySelector("#accountSettingsForm")
        .addEventListener("submit", async function (e) {

            e.preventDefault();

            const email = document.querySelector("#UserMail").value;

            const current = document.querySelector("#passwordCurrent").value;
            const newPass = document.querySelector("#passwordNew").value;
            const confirm = document.querySelector("#passwordConfirm").value;

            if (!current || !newPass || !confirm) {
                alert("Complete todos los campos");
                return;
            }

            const data = await api.changePassword({
                email: email,
                currentPassword: current,
                newPassword: newPass,
                confirmPassword: confirm
            });

            if (!data.success) {
                alert(data.message);
                return;
            }

            alert("Contraseña actualizada correctamente");

        });

});
