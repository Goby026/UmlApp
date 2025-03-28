/**
 * Obtiene información detallada de un mes específico
 * @param {number} monthNumber - Número del mes (1-12)
 * @param {number} [year] - Año opcional (por defecto: año actual)
 * @returns {Object} Objeto con información del mes
 */
export const getMonthInfo = (monthNumber, year = new Date().getFullYear()) => {
    // Validar el número de mes
    if (monthNumber < 1 || monthNumber > 12) {
      throw new Error('El número de mes debe estar entre 1 y 12');
    }
  
    // Nombres de los meses
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  
    // Crear fecha para el primer día del mes
    const firstDay = new Date(year, monthNumber - 1, 1);
    
    // Crear fecha para el último día del mes
    const lastDay = new Date(year, monthNumber, 0);
  
    // Calcular cantidad total de días
    const totalDays = lastDay.getDate();
  
    // Arrays para almacenar días de fin de semana
    const weekends = {
      saturdays: [],
      sundays: [],
      allWeekendDays: []
    };
  
    // Arrays para días laborables
    const workdays = [];
  
    // Recorrer todos los días del mes
    for (let day = 1; day <= totalDays; day++) {
      const currentDate = new Date(year, monthNumber - 1, day);
      const dayOfWeek = currentDate.getDay(); // 0 (Domingo) a 6 (Sábado)
  
      if (dayOfWeek === 0) { // Domingo
        weekends.sundays.push(day);
        weekends.allWeekendDays.push(day);
      } else if (dayOfWeek === 6) { // Sábado
        weekends.saturdays.push(day);
        weekends.allWeekendDays.push(day);
      } else { // Día laborable
        workdays.push(day);
      }
    }
  
    return {
      monthName: monthNames[monthNumber - 1],
      monthNumber,
      year,
      totalDays,
      weekends,
      workdays,
      firstDay: {
        date: firstDay,
        dayOfWeek: firstDay.getDay(),
        dayName: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][firstDay.getDay()]
      },
      lastDay: {
        date: lastDay,
        dayOfWeek: lastDay.getDay(),
        dayName: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][lastDay.getDay()]
      }
    };
  };