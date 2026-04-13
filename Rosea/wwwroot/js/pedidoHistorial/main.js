document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const row = document.getElementById("detalle-" + id);

        if (row.style.display === "none") {
            row.style.display = "table-row";
            btn.textContent = "Ocultar";
        } else {
            row.style.display = "none";
            btn.textContent = "Mostrar más";
        }
    });
});