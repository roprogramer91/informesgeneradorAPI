const express = require("express");
const multer = require("multer");
const { leerTextoDelPDF } = require("../functions/pdfExtractor");
const { construirPaciente } = require("../functions/crearPaciente");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-pdf", upload.single("pdfFile"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ningún archivo." });
        }

        // 1️⃣ Extraer el texto del PDF
        const textoPDF = await leerTextoDelPDF(req.file.buffer);

        // 2️⃣ Construir el objeto del paciente SIN mediciones manuales
        let paciente = construirPaciente(textoPDF);

        // 3️⃣ Enviar el JSON del paciente al frontend
        res.json({
            success: true,
            data: paciente,
            message: "Carga exitosa. Por favor, ingrese las mediciones diurnas y nocturnas manualmente."
        });

    } catch (error) {
        console.error("❌ Error en /upload-pdf:", error);
        res.status(500).json({ error: "Error procesando el PDF" });
    }
});


module.exports = router;
