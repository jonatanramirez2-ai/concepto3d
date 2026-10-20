document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    const year = document.getElementById("currentYear");
    const submitButton = form?.querySelector('button[type="submit"]');

    const EMAILJS_PUBLIC_KEY = "8-W5y5lDz5FuiGvQg";
    const EMAILJS_SERVICE_ID = "service_jevqc44";
    const EMAILJS_TEMPLATE_ID = "template_9wuiwwh";

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    if (!form || !status || !submitButton) {
        console.error("No se encontraron los elementos del formulario.");
        return;
    }

    function showStatus(message, type = "") {
        status.textContent = message;
        status.classList.remove("is-success", "is-error");

        if (type) {
            status.classList.add(`is-${type}`);
        }
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        if (!window.emailjs) {
            showStatus(
                "No se pudo cargar EmailJS. Recargá la página e intentá nuevamente.",
                "error"
            );
            return;
        }

        const nombre = document.getElementById("nombre")?.value.trim() || "";
        const telefono = document.getElementById("telefono")?.value.trim() || "";
        const consulta = document.getElementById("consulta")?.value.trim() || "";

        if (!nombre || !telefono || !consulta) {
            showStatus("Por favor, completá todos los campos.", "error");
            return;
        }

        const templateParams = {
            nombre: nombre,
            telefono: telefono,
            consulta: consulta
        };

        const originalButtonHTML = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.textContent = "Enviando consulta...";
        showStatus("Estamos enviando tu consulta. Esperá un momento.");

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                {
                    publicKey: EMAILJS_PUBLIC_KEY
                }
            );

            showStatus(
                "¡Mensaje enviado correctamente! Gracias por contactar a Concepto3D.",
                "success"
            );

            form.reset();
        } catch (error) {
            console.error("Error al enviar el formulario:", error);

            showStatus(
                "No pudimos enviar tu consulta. Intentá nuevamente más tarde.",
                "error"
            );
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
        }
    });
});