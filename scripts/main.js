let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

const btnSiguiente0 = document.getElementById("btnSiguiente0");
const btnSiguiente1 = document.getElementById("btnSiguiente1");
const btnSiguiente2 = document.getElementById("btnSiguiente2");
const btnAtras1 = document.getElementById("btnAtras1");
const btnAtras2 = document.getElementById("btnAtras2");
const btnAtras3 = document.getElementById("btnAtras3");
const btnInicio = document.getElementById("btnInicio");
const btnGenerar = document.getElementById("btnGenerar");

// 🌓 Función para cambiar entre modo claro y oscuro
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const themeIcon = document.getElementById('theme-icon');

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Cambiar icono
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// 🎨 Cargar tema guardado al iniciar
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeIcon = document.getElementById('theme-icon');

    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
});

// 🏥 Variable global para almacenar la institución seleccionada
let institucionSeleccionada = null;

// 📋 Variable global para almacenar los datos del paciente
let pacienteData = null;

// 🏥 Función para seleccionar institución
function seleccionarInstitucion(institucionId) {
    // Remover la clase 'selected' de todas las tarjetas
    const cards = document.querySelectorAll(".institution-card");
    cards.forEach(card => card.classList.remove("selected"));

    // Agregar la clase 'selected' a la tarjeta clickeada
    const selectedCard = document.querySelector(`[data-institucion="${institucionId}"]`);
    if (selectedCard) {
        selectedCard.classList.add("selected");
    }

    // Guardar la institución seleccionada
    institucionSeleccionada = institucionId;
    console.log(`🏥 Institución seleccionada: ${institucionId}`);

    // Habilitar el botón "Siguiente"
    btnSiguiente0.disabled = false;
}

// 🚀 Función para cambiar de slide hacia adelante
function nextSlide() {
    if (currentSlide < slides.length - 1) {
        slides[currentSlide].classList.remove("active");
        currentSlide++;
        slides[currentSlide].classList.add("active");
    }
}

// ⬅️ Función para cambiar de slide hacia atrás
function prevSlide() {
    if (currentSlide > 0) {
        slides[currentSlide].classList.remove("active");
        currentSlide--;
        slides[currentSlide].classList.add("active");
    }
}

// 📂 Subir PDF y habilitar "Siguiente"
async function subirPDF() {
    const fileInput = document.getElementById("pdfInput").files[0];
    if (!fileInput) {
        alert("Por favor, selecciona un archivo PDF.");
        return;
    }

    const formData = new FormData();
    formData.append("pdfFile", fileInput);

    try {
        const response = await fetch("http://localhost:3000/api/upload-pdf", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        console.log("Respuesta del servidor (PDF):", data);

        if (data.success) {
            pacienteData = data.data; // Guardamos la información del paciente
            alert("📄 PDF cargado correctamente.");
            btnSiguiente1.disabled = false; // ✅ Habilitar botón "Siguiente"
        } else {
            alert("❌ Error al cargar PDF.");
        }
    } catch (error) {
        console.error("❌ Error en la solicitud:", error);
        alert("⚠️ Error en la solicitud.");
    }
}

// 🔹 Event Listeners para cambiar de slide
btnSiguiente0?.addEventListener("click", nextSlide);
btnSiguiente1?.addEventListener("click", nextSlide);
btnSiguiente2?.addEventListener("click", nextSlide);

// ⬅️ Event Listeners para retroceder de slide
btnAtras1?.addEventListener("click", prevSlide);
btnAtras2?.addEventListener("click", prevSlide);
btnAtras3?.addEventListener("click", prevSlide);

// 📊 Validar y actualizar datos en el backend
async function actualizarMediciones() {
    if (!pacienteData) {
        alert("⚠️ Primero sube un PDF.");
        return;
    }

    const medicionesDiurnas = parseInt(document.getElementById("medicionesDiurnas").value, 10);
    const medicionesNocturnas = parseInt(document.getElementById("medicionesNocturnas").value, 10);

    if (isNaN(medicionesDiurnas) || isNaN(medicionesNocturnas)) {
        alert("⚠️ Por favor, ingresa valores válidos.");
        return;
    }

    pacienteData.medicionesDiurnas = medicionesDiurnas;
    pacienteData.medicionesNocturnas = medicionesNocturnas;

    try {
        const response = await fetch("http://localhost:3000/api/actualizar-mediciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paciente: pacienteData })
        });

        const data = await response.json();
        console.log("Respuesta del servidor (Mediciones):", data);

        if (data.success) {
            pacienteData = data.data; // Guardamos los datos actualizados
            alert("✅ Mediciones actualizadas correctamente.");
            btnSiguiente2.disabled = false; // ✅ Habilitar botón "Siguiente"
        } else {
            alert("❌ Error al actualizar mediciones.");
        }
    } catch (error) {
        console.error("❌ Error en la solicitud:", error);
        alert("⚠️ Error en la solicitud.");
    }
}

// 📑 Generar informe y descargarlo
async function generarInforme(event) {
    event.preventDefault();

    // Validar que se haya seleccionado una institución
    if (!institucionSeleccionada) {
        alert("⚠️ Primero selecciona una institución.");
        return;
    }

    if (!pacienteData) {
        alert("⚠️ Primero sube un PDF y actualiza las mediciones.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/generar-informe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                paciente: pacienteData,
                institucion: institucionSeleccionada // 🏥 Enviar institución seleccionada
            })
        });

        if (!response.ok) {
            alert("❌ Error al generar el informe.");
            return;
        }

        const contentDisposition = response.headers.get("Content-Disposition");
        console.log("Encabezado Content-Disposition:", contentDisposition);

        let nombreArchivo = "Informe_Paciente.docx"; // Nombre por defecto

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+?)"/);
            if (match && match[1]) {
                nombreArchivo = decodeURIComponent(match[1]).trim();
            }
        }

        console.log(`📂 Nombre del archivo a descargar: ${nombreArchivo}`);

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.setAttribute("download", nombreArchivo);
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        console.log(`✅ Archivo descargado como: ${nombreArchivo}`);
        btnInicio.disabled = false; // ✅ Habilitar botón "Inicio"

    } catch (error) {
        console.error("❌ Error en la solicitud:", error);
        alert("⚠️ Error en la solicitud.");
    }
}

// 🔄 Reiniciar flujo
btnInicio?.addEventListener("click", () => {
    location.reload();
});
