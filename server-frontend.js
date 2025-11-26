const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// 📂 Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(__dirname));

// 🏠 Ruta principal - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
    console.log(`🌐 Frontend servidor corriendo en puerto ${PORT}`);
});
