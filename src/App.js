import React, { useState, useEffect } from 'react';
import './index.css';

export default function App() {
  // 1. Estados para el catálogo dinámico (NUEVO)
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);

  // 2. Estados del carrito y pago (los que ya tenías)
  const [carrito, setCarrito] = useState([]);
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [estado, setEstado] = useState({ tipo: '', texto: '' });
  const [cargando, setCargando] = useState(false);

  // 3. Descargar productos desde Haskell al abrir la página (NUEVO)
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/productos');
        const datos = await respuesta.json();
        setProductosDisponibles(datos);
      } catch (error) {
        setEstado({ tipo: 'error', texto: 'Error al conectar con el servidor Haskell para cargar el catálogo.' });
      } finally {
        setCargandoCatalogo(false);
      }
    };

    obtenerProductos();
  }, []);

  // 4. Funciones del carrito
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    setEstado({ tipo: 'info', texto: `Agregaste: ${producto.nombreProducto}` });
  };

  const eliminarDelCarrito = (id) => {
    const indice = carrito.findIndex((p) => p.idProducto === id);
    if (indice !== -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito.splice(indice, 1);
      setCarrito(nuevoCarrito);
    }
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    setEstado({ tipo: '', texto: '' });
  };

  const calcularTotalVisual = () => carrito.reduce((tot, p) => tot + p.precio, 0);

  // 5. Procesar la compra con el backend
  const procesarCompra = async (e) => {
    e.preventDefault();
    setCargando(true);
    setEstado({ tipo: 'info', texto: 'Procesando pago con el servidor...' });

    try {
      // POST al backend de Haskell
      const respuesta = await fetch('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carritoFront: carrito, // Nota: el backend espera 'carritoFront'
          tarjetaFront: numeroTarjeta // Nota: el backend espera 'tarjetaFront'
        })
      });

      const datos = await respuesta.json();

      if (datos.exito) {
        setEstado({ tipo: 'exito', texto: `${datos.mensaje} Total final: $${datos.totalCobrado}` });
        setCarrito([]);
        setNumeroTarjeta('');
      } else {
        setEstado({ tipo: 'error', texto: datos.mensaje });
      }
    } catch (error) {
      setEstado({ tipo: 'error', texto: 'No se pudo conectar con el servidor Haskell.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="contenedor">
      <header className="cabecera">
        <h1>Tienda Funcional</h1>
      </header>

      <main className="grid-principal">
        {/* Catálogo dinámico */}
        <section className="seccion">
          <h2>Catálogo</h2>
          {cargandoCatalogo ? (
            <p>Cargando productos desde el servidor Haskell...</p>
          ) : (
            <div className="grid-productos">
              {productosDisponibles.map((prod) => (
                <div key={prod.idProducto} className="tarjeta-producto">
                  <h3>{prod.nombreProducto}</h3>
                  <p className="precio">${prod.precio}</p>
                  <button className="btn-agregar" onClick={() => agregarAlCarrito(prod)}>
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Panel lateral: Carrito y Pago */}
        <aside className="seccion lateral">
          <h2>Tu Carrito <span className="badge">{carrito.length}</span></h2>
          
          <div className="lista-carrito">
            {carrito.length === 0 ? <p className="vacio">Carrito vacío</p> : null}
            {carrito.map((prod, index) => (
              <div key={index} className="item-carrito">
                <span>{prod.nombreProducto}</span>
                <div className="acciones-item">
                  <span>${prod.precio}</span>
                  <button className="btn-eliminar" onClick={() => eliminarDelCarrito(prod.idProducto)}>✖</button>
                </div>
              </div>
            ))}
          </div>

          <div className="totales">
            <h3>Total: ${calcularTotalVisual()}</h3>
            <button className="btn-secundario" onClick={vaciarCarrito} disabled={carrito.length === 0}>
              Vaciar
            </button>
          </div>

          <hr className="divisor" />

          <h2>Pago</h2>
          <form onSubmit={procesarCompra} className="formulario-pago">
            <input 
              type="text" 
              className="input-tarjeta"
              maxLength="16"
              value={numeroTarjeta} 
              onChange={(e) => setNumeroTarjeta(e.target.value)} 
              placeholder="Número de tarjeta (16 dígitos)"
              required
            />
            <button type="submit" className="btn-pagar" disabled={cargando || carrito.length === 0}>
              {cargando ? 'Procesando...' : 'Confirmar Compra'}
            </button>
          </form>

          {estado.texto && (
            <div className={`alerta alerta-${estado.tipo}`}>
              {estado.texto}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}