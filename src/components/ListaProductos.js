function ListaProductos({productos,agregarProducto}){

return(

<div>

<h2>Productos disponibles</h2>

{productos.map(p=>(
<div key={p.id} className="producto">

<p>{p.nombre} - ${p.precio}</p>

<button onClick={()=>agregarProducto(p)}>
Agregar al carrito
</button>

</div>
))}

</div>

);

}

export default ListaProductos;