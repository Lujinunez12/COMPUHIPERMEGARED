
const contenedorProductos = document.getElementById('contenedor-productos')

const contenedorCarrito = document.getElementById('carrito-contenedor')

const botonVaciar = document.getElementById('vaciar-carrito')

const contadorCarrito = document.getElementById('contadorCarrito')

const botonComprar = document.getElementById('compra-carrito')


const cantidad = document.getElementById('cantidad')
const precioTotal = document.getElementById('precioTotal')
const cantidadTotal = document.getElementById('cantidadTotal')

let carrito = [0]

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})
//boton para borrar la compra
botonVaciar.addEventListener('click', () => {
    carrito.length = 0
    actualizarCarrito()
})
//boton de confirmar la compra
botonComprar.addEventListener('click', () => {
     (carrito.length != 0)?
    swal({
        title: "Gracias por tu compra ",
        icon: "success",
        text: "tu pedido llegara en el plazo de 4 a 7 dia",
        button:"volver",
        
    })  : 

    swal({
        title: "no hay productos",
        icon: "error",
        button:"volver",
        
})
carrito.length = 0
actualizarCarrito()
})


//crear las card
stockProductos.forEach((producto) => {
    const div = document.createElement('div')
    div.classList.add('producto')
    div.innerHTML = `
    <div class="card h-100">
    <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">
                ${(producto.stock > 0) ? producto.stock  : 'sin stock'}
            </div>
    <img src=${producto.img} class="img-thumbnail" alt= "">
    <h3>${producto.nombre}</h3>
    <p class="card-text text-white-50 description">${producto.desc}</p>
    <p class="precioProducto">Precio:$ ${producto.precio}</p>
    <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
    </div>
    `
    contenedorProductos.appendChild(div)

    //insertamos las card en el dom:
    const boton = document.getElementById(`agregar${producto.id}`)

    boton.addEventListener('click', () => {
    (producto.stock > 0)?
        
        agregarAlCarrito(producto.id)

        :
        (async () => {

            const { value: email } = await Swal.fire({
              title: 'Email',
              input: 'email',
              inputLabel: 'dejanos tu email y te avisaremos cuando ingresa el producto',
              inputPlaceholder: 'Ingrese su dirección de correo electrónico'
            })
            
            if (email) {
              Swal.fire(`gracias: ${email}`)
            }
            
            })()
        
    })
})

// agregamos al carrito 
const agregarAlCarrito = (prodId) => {

    // comprobacion para no repetir los productos en el carrito
    const existe = carrito.some (prod => prod.id === prodId) //comprobar si el elemento ya existe en el carro

    if (existe){
        const prod = carrito.map (prod => { 
            
            if (prod.id === prodId){
                prod.cantidad++
            }
        })
    } else { 
        const item = stockProductos.find((prod) => prod.id === prodId)
       
        carrito.push(item)
    }

    actualizarCarrito() 
   
}

const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId)

    const indice = carrito.indexOf(item) 

    carrito.splice(indice, 1) 
    
    actualizarCarrito() 
  
    console.log(carrito)
}

const actualizarCarrito = () => {
   
    //productos en el carrito
    contenedorCarrito.innerHTML = "" 

    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <div class="overflow-auto d-flex ">
        <img src="${prod.img}"d-block mx-auto style="width: 100px" alt="">
        <div>
                    <h5>${prod.nombre}</h5>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        </div>
        `

        contenedorCarrito.appendChild(div)
        
        
        localStorage.setItem('carrito', JSON.stringify(carrito))
        
    })
   
    contadorCarrito.innerText = carrito.length // actualizamos con la longitud del carrito.

    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)

}
