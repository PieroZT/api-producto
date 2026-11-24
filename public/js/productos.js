const API = '/api/productos'

//Gestion del DOM
const formProducto = document.getElementById("formProductos")
const formBuscar = document.getElementById("formBuscar")
const cuerpoTabla = document.getElementById("cuerpoTabla")

//Cajas del formulario de registro
const marca = document.getElementById('marca')
const descripcion = document.getElementById('descripcion')
const precio = document.getElementById('precio')
const stock = document.getElementById('stock')

//Renderiza los datos obtenidos API REST en el cuerpo de la tabla
function dibujarTabla(productos){
  //Si no hay productos registrados en la BD...
  if (productos.length === 0){
    cuerpoTabla.innerHTML = `<tr><td colspan='6' class='text-center'>No hay productos</td></tr>`
    return;
  }

  //Si encontramos productos (al menos 1)
  productos.forEach(p => {
    cuerpoTabla.innerHTML += `
    <tr>
      <td>${p.id}</td>
      <td>${p.marca}</td>
      <td>${p.descripcion}</td>
      <td>${p.precio}</td>
      <td>${p.stock}</td>
      <td>
        <button type="button" class="btn-sm btn-solid theme-primary">Editar</button>
        <button type="button" class="btn-sm btn-outline theme-danger">Eliminar</button>
      </td>
    </tr>
    `
  });
} //fin dibujar tabla

function editarProducto(){
  alter('Editando')
}

function eliminarProducto(){
  alter('Eliminando')
}



//¿Cómo accedemos a los datos? -> BACKEND
async function cargarProductos(){
  try{
    //http://localhost:3000 <-> https://miempresa.com
    //agregar el valor de API
    const respuesta = await fetch(API)
    const resultado = await respuesta.json()
    console.log(resultado)
  }catch(e){
      console.error(e)
  }
}

//Funcion para registrar un nuevo producto
async function guardarProductos() {
  //Crear objeto JS -> enviar datos
  const producto = {
    marca: marca.value,
    descripcion: descripcion.value,
    precio: parseFloat(precio.value),
    stock: parseInt(stock.value)
  }

  try{
    //Enviamos por el metodo POST, un JSON, convertido del objeto "producto"
    const respuesta = await fetch(API, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify(producto)
    })

    const resultado = await respuesta.json()

    if (!resultado.ok){
      console.error('No se pudo registrar el producto')
      return;
    }

    //Actualizamos la lista
    cargarProductos()

  }catch(e){
    console.error(e)
  }
}

//Controlar el evento SUBMIT (envio) del formulario
formProducto.addEventListener("submit", function (e){
  e.preventDefault() //Stop
  guardarProductos() //Esta funcion gestiona el proceso
})


cargarProductos()