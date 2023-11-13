// Variables y Selectores

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos

eventListeners();

function eventListeners() {
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

  formulario.addEventListener('submit', agregarGasto);
}


// Clases

class Presupuesto {
  constructor(presupuesto) {
    this.Presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }



  nuevoGasto(gasto) {

    //Spread operator para copiar el array y agregar el nuevo gasto
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {

    const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0); // itera los gastos y va sumando el total
    this.restante = this.Presupuesto - gastado; // Resta el presupuesto con el total gastado
  }
  eliminarGasto(id){
    
    this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    this.calcularRestante();
  }
}

class UI {

  insertarPresupuesto(cantidad) {
    // Extrayendo los valores del objeto cantidad con destructuring
    const { Presupuesto, restante } = cantidad;

    // Agregar al HTML
    document.querySelector('#total').textContent = Presupuesto;
    document.querySelector('#restante').textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {

    // crear el div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert');

    // Si es de tipo error
    if (tipo === "error") {
      divMensaje.classList.add('alert-danger');
    } else {
      divMensaje.classList.add('alert-success');
    }

    // Mensaje de error
    divMensaje.textContent = mensaje;

    // Insertar en el HTML
    document.querySelector('.primario').insertBefore(divMensaje, formulario);
    
    
    // Quitar el HTML
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  mostrarGastos(gastos) {

    // Limpiar el HTML
    this.limpiarHTML();

    // Iterar sobre los gastos
    gastos.forEach(gasto => {
      const { cantidad, nombre, id } = gasto;

      // Crear un LI
      const nuevoGasto = document.createElement('li')
      nuevoGasto.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      nuevoGasto.dataset.id = id; // Agregar un ID

      // Crear un span para el gasto
      const spanNombre = document.createElement('span');
      spanNombre.classList.add('badge', 'badge-primary', 'badge-pill');
      spanNombre.textContent = `${nombre}`;

      // Crear un span para la cantidad del gasto
      const spanCantidad = document.createElement('span');
      spanCantidad.classList.add('badge', 'badge-primary', 'badge-pill');
      spanCantidad.textContent = `$${cantidad}`;

      // Boton para borrar el gasto
      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.textContent = ` Borrar X`;

      btnBorrar.onclick = () => {
        eliminarGastos(id);
      }

      // Agregar los span al LI
      nuevoGasto.appendChild(spanNombre);
      nuevoGasto.appendChild(spanCantidad);
      nuevoGasto.appendChild(btnBorrar);






      // Agregar el gasto al HTML
      gastoListado.appendChild(nuevoGasto);

    })
  }
  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }

  }
  actualizarRestante(restante) {
    document.querySelector('#restante').textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { Presupuesto, restante } = presupuestoObj;

    const restanteDiv = document.querySelector('.restante');
    // Comprobar 25%
    if ((Presupuesto / 4) > restante) {
      restanteDiv.classList.remove('alert-success', 'alert-warning');
      restanteDiv.classList.add('alert-danger');
    } else if ((Presupuesto / 2) > restante) {
      restanteDiv.classList.remove('alert-success');
      restanteDiv.classList.add('alert-warning');
    } else{
      restanteDiv.classList.remove('alert-danger', 'alert-warning');
      restanteDiv.classList.add('alert-success');
    }

    // Si el total es 0 o menor
    if (restante <= 0) {
      ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

//Globales
const ui = new UI();
let presupuesto;



// Funciones

// Preguntar presupuesto

function preguntarPresupuesto() {
  const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');

  if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
    window.location.reload();
  }

  // Instancias clase presupuesto y le pasamos el presupuesto del usuario
  presupuesto = new Presupuesto(presupuestoUsuario);


  ui.insertarPresupuesto(presupuesto)
}

// Añade gastos

function agregarGasto(e) {
  e.preventDefault();

  // Leer los datos del formulario (obtener los datos del usuario)
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

  // Generar un objeto con el gasto objeto literal (guardar los datos del usuario en un objeto literal)
  const gasto = {
    nombre,
    cantidad,
    id: Date.now()
  };



  // Validar
  if (nombre === '' || cantidad === '') {
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta('Cantidad no válida', 'error');
    return;
  }

  // Agregar un nuevo gasto (agregar el objeto literal al array de gastos)

  presupuesto.nuevoGasto(gasto);

  // Mensaje de todo bien
  ui.imprimirAlerta('Gasto agregado correctamente');

  // Imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos)

  // Actualizar el restante
  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);

  // Resetear el formulario
  formulario.reset();

}


function eliminarGastos(id){
  // Elimina del objeto
  presupuesto.eliminarGasto(id);

  // Elimina los gastos del HTML
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos); 

  // Actualizar el restante
  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);
}


