document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const calendarDays = document.getElementById("calendar-days");
  const currentMonthYear = document.getElementById("current-month-year");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");
  const monthHTML = document.getElementById("current-month");
  const dayHTML = document.getElementById("current-day");

  // Fecha actual
  let currentDate = new Date();
  //Fecha de hoy
  const today = new Date();

  // Renderizar calendario
  function renderCalendar() {
    // Limpiar calendario
    calendarDays.innerHTML = "";

    // Obtener información del mes actual
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    //Obtener el mes actual
    const currentMonth = today.getMonth();

    // Actualizar el encabezado del mes/año
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    currentMonthYear.textContent = `${monthNames[month]} ${year}`;

    //Mostrar mes y día actual
    monthHTML.textContent = `${monthNames[currentMonth].slice(0, 3)}`;
    dayHTML.textContent = `${today.getDate()}`;

    // Obtener primer día del mes y último día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Obtener día de la semana del primer día (0 = Domingo, 6 = Sábado)
    const firstDayOfWeek = firstDay.getDay();

    // Obtener último día del mes anterior para los días de relleno
    const lastDayPrevMonth = new Date(year, month, 0).getDate();

    // Agregar días del mes anterior (relleno)
    for (let i = firstDayOfWeek; i > 0; i--) {
      const dayElement = createDayElement(lastDayPrevMonth - i + 1, true);
      calendarDays.appendChild(dayElement);
    }

    // Agregar días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayElement = createDayElement(i, false);

      // Resaltar el día actual
      const today = new Date();
      if (
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        dayElement.classList.add("bg-blue-500", "text-white", "font-bold");
      }

      calendarDays.appendChild(dayElement);
    }

    // Calcular días restantes para completar la cuadrícula (máximo 6 filas)
    const totalDays = firstDayOfWeek + lastDay.getDate();
    const remainingDays = totalDays <= 35 ? 35 - totalDays : 42 - totalDays;

    // Agregar días del próximo mes (relleno)
    for (let i = 1; i <= remainingDays; i++) {
      const dayElement = createDayElement(i, true);
      calendarDays.appendChild(dayElement);
    }
  }

  // Crear elemento de día
  function createDayElement(day, isOtherMonth) {
    const dayElement = document.createElement("div");
    dayElement.className =
      "p-2 text-center rounded-md h-10 flex items-center justify-center";

    if (isOtherMonth) {
      dayElement.classList.add("text-gray-400");
    } else {
      dayElement.classList.add("hover:bg-gray-200", "cursor-pointer");
    }

    dayElement.textContent = day;
    return dayElement;
  }

  // Event listeners para navegación
  prevMonthBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  // Renderizar calendario inicial
  renderCalendar();
});
