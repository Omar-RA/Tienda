import { useState } from "react";
import ListaProductos from "./components/ListaProductos";
import Carrito from "./components/Carrito";
import Pago from "./components/Pago";
import "./styles/estilos.css";

function App() {

const productos = [
  {id:1,nombre:"Laptop",precio:15000},
  {id:2,nombre:"Mouse",precio:300},
  {id:3,nombre:"Teclado",precio:800}
];

const [carrito,setCarrito] = useState([]);

const agregarProducto = (producto)=>{
  setCarrito([...carrito,producto]);
}

const eliminarProducto = (id)=>{
  setCarrito(carrito.filter(p=>p.id !== id));
}

const vaciarCarrito = ()=>{
  setCarrito([]);
}

const total = carrito.reduce((acc,p)=>acc+p.precio,0);

return (

<div className="container">

<h1>Tienda Virtual</h1>

<ListaProductos
productos={productos}
agregarProducto={agregarProducto}
/>

<Carrito
carrito={carrito}
eliminarProducto={eliminarProducto}
vaciarCarrito={vaciarCarrito}
total={total}
/>

<Pago total={total} vaciarCarrito={vaciarCarrito} />

</div>

);
}

export default App;