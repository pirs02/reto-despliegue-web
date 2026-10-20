
const formulario = document.getElementById('formulario-tarea');
const lista = document.getElementById('lista-tareas');
const estado = document.getElementById('estado');

async function solicitar(url, opciones = {}) {
    const respuesta = await fetch(url, opciones);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || 'Ocurrió un error.');
    }

    return datos;
}

async function cargarTareas() {
    try {
        const tareas = await solicitar('/api/tareas');
        lista.replaceChildren();

        estado.textContent = tareas.length === 0
            ? 'Todavía no hay tareas registradas.'
            : `${tareas.length} tarea(s) registrada(s).`;

        tareas.forEach(tarea => {
            const elemento = document.createElement('li');
            elemento.className = 'tarea';

            const informacion = document.createElement('div');

            const titulo = document.createElement('strong');
            titulo.textContent = tarea.titulo;

            if (tarea.completada) {
                titulo.classList.add('completada');
            }

            const descripcion = document.createElement('p');
            descripcion.textContent = tarea.descripcion || '';

            informacion.append(titulo, descripcion);

            const acciones = document.createElement('div');
            acciones.className = 'acciones';

            const botonEstado = document.createElement('button');
            botonEstado.textContent = tarea.completada
                ? 'Marcar pendiente'
                : 'Completar';

            botonEstado.addEventListener('click', async () => {
                try {
                    await solicitar(`/api/tareas/${tarea.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            completada: !tarea.completada
                        })
                    });
                    await cargarTareas();
                } catch (error) {
                    estado.textContent = error.message;
                }
            });

            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.className = 'eliminar';

            botonEliminar.addEventListener('click', async () => {
                if (!confirm('¿Deseas eliminar esta tarea?')) return;

                try {
                    await solicitar(`/api/tareas/${tarea.id}`, {
                        method: 'DELETE'
                    });
                    await cargarTareas();
                } catch (error) {
                    estado.textContent = error.message;
                }
            });

            acciones.append(botonEstado, botonEliminar);
            elemento.append(informacion, acciones);
            lista.appendChild(elemento);
        });
    } catch (error) {
        estado.textContent = 'Error al cargar tareas: ' + error.message;
    }
}

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value;

    if (!titulo) return;

    try {
        await solicitar('/api/tareas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descripcion })
        });

        formulario.reset();
        await cargarTareas();
    } catch (error) {
        estado.textContent = 'Error al guardar: ' + error.message;
    }
});

cargarTareas();
