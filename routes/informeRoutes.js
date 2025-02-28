const express = require("express");
const multer = require("multer");
const { leerTextoDelPDF } = require("../functions/pdfExtractor");
const { construirPaciente } = require("../functions/crearPaciente");
const { generarInforme } = require("../functions/crearInforme");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 📌 Endpoint para subir PDF y generar el informe automáticamente
router.post("/generar-informe", async (req, res) => {
    try {
        console.log("📥 Recibida solicitud para generar informe.");

        const { paciente } = req.body;

        if (!paciente) {
            return res.status(400).json({ error: "No se proporcionaron datos del paciente." });
        }

        // 1️⃣ Generar el informe con los datos actualizados
        const buffer = generarInforme(paciente);

        // 2️⃣ Enviar el archivo Word como respuesta
        res.set({
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": `attachment; filename="${paciente.nombre}.docx"`,

        });

        res.send(buffer);
        console.log(`✅ Informe generado y enviado correctamente como "${paciente.nombre}.docx"`);


    } catch (error) {
        console.error("❌ Error en /generar-informe:", error);
        res.status(500).json({ error: "Error al generar el informe." });
    }
});


module.exports = router;
