const express = require("express");
const router = express.Router();

/**
 * 📌 Recibir y actualizar mediciones diurnas y nocturnas en el paciente.
 */
router.post("/actualizar-mediciones", (req, res) => {
    try {
        const { paciente, medicionesDiurnas, medicionesNocturnas } = req.body;

        if (!paciente) {
            return res.status(400).json({ error: "No se proporcionaron datos del paciente." });
        }

        // 1️⃣ Agregar las mediciones al objeto paciente
        paciente.medicionesDiurnas = paciente.medicionesDiurnas;
        paciente.medicionesNocturnas = paciente.medicionesNocturnas;

        // 2️⃣ Responder con el objeto actualizado
        res.json({ success: true, data: paciente });

    } catch (error) {
        console.error("❌ Error en /actualizar-mediciones:", error);
        res.status(500).json({ error: "Error al actualizar mediciones." });
    }
});

module.exports = router;
