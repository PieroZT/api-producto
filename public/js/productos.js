const API = '/api/productos'

//Gestion del DOM
const formProducto = document.getElementById("formProducto")
const formBuscar = document.getElementById("formBuscar")
const cuerpoTabla = document.getElementById("cuerpoTabla")

//Cajas del formulario de registro
const marca = document.getElementById('marca')
const descripcion = document.getElementById('descripcion')
const precio = document.getElementById('precio')
const stock = document.getElementById('stock')

//Caja del formulario de busqueda
const buscarId = document.getElementById('buscarId')
const mostrarTodos = document.getElementById('mostrarTodos')

//Campo oculto
const campoID = document.getElementById('id')

//Renderiza los datos obtenidos API REST en el cuerpo de la tabla
function dibujarTabla(productos){
  //Si no hay productos registrados en la BD...
  if (productos.length === 0){
    cuerpoTabla.innerHTML = `<tr><td colspan='6' class='text-center'>No hay productos</td></tr>`
    return;
  }

  //REINICIAMOS EL CUERPO DE LA TABLA
  cuerpoTabla.innerHTML = ''

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
        <button type="button" onclick="editarProducto(${p.id})" class="btn-sm btn-solid theme-primary">Editar</button>
        <button type="button" onclick="eliminarProducto(${p.id})" class="btn-sm btn-outline theme-danger">Eliminar</button>
      </td>
    </tr>
    `
  });
} //fin dibujar tabla

//Editar producto
async function editarProducto(id){
  try{
    const respuesta = await fetch(`${API}/${id}`)
    const resultado = await respuesta.json()

    if (!resultado.ok){
      console.error("El ID no corresponde a ningun producto")
      return;
    }

    //En caso exista
    const producto = resultado.data

    //Campos formulario <- Atributos del objeto
    campoID.value = producto.id
    marca.value = producto.marca
    descripcion.value = producto.descripcion
    precio.value = producto.precio
    stock.value = producto.stock

  }catch(e){
    console.error(e)
  }
}

//Eliminar producto
async function eliminarProducto(id){
  const rpta = confirm('¿Estas seguro de eliminar?')
  if (!rpta) { return; }

  try{
    const respuesta = await fetch(`${API}/${id}`, {
      method: 'DELETE'
    })

    const resultado = await respuesta.json()

    if(!resultado.ok){
      console.error('No se pudo eliminar')
      return;
    }

    cargarProductos()
    alert(resultado.message)

  }catch(e){
    console.error(e)
  }
}

//¿Cómo accedemos a los datos? -> BACKEND
async function cargarProductos(){
  try{
    //http://localhost:3000 <-> https://miempresa.com
    //agregar el valor de API
    const respuesta = await fetch(API)
    const resultado = await respuesta.json()

    dibujarTabla(resultado.data)

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
    //Debemos evaluar si registramos o actualizamos un producto
    const editando = campoID.value !== ''

    //Construiremos una URL que varia en funcion de la accion
    const url = editando ? `${API}/${campoID.value}` : API

    //El metodo puede variar
    const metodo = editando ? 'PUT' : 'POST'

    //Enviamos por el metodo POST, un JSON, convertido del objeto "producto"
    const respuesta = await fetch(url, {
      method: metodo,
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

    formProducto.reset()
    campoID.value = ''
    marca.focus()

  }catch(e){
    console.error(e)
  }
}

//Busqueda a traves de PK -> BACKEND
async function buscarProducto(id){
  try{
    const respuesta = await fetch(`${API}/${id}`)
    const resultado = await respuesta.json()

    //si no encontramos registro
    if (!respuesta.ok){
      dibujarTabla([])
      return
    }

    //Data es un objeto {} por lo que lo enviamos como arreglo [{}]
    dibujarTabla([resultado.data])

  }catch(e){
    console.error(e)
  }
}

//Controlar el evento SUBMIT (envio) del formulario
formProducto.addEventListener("submit", function (e){
  e.preventDefault() //Stop

  const rpta = confirm('¿Esta seguro de registrar el producto?')
  if(!rpta) { return; }

  guardarProductos() //Esta funcion gestiona el proceso
})

//Controlar el evento de BUSCAR
formBuscar.addEventListener("submit", function (e){
  e.preventDefault()

  buscarProducto(buscarId.value)
})

//Mostrar todos
mostrarTodos.addEventListener("click", function (){
  cargarProductos()
})

cargarProductos()