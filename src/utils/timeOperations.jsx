export const validar_dia = (date1, date2) => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

export const obtenerHoraMilitar = (date) => {
    const horas = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");
    return `${horas}:${minutos}`;
}

export const esMismaSemana = (date1, date2) => {
    const a = getWeekNumber(date1);
    const b = getWeekNumber(date2);
    return a.week === b.week && a.year === b.year;
}

export const getWeekNumber = (date) => {
    const temp = new Date(date.getTime());
    temp.setHours(0, 0, 0, 0);
    // Mover al jueves de esa semana (ISO-8601)
    temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
    const firstThursday = new Date(temp.getFullYear(), 0, 4);
    firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));
    const weekNumber = 1 + Math.round(
        (temp - firstThursday) / (7 * 24 * 60 * 60 * 1000)
    );
    return {
        year: temp.getFullYear(),
        week: weekNumber
    };
}

export const formatearFecha = (date) => {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // ¡Meses van de 0 a 11!
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

export const obtenerHoraMilitarUnix = (unixTimestamp) => {
    debugger
    const date = new Date(unixTimestamp);
    const horas = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");
    return `${horas}:${minutos}`;
}

export const validarConfiguracionHora = async () => {
    try {
        // Obtener la hora del servidor de tiempo
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
        const tiempoServidor = new Date(data.datetime);
        // Obtener la hora local
        const tiempoLocal = new Date();
        if (tiempoServidor && tiempoLocal) {
            // Calcular la diferencia en minutos
            const diferenciaTiempo = Math.abs(tiempoLocal - tiempoServidor);
            const diferenciaMinutos = diferenciaTiempo / (1000 * 60);
            // Considera una diferencia de 5 minutos como aceptable
            return diferenciaMinutos <= 5;
        }
        return true;
    } catch (error) {
        console.error('Error al validar la hora:', error);
        return true;
    }
}

