const express = require("express");
const cors = require("cors");

const informeRoutes = require("./routes/informeRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const medicionesRoutes = require("./routes/medicionesRoutes");

const app = express();
const port = 3000;

app.use(cors({
    exposedHeaders: ["Content-Disposition"], // 🔹 Permitir que el frontend acceda a este header
}));
app.use(express.json());

// Importar rutas
app.use("/api", pdfRoutes);

app.use("/api", informeRoutes);

app.use("/api",medicionesRoutes);


// Iniciar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});


app.get("/test", async (req, res) => {
    console.log("Servidor funcionando");
    res.send("✅ El servidor está corriendo correctamente.");
});
