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

        const paciente = req.body.paciente;
        if (!paciente) {
            return res.status(400).json({ error: "Datos de paciente no proporcionados." });
        }

        // 📌 Generar el informe y obtener el Buffer
        const buffer = generarInforme(paciente);

        // 📌 Configurar la respuesta HTTP con el archivo en memoria
        const fileName = `${paciente.nombre}.docx`;
        const safeFileName = encodeURIComponent(fileName);

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", `attachment; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`);

        res.send(buffer);

        console.log(`✅ Informe generado y enviado correctamente para: ${paciente.nombre}`);

    } catch (error) {
        console.error("❌ Error en /generar-informe:", error);
        res.status(500).json({ error: "Error al generar el informe." });
    }
});

module.exports = router;
