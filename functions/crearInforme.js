const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

/**
 * Función para generar un informe Word basado en los datos del paciente.
 * @param {Object} paciente - Objeto con los datos del paciente.
 * @returns {Buffer} - Archivo Word generado en buffer.
 */
function generarInforme(paciente) {
    try {
        console.log("📥 Generando informe Word...");

        // 📌 1. Cargar la plantilla Word
        const templatePath = path.join(__dirname, "../templates/PlantillaInforme.docx");
        const content = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        // 📌 2. Reemplazar variables en la plantilla
        const reemplazos = {
            NOMBRE: paciente.nombre,
            EDAD: paciente.edad,
            FECHA: paciente.fechaFormateada,
            HORAS: paciente.duracionHoras || "No disponible",
            MEDICIONES_DIURNAS: paciente.medicionesDiurnas || "No disponible",
            MEDICIONES_NOCTURNAS: paciente.medicionesNocturnas || "No disponible",
            PRESION_PROMEDIO: paciente.todasLasMediasPA || "No disponible",
            PRESION_DIURNA: paciente.mediasPADia || "No disponible",
            PRESION_NOCTURNA: paciente.mediasPANoche || "No disponible",
            PRESION_DIURNA_SISTOLICA: paciente.valorCargaPADia.SYS || "No disponible",
            PRESION_DIURNA_DIASTOLICA: paciente.valorCargaPADia.DIA || "No disponible",
            PRESION_NOCTURNA_SISTOLICA: paciente.valorCargaPANoche.SYS || "No disponible",
            PRESION_NOCTURNA_DIASTOLICA: paciente.valorCargaPANoche.DIA || "No disponible",
            PRESION_PULSO_D: paciente.presionPulsoD || "No disponible",
            PATRON_DIPPER_D: paciente.dipperD || "No disponible",
            PRESION_ARTERIAL: paciente.clasificacionPA || "No disponible",
            PATRON_DIPPER_C: paciente.dipperC || "No disponible",
            PRESION_PULSO_C: paciente.presionPulsoC || "No disponible",
        };

        console.log("🔍 Variables enviadas al Word:", JSON.stringify(reemplazos, null, 2));

        // 📌 3. Aplicar reemplazos en la plantilla
        
        doc.render(reemplazos);

        // 📌 4. Generar el archivo Word en buffer
        const buffer = doc.getZip().generate({ type: "nodebuffer" });

        // 📌 5. Definir directorio de salida y asegurarse de que existe
        const outputDir = path.join(__dirname, "../output");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // 📌 6. Guardar el archivo localmente
        const filePath = path.join(outputDir, `${paciente.nombre}.docx`);
        fs.writeFileSync(filePath, buffer);
        console.log(`✅ Informe guardado en: ${filePath}`);

        return buffer; // También se retorna para su uso en la API si es necesario
    } catch (error) {
        console.error("❌ Error al generar el informe:", error);
        throw new Error("Error al generar el informe.");
    }
}

module.exports = { generarInforme };
