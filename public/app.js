let tareas = [];
let contadorId = 1;

// Elementos DOM
const columnas = {
  'todo': document.querySelector('#todo'),
  'in-progress': document.querySelector('#inProgress'),
  'done': document.querySelector('#done')
};

const btnCrear = document.getElementById("btn-crear");
const modal = document.getElementById("modal-tarea");
const cerrarModal = document.querySelector(".close-btn");
const tareaForm = document.getElementById("tarea-form");
const eliminarBtn = document.getElementById("eliminar-tarea");

let tareaEditando = null;

// Mostrar tareas en sus columnas
function renderTareas() {
  Object.values(columnas).forEach(col => col.querySelectorAll('.tarea')?.forEach(t => t.remove()));

  tareas.forEach(t => {
    const tareaEl = document.createElement('div');
    tareaEl.className = 'tarea';
    tareaEl.innerHTML = `<h3>${t.titulo}</h3><p>${t.descripcion || ''}</p><small>${t.fechaFin}</small>`;
    tareaEl.addEventListener('click', () => abrirEditorTarea(t.id));
    columnas[t.estado].appendChild(tareaEl);
  });

  renderResumen(tareas);
}

// Determinar el estado de la tarea según fechas
function calcularEstado(fechaInicio, fechaFin) {
  const hoy = new Date().toISOString().split("T")[0];
  if (fechaInicio && hoy < fechaInicio) return "todo";
  if (fechaFin && hoy > fechaFin) return "done";
  return "in-progress";
}

// Crear nueva tarea
function crearTarea(titulo, descripcion, fechaInicio, fechaFin) {
  const estado = calcularEstado(fechaInicio, fechaFin);
  tareas.push({
    id: contadorId++,
    titulo,
    descripcion,
    fechaInicio,
    fechaFin,
    estado
  });
  renderTareas();
}

// Editar tarea
function abrirEditorTarea(id) {
  const tarea = tareas.find(t => t.id === id);
  if (!tarea) return;

  tareaEditando = tarea;
  document.getElementById("modal-title").textContent = "Editar Tarea";
  document.getElementById("tarea-id").value = tarea.id;
  document.getElementById("titulo").value = tarea.titulo;
  document.getElementById("descripcion").value = tarea.descripcion;
  document.getElementById("fechaInicio").value = tarea.fechaInicio;
  document.getElementById("fechaFin").value = tarea.fechaFin;

  eliminarBtn.classList.remove("hidden");
  modal.classList.add("visible");
}

// Guardar o actualizar tarea
tareaForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("tarea-id").value;
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;

  if (!titulo || !fechaFin) {
    alert("Por favor, completa el título y la fecha de finalización.");
    return;
  }

  if (id) {
    const tarea = tareas.find(t => t.id == id);
    tarea.titulo = titulo;
    tarea.descripcion = descripcion;
    tarea.fechaInicio = fechaInicio;
    tarea.fechaFin = fechaFin;
    tarea.estado = calcularEstado(fechaInicio, fechaFin);
  } else {
    crearTarea(titulo, descripcion, fechaInicio, fechaFin);
  }

  cerrarModalClick();
});

// Eliminar tarea
eliminarBtn.addEventListener("click", () => {
  if (!tareaEditando) return;
  tareas = tareas.filter(t => t.id !== tareaEditando.id);
  cerrarModalClick();
  renderTareas();
});

// Abrir y cerrar modal
btnCrear.addEventListener("click", () => {
  tareaEditando = null;
  document.getElementById("modal-title").textContent = "Crear Tarea";
  tareaForm.reset();
  document.getElementById("tarea-id").value = "";
  eliminarBtn.classList.add("hidden");
  modal.classList.add("visible");
});

cerrarModal.addEventListener("click", cerrarModalClick);
function cerrarModalClick() {
  modal.classList.remove("visible");
  tareaForm.reset();
}

// Render del resumen tipo GitHub
function renderResumen(tareas) {
  const resumenGrid = document.getElementById('resumen-grid');
  if (!resumenGrid) return;
  resumenGrid.innerHTML = '';

  const completadasPorDia = {};
  tareas.forEach(t => {
    if (t.estado === 'done') {
      const fecha = t.fechaFin;
      if (!completadasPorDia[fecha]) completadasPorDia[fecha] = 0;
      completadasPorDia[fecha]++;
    }
  });

  const hoy = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - (364 - i));
    const fecha = d.toISOString().split('T')[0];

    const count = completadasPorDia[fecha] || 0;
    let level = 0;
    if (count >= 4) level = 4;
    else if (count === 3) level = 3;
    else if (count === 2) level = 2;
    else if (count === 1) level = 1;

    const cell = document.createElement('div');
    cell.className = `commit-cell commit-${level}`;
    cell.title = `${count} tareas completadas el ${fecha}`;
    resumenGrid.appendChild(cell);
  }
}

// Simular algunas tareas
crearTarea("Estudiar historia", "Leer capítulo 3", "2025-05-10", "2025-05-11");
crearTarea("Proyecto web", "Avanzar login", "2025-05-12", "2025-05-15");
crearTarea("Pagar inscripción", "", "", "2025-05-13");
