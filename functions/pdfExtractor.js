const pdfParse = require("pdf-parse");

/**
 * Función para leer el texto de un archivo PDF sin procesarlo.
 * @param {Buffer} pdfBuffer - Archivo PDF en formato buffer.
 * @returns {string} Texto completo extraído del PDF.
 */
async function leerTextoDelPDF(pdfBuffer) {
    try {
        // Extraer el texto completo del PDF
        const data = await pdfParse(pdfBuffer);
        return data.text; // Devolvemos el texto crudo, sin procesar
    } catch (error) {
        console.error("❌ Error al leer el PDF:", error);
        throw new Error("Error al leer el PDF.");
    }
}

module.exports = { leerTextoDelPDF };
