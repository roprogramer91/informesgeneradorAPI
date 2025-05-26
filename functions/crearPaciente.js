const calculations = require('../functions/calculations'); // Importar funciones de cálculo

/**
 * Función para procesar el texto del PDF y construir el objeto del paciente.
 * @param {string} textoPDF - Texto extraído del PDF.
 * @returns {Object} Objeto con los datos del paciente.
 */
function construirPaciente(textoPDF) {
    const lines = textoPDF.split("\n").map(line => line.trim()).filter(line => line !== "");
    let paciente = {};

    // Unir todo el texto en una sola cadena para facilitar el uso de expresiones regulares
    const unifiedText = lines.join(" ");

    // Extraer nombre completo del paciente
    const nombreMatch = unifiedText.match(/Informe de Monitoreo Ambulatorio de Presión Arterial\s*([\p{L}\s]+)/u);
    if (nombreMatch) {
        paciente.nombre = nombreMatch[1].replace(/ID paciente.*/, '').trim();
    }
    //DEBUG --------------------------------
    console.log("🔤 Nombre original extraído del PDF:", nombreMatch ? nombreMatch[1] : "No encontrado");
    console.log("🧾 Nombre procesado y limpiado:", paciente.nombre);
    //--------------------------------------

    // Extraer la fecha correcta después de "Nº Cama.:"
    const inicioPruebaMatch = unifiedText.match(/Nº Cama\.:?\s*([\d\/]+ \d{2}:\d{2})/);
    paciente.inicioPrueba = inicioPruebaMatch ? inicioPruebaMatch[1].trim() : "No encontrado";
    // 📌 Aplicar formato correcto a la fecha
    paciente.fechaFormateada = calculations.formatearFecha(paciente.inicioPrueba);


    // Extraer "Fin prueba", que está en "Inicio prueba:"
    const finPruebaMatch = unifiedText.match(/Inicio prueba:\s*([\d\/]+ \d{2}:\d{2})/);
    paciente.finPrueba = finPruebaMatch ? finPruebaMatch[1].trim() : "No encontrado";

    //DEBUG --------------------------------
    console.log("Texto unificado del PDF:\n", unifiedText);
    //--------------------------------------

    lines.forEach((line, index) => {
        if (line.startsWith("Edad:")) {
            paciente.edad = parseInt(lines[index + 1]?.trim(), 10);
        } else if (line.startsWith("Duración:")) {
            paciente.duracion = lines[index + 1]?.trim();
            // Llamar a la función para calcular solo la hora ajustada
            paciente.duracionHoras = calculations.ajustarHoraDuracion(paciente.duracion);
        } else if (line.includes("Todas las medias PA:")) {
            paciente.todasLasMediasPA = lines[index + 1]?.trim();
        } else if (line.includes("Medias PA dia:")) {
            paciente.mediasPADia = lines[index + 1]?.trim();
        } else if (line.includes("Medias PA noche:")) {
            paciente.mediasPANoche = lines[index + 1]?.trim();
        }
    });
    

    // Extraer cargas diurnas
    const sysDiurnaMatch = unifiedText.match(/SYS\(>135mmHg\)\s*(\d+\.\d+)%/);
    const diaDiurnaMatch = unifiedText.match(/DIA\(>85mmHg\)\s*(\d+\.\d+)%/);
    paciente.valorCargaPADia = {
        SYS: sysDiurnaMatch ? sysDiurnaMatch[1] + '%' : "No encontrado",
        DIA: diaDiurnaMatch ? diaDiurnaMatch[1] + '%' : "No encontrado"
    };

    // Extraer cargas nocturnas
    const sysNocturnaMatch = unifiedText.match(/SYS\(>120mmHg\)\s*(\d+\.\d+)%/);
    const diaNocturnaMatch = unifiedText.match(/DIA\(>70mmHg\)\s*(\d+\.\d+)%/);
    paciente.valorCargaPANoche = {
        SYS: sysNocturnaMatch ? sysNocturnaMatch[1] + '%' : "No encontrado",
        DIA: diaNocturnaMatch ? diaNocturnaMatch[1] + '%' : "No encontrado"
    };

    // ✅ **Aplicar cálculos usando el módulo calculations.js**
    const presionDia = paciente.mediasPADia ? parseInt(paciente.mediasPADia.split("/")[0]) : null;
    const presionNoche = paciente.mediasPANoche ? parseInt(paciente.mediasPANoche.split("/")[0]) : null;
    const sistolica = paciente.todasLasMediasPA ? parseInt(paciente.todasLasMediasPA.split("/")[0]) : null;
    const diastolica = paciente.todasLasMediasPA ? parseInt(paciente.todasLasMediasPA.split("/")[1]) : null;

    // 🟢 Cálculo del patrón Dipper
    const dipperTextoCompleto = calculations.calcularPatronDipper(presionDia, presionNoche);
    paciente.dipperD = dipperTextoCompleto; // Explicación completa para la descripción
    paciente.dipperC = dipperTextoCompleto.split(". ").pop(); // Solo la clasificación para la conclusión

    // 🟢 Cálculo de la presión de pulso
    const presionPulsoTextoCompleto = calculations.calcularPresionPulso(sistolica, diastolica, paciente.edad);
    const presionPulsoMatch = presionPulsoTextoCompleto.match(/\((\d+) mmHg\)/);
    paciente.presionPulsoD = presionPulsoMatch ? `Promedio de la presión de pulso ${presionPulsoMatch[1]} mmHg.` : "No encontrado"; // Formato correcto
    paciente.presionPulsoC = presionPulsoTextoCompleto; // Clasificación completa

    // 🟢 Clasificación de presión arterial
    paciente.clasificacionPA = calculations.clasificarPresionArterial(sistolica, diastolica);

     // 🔹 Inicializar mediciones diurnas y nocturnas en null para que existan en el JSON
     paciente.medicionesDiurnas = null;
     paciente.medicionesNocturnas = null;

    return paciente;
}

module.exports = { construirPaciente };
