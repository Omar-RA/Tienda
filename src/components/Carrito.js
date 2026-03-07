function Carrito({carrito,eliminarProducto,vaciarCarrito,total}){

return(

<div>

<h2>Carrito</h2>

{carrito.length === 0 && <p>El carrito está vacío</p>}

{carrito.map((p,index)=>(
<div key={index} className="carrito-item">

<p>{p.nombre} - ${p.precio}</p>

<button onClick={()=>eliminarProducto(p.id)}>
Eliminar
</button>

</div>
))}

<h3 className="total">Total: ${total}</h3>

<button onClick={vaciarCarrito} className="vaciar">
Vaciar carrito
</button>

</div>

);

}

export default Carrito;