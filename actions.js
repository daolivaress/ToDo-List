const data = [
  {
    listID: 1,
    listName: "Lista 1",
    tasks: [
      {
        taskID: 1,
        name: "Tarea 1",
        date: "2025-08-12",
        completed: false,
      },
    ],
  },
];

let selectedTaskList = null;

// Agregar event listeners para los filtros
document.addEventListener("DOMContentLoaded", function () {
  mostrarListasDeTareas();

  const container = document.getElementById("task-date-container");
  const options = container.querySelectorAll("button, input[type='date']");

  options.forEach((option) => {
    option.addEventListener(
      option.tagName === "INPUT" ? "change" : "click",
      (e) => {
        e.preventDefault();

        // Resetear todos a inactivo
        options.forEach((opt) => {
          opt.classList.remove("active");
        });

        // Activar el seleccionado
        option.classList.add("active");
      }
    );
  });

  // Event listeners para los filtros de estado
  const statusFilters = document.querySelectorAll("#status-filter p");
  statusFilters.forEach((filter) => {
    filter.addEventListener("click", function (e) {
      e.stopPropagation();

      // Si el filtro ya está activo, desactivarlo
      if (this.classList.contains("active")) {
        this.classList.remove("active");
      } else {
        // Remover active de todos los filtros de estado
        statusFilters.forEach((f) => f.classList.remove("active"));
        // Agregar active al filtro seleccionado
        this.classList.add("active");
      }

      // Refrescar la vista si hay una lista seleccionada
      if (selectedTaskList) {
        mostrarTareas(selectedTaskList.listID);
      }
    });
  });

  // Event listeners para los filtros de ordenamiento
  const sortFilters = document.querySelectorAll("#sort-filter p");
  sortFilters.forEach((filter) => {
    filter.addEventListener("click", function (e) {
      e.stopPropagation();

      // Si el filtro ya está activo, desactivarlo
      if (this.classList.contains("active")) {
        this.classList.remove("active");
      } else {
        // Remover active de todos los filtros de ordenamiento
        sortFilters.forEach((f) => f.classList.remove("active"));
        // Agregar active al filtro seleccionado
        this.classList.add("active");
      }

      // Refrescar la vista si hay una lista seleccionada
      if (selectedTaskList) {
        mostrarTareas(selectedTaskList.listID);
      }
    });
  });
});

//Funcion para crear una nueva lista de tareas
function agregarListaDeTareas() {
  const taskListName = "Mi nueva lista";
  if (taskListName) {
    const newList = {
      listID: data.length + 1,
      listName: taskListName,
      tasks: [],
    };
    data.push(newList);
    mostrarListasDeTareas();
  }
}

//Funcion para agregar una tarea a una lista en especifico
function agregarTarea() {
  const taskName = document.getElementById("task-name-input").value;
  let taskDate;
  let inputSelected;

  if (document.getElementById("task-date-input").classList.contains("active")) {
    taskDate = document.getElementById("task-date-input").value;
    inputSelected = document.getElementById("task-date-input");
  } else if (
    document.getElementById("task-date-today").classList.contains("active")
  ) {
    taskDate = "Today";
    inputSelected = document.getElementById("task-date-today");
  } else if (
    document.getElementById("task-date-tomorrow").classList.contains("active")
  ) {
    taskDate = "Tomorrow";
    inputSelected = document.getElementById("task-date-tomorrow");
  }

  if (taskDate == "Today") {
    taskDate = new Date().toISOString().split("T")[0];
  } else if (taskDate == "Tomorrow") {
    taskDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  }
  const list = data.find((list) => list.listID === selectedTaskList.listID);
  if (list && taskName) {
    const newTask = {
      taskID: list.tasks.length + 1,
      name: taskName,
      date: taskDate,
      completed: false,
    };
    list.tasks.push(newTask);

    document
      .getElementById("task-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        document.getElementById("task-name-input").value = "";
        inputSelected.classList.remove("active");
        mostrarTareas(selectedTaskList.listID);
        cerrarFormularioTarea();
      });
  }
}

//Funcion para eliminar una lista de tareas
function eliminarListaDeTareas(listID) {
  const listIndex = data.findIndex((list) => list.listID === listID);
  if (listIndex !== -1) {
    data.splice(listIndex, 1);
  }
  mostrarListasDeTareas();
}

//Funcion para eliminar una tarea de una lista en especifico
function eliminarTarea(listID, taskID) {
  const list = data.find((list) => list.listID === listID);
  if (list) {
    list.tasks = list.tasks.filter((task) => task.taskID !== taskID);
    mostrarTareas(listID);
  }
}

//Funcion para actualizar el nombre de una lista de tareas
function actualizarNombreLista(listID, newName) {
  const list = data.find((list) => list.listID === listID);
  if (list) {
    list.listName = newName;
    mostrarListasDeTareas();
  }
}

//Funcion para mostrar las listas de tareas
function mostrarListasDeTareas() {
  const taskListContainer = document.getElementById("task-list-container");
  taskListContainer.innerHTML = "";
  if (data.length === 0) {
    taskListContainer.innerHTML =
      "<p class='text-gray-500 text-sm'>No hay listas de tareas disponibles.</p>";
  } else {
    data.forEach((list) => {
      const listElement = document.createElement("div");
      listElement.setAttribute("onclick", `mostrarTareas(${list.listID})`);
      listElement.className =
        "rounded-md px-3 py-2 flex items-center bg-gray-200 relative cursor-pointer";
      listElement.id = `list-${list.listID}`;
      listElement.innerHTML = `
        <input type="text" value="${list.listName}" class="border-none outline-none bg-none cursor-pointer pointer-events-auto focus:cursor-text" id="list-name-${list.listID}" onchange="actualizarNombreLista(${list.listID}, this.value)"/>
        <svg xmlns="http://www.w3.org/2000/svg" width="16px" viewBox="0 0 24 24" fill="none" class="hidden absolute right-2" id="delete-list-svg-${list.listID}">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#000000" />
        </svg>
      `;
      // Agregar el event listener al SVG para evitar la propagación
      listElement
        .querySelector(`#delete-list-svg-${list.listID}`)
        .addEventListener("click", function (e) {
          e.stopPropagation();
          eliminarListaDeTareas(list.listID);
        });
      taskListContainer.appendChild(listElement);
    });
  }
}

//Funcion para actualizar estado de una tarea en una lista en especifico
function toggleTaskCompletion(listID, taskID) {
  const list = data.find((list) => list.listID === listID);
  const task = list.tasks.find((task) => task.taskID === taskID);
  if (task) {
    task.completed = !task.completed;
    list.tasks.sort((a, b) => {
      if (a.completed === b.completed) {
        return 0;
      }
      return a.completed ? 1 : -1;
    });
    mostrarTareas(listID);
  }
}

//Funcion para mostrar las tareas de una lista en especifico
function mostrarTareas(listID) {
  const currentTaskList = data.find((list) => list.listID === listID);
  selectedTaskList = currentTaskList;

  // Quitar la clase "active" de todas las listas
  document.querySelectorAll('[id^="list-"]').forEach((el) => {
    el.classList.remove("active");
    const svg = el.querySelector("svg");
    if (svg && !svg.classList.contains("hidden")) {
      svg.classList.add("hidden");
    }
  });

  // Agregar la clase "active" solo a la lista seleccionada
  const taskListName = document.getElementById(`list-${listID}`);
  taskListName.classList.add("active");
  taskListName.querySelector("svg").classList.remove("hidden");

  // Obtener los filtros activos
  const statusFilter = document.querySelector("#status-filter p.active");
  const sortFilter = document.querySelector("#sort-filter p.active");

  // Filtrar y ordenar las tareas
  let tasksToShow = [...currentTaskList.tasks];

  // Aplicar filtro de estado si hay uno activo
  if (statusFilter) {
    const status = statusFilter.id.split("-")[1];
    if (status === "completed") {
      tasksToShow = tasksToShow.filter((task) => task.completed);
    } else if (status === "pending") {
      tasksToShow = tasksToShow.filter((task) => !task.completed);
    }
    // "all" no necesita filtro
  }

  // Aplicar ordenamiento si hay uno activo
  if (sortFilter) {
    const sortBy = sortFilter.id.split("-")[1];
    if (sortBy === "name") {
      tasksToShow.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      tasksToShow.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  }

  const taskContainer = document.getElementById("task-container");
  if (tasksToShow.length > 0) {
    taskContainer.innerHTML = "";
    tasksToShow.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.setAttribute("id", `task-${task.taskID}`);
      taskElement.className =
        "flex items-center gap-3 bg-gray-100 rounded-md p-5 relative cursor-pointer";
      taskElement.innerHTML = `
        <input type="checkbox" name="" id="" ${
          task.completed ? "checked" : ""
        } onchange="toggleTaskCompletion(${listID}, ${task.taskID})"/>
            <div id="task-info">
              <p id="task-name" class="-mb-1 ${
                task.completed ? "line-through" : ""
              }">${task.name}</p>
              <p id="task-date" class="text-xs text-gray-500">${task.date}</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16px"
              viewBox="0 0 24 24"
              fill="none"
              class="absolute right-2 top-2"
              onclick="eliminarTarea(${listID}, ${task.taskID})"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
                fill="#000000"
              />
            </svg>
      `;
      taskContainer.appendChild(taskElement);
    });
  } else {
    taskContainer.innerHTML = "";
    taskContainer.innerHTML =
      "<p class='text-gray-500 text-sm'>No hay tareas disponibles.</p>";
  }
}

function mostrarFormularioTarea() {
  // Mostrar overlay
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("hidden");

  // Mostrar formulario
  const form = document.getElementById("task-form");
  form.classList.remove("hidden");

  // Aplicar blur al fondo
  document.querySelector("main").classList.add("blur-background");

  // Forzar reflow para que la animación funcione
  void overlay.offsetWidth;
  void form.offsetWidth;

  document.getElementById("add-task-btn").classList.add("active");
  document.getElementById("showListMobile").classList.remove("max-md:block");

  // Activar transiciones
  setTimeout(() => {
    overlay.classList.add("visible");
    form.classList.add("visible");
  }, 10);
}

function cerrarFormularioTarea() {
  const form = document.getElementById("task-form");
  const overlay = document.getElementById("overlay");

  // Desactivar transiciones
  form.classList.remove("visible");
  overlay.classList.remove("visible");

  // Quitar blur
  document.querySelector("main").classList.remove("blur-background");

  document.getElementById("add-task-btn").classList.remove("active");
  document.getElementById("showListMobile").classList.add("max-md:block");

  // Esperar a que termine la animación antes de ocultar
  setTimeout(() => {
    form.classList.add("hidden");
    overlay.classList.add("hidden");
  }, 300);
}

function mostrarListaTareas() {
  const taskList = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const isHidden = taskList.classList.contains("hidden");
  const taskListBtn = document.getElementById("showListMobile");
  const hideListIcon = document.getElementById("hide-list-icon");
  const showListIcon = document.getElementById("show-list-icon");

  if (isHidden) {
    taskList.classList.remove("hidden");
    overlay.classList.remove("hidden");
    showListIcon.classList.add("hidden");
    hideListIcon.classList.remove("hidden");
    taskListBtn.classList.add("left-60");
    setTimeout(() => {
      overlay.classList.add("visible");
      taskList.classList.add("visible");
    }, 10);
  } else {
    taskList.classList.add("hidden");
    overlay.classList.remove("visible");
    showListIcon.classList.remove("hidden");
    hideListIcon.classList.add("hidden");
    taskListBtn.classList.remove("left-60");
    setTimeout(() => {
      overlay.classList.add("hidden");
      taskList.classList.remove("visible");
    }, 300);
  }
}
