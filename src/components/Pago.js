import { useState } from "react";

function Pago({total,vaciarCarrito}){

const [tarjeta,setTarjeta] = useState("");

const confirmarCompra = ()=>{

if(tarjeta.length === 16 && !isNaN(tarjeta)){

alert("Compra realizada con éxito");
vaciarCarrito();
setTarjeta("");

}else{

alert("Número de tarjeta inválido");

}

}

return(

<div className="pago">

<h2>Pago</h2>

<p>Total a pagar: ${total}</p>

<input
type="text"
placeholder="Número de tarjeta"
value={tarjeta}
onChange={(e)=>setTarjeta(e.target.value)}
/>

<button onClick={confirmarCompra}>
Confirmar compra
</button>

</div>

);

}

export default Pago;