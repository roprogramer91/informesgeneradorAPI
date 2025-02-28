// 📂 calculations.js - Módulo para cálculos de presión arterial

/**
 * Calculo del patrón Dipper
 * @param {number} presionDia - Presión arterial sistólica diurna.
 * @param {number} presionNoche - Presión arterial sistólica nocturna.
 * @returns {string} - Clasificación del patrón dipper.
 */
function calcularPatronDipper(presionDia, presionNoche) {
    if (!presionDia || !presionNoche) return "Datos insuficientes para calcular el patrón Dipper.";

    const porcentaje = ((presionDia - presionNoche) / presionDia) * 100;

    if (porcentaje >= 10 && porcentaje <= 20) {
        return "Ritmo circadiano con disminución adecuada de la presión arterial sistólica durante la noche. Patrón Dipper.";
    } else if (porcentaje < 10) {
        return "Ritmo circadiano sin disminución significativa de la presión arterial sistólica durante la noche. Patrón Non Dipper.";
    } else if (porcentaje > 20) {
        return "Ritmo circadiano con disminución exagerada de la presión arterial durante la noche. Patrón Super Dipper.";
    } else {
        return "Clasificación: Datos incorrectos.";
    }
}

/**
 * 📌 Cálculo de la presión de pulso y su clasificación
 * @param {number} sistolica - Presión arterial sistólica.
 * @param {number} diastolica - Presión arterial diastólica.
 * @param {number} edad - Edad del paciente.
 * @returns {string} - Clasificación de la presión de pulso.
 */
function calcularPresionPulso(sistolica, diastolica, edad) {
    if (!sistolica || !diastolica) return "Datos insuficientes para calcular la presión de pulso.";

    const presionPulso = sistolica - diastolica;

    if (presionPulso >= 30 && presionPulso <= 50) {
        return `Presión de pulso Normal (${presionPulso} mmHg).`;
    } else if (presionPulso < 30) {
        return `Presión de pulso Baja (${presionPulso} mmHg). Posible riesgo cardiovascular.`;
    } else if (presionPulso > 50) {
        if (presionPulso > 50 && edad > 60) {
            return `Presión de pulso Elevada (${presionPulso} mmHg). Alto riesgo cardiovascular.`;
        } else {
            return `Presión de pulso Elevada (${presionPulso} mmHg). Incremento del riesgo cardiovascular.`;
        }
    } else {
        return `Presión de pulso No calculada correctamente (${presionPulso} mmHg).`;
    }
}

/**
 * 📌 Cálculo de la clasificación de la presión arterial
 * @param {number} sistolica - Presión arterial sistólica.
 * @param {number} diastolica - Presión arterial diastólica.
 * @returns {string} - Clasificación de la presión arterial.
 */
function clasificarPresionArterial(sistolica, diastolica) {
    if (!sistolica || !diastolica) return "Datos insuficientes para clasificar la presión arterial.";

    if (sistolica < 130 && diastolica <= 85) {
        return "Presión arterial Normal";
    } else if (sistolica >= 130 && sistolica <= 139) {
        return "Presión arterial Limítrofe";
    } else if (sistolica >= 140 && sistolica <= 159) {
        return "Hipertensión Nivel 1";
    } else if (sistolica >= 160 && sistolica <= 179) {
        return "Hipertensión Nivel 2";
    } else if (sistolica >= 180) {
        return "Hipertensión Nivel 3";
    } else if (sistolica >= 140 && diastolica < 90) {
        return "HTA Sistólica Aislada";
    } else {
        return "Clasificación no encontrada.";
    }
}

/**
 * 📌 Cálculo del promedio de presión de pulso
 * @param {number[]} listaPresionPulso - Lista de valores de presión de pulso.
 * @returns {string} - Promedio de presión de pulso.
 */
function calcularPromedioPresionPulso(listaPresionPulso) {
    if (!listaPresionPulso.length) return "No hay datos suficientes para calcular el promedio de presión de pulso.";

    const total = listaPresionPulso.reduce((sum, presion) => sum + presion, 0);
    const promedio = total / listaPresionPulso.length;

    return promedio.toFixed(2);
}

/**
 * 📌 Ajusta la hora de la duración redondeando según los minutos.
 * @param {string} duracion - Duración en formato "HHHMM" (ej: "22H57M")
 * @returns {number} - Hora ajustada (ej: 23 si minutos > 30)
 */
function ajustarHoraDuracion(duracion) {
    if (!duracion) return null;

    // Extraer horas y minutos del formato "22H57M"
    const match = duracion.match(/(\d+)H(\d+)M/);
    if (!match) return null; // Si el formato no coincide, retornamos null

    let horas = parseInt(match[1], 10);
    let minutos = parseInt(match[2], 10);

    // Si los minutos son mayores a 30, aumentamos la hora en 1
    if (minutos > 30) {
        horas += 1;
    }

    return horas;
}


/**
 * 📌 Formatea la fecha de "YYYY/MM/DD HH:MM" a "DD/MM/YYYY"
 * @param {string} fechaOriginal - Fecha en formato "YYYY/MM/DD HH:MM"
 * @returns {string} - Fecha en formato "DD/MM/YYYY" o "Formato inválido" si hay error
 */
function formatearFecha(fechaOriginal) {
    if (!fechaOriginal) return "Formato inválido";

    // Extraer solo la parte de la fecha (YYYY/MM/DD) ignorando la hora
    const match = fechaOriginal.match(/(\d{4})\/(\d{2})\/(\d{2})/);
    if (!match) return "Formato inválido";

    // Extraer año, mes y día
    const [, year, month, day] = match;

    // Retornar en formato "DD/MM/YYYY"
    return `${day}/${month}/${year}`;
}


// Exportar funciones
module.exports = {
    calcularPatronDipper,
    calcularPresionPulso,
    clasificarPresionArterial,
    calcularPromedioPresionPulso,
    ajustarHoraDuracion,
    formatearFecha
};
