import React, { useState } from 'react';

const API_URL = 'https://practica-parcial-shel.onrender.com';

function App() {
  const [nombreRegistro, setNombreRegistro] = useState('');
  const [nombrePuntos, setNombrePuntos] = useState('');
  const [puntos, setPuntos] = useState(1);
  const [mensaje, setMensaje] = useState('');

  const registrarUsuario = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreRegistro })
    });
    const data = await res.json();
    setMensaje(data.mensaje || data.error);
  };

  const sumarPuntos = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/sumar_puntos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombrePuntos, puntos: parseInt(puntos) })
    });
    const data = await res.json();
    setMensaje(data.mensaje ? `${data.mensaje}. Total: ${data.visitas_totales}` : data.error);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Sistema de Visitas</h1>

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Registrar Usuario</h3>
        <form onSubmit={registrarUsuario}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={nombreRegistro}
            onChange={(e) => setNombreRegistro(e.target.value)}
            required
          />
          <button type="submit">Registrar</button>
        </form>
      </div>

      <div style={{ padding: '10px', border: '1px solid #ccc' }}>
        <h3>Sumar Puntos/Visitas</h3>
        <form onSubmit={sumarPuntos}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={nombrePuntos}
            onChange={(e) => setNombrePuntos(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Puntos a sumar"
            value={puntos}
            onChange={(e) => setPuntos(e.target.value)}
            required
          />
          <button type="submit">Sumar</button>
        </form>
      </div>

      {mensaje && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>Respuesta: {mensaje}</p>}
    </div>
  );
}

export default App;