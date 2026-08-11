import React, { useState } from 'react';

const API_URL = 'https://practica-parcial-shel.onrender.com';

function App() {
  const [vista, setVista] = useState('registro'); // Controla qué pantalla se ve ('registro' o 'visitas')
  const [nombreRegistro, setNombreRegistro] = useState('');
  const [nombrePuntos, setNombrePuntos] = useState('');
  const [puntos, setPuntos] = useState(1);
  const [mensaje, setMensaje] = useState('');

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setMensaje('Registrando...');
    try {
      const res = await fetch(`${API_URL}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreRegistro })
      });
      const data = await res.json();
      setMensaje(data.mensaje || data.error);
      if (res.ok) setNombreRegistro('');
    } catch (error) {
      setMensaje("Error de conexión");
    }
  };

  const sumarPuntos = async (e) => {
    e.preventDefault();
    setMensaje('Actualizando...');
    try {
      const res = await fetch(`${API_URL}/sumar_puntos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombrePuntos, puntos: parseInt(puntos) })
      });
      const data = await res.json();
      setMensaje(data.mensaje ? `¡Éxito! ${nombrePuntos} ahora tiene ${data.visitas_totales} visitas.` : data.error);
      if (res.ok) {
        setNombrePuntos('');
        setPuntos(1);
      }
    } catch (error) {
      setMensaje("Error de conexión");
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">Sistema de Visitas</h1>

        {/* Barra de Navegación (Pestañas) */}
        <div className="tabs">
          <button
            className={vista === 'registro' ? 'tab active' : 'tab'}
            onClick={() => { setVista('registro'); setMensaje(''); }}
          >
            Registrar Usuario
          </button>
          <button
            className={vista === 'visitas' ? 'tab active' : 'tab'}
            onClick={() => { setVista('visitas'); setMensaje(''); }}
          >
            Sumar Visitas
          </button>
        </div>

        {/* Contenido de las pantallas */}
        <div className="content">
          {vista === 'registro' ? (
            <div className="form-section fade-in">
              <h2>Nuevo Usuario</h2>
              <form onSubmit={registrarUsuario}>
                <div className="input-group">
                  <label>Nombre de usuario</label>
                  <input
                    type="text"
                    placeholder="Ej. Noe Xicara"
                    value={nombreRegistro}
                    onChange={(e) => setNombreRegistro(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">Registrar</button>
              </form>
            </div>
          ) : (
            <div className="form-section fade-in">
              <h2>Actualizar Visitas</h2>
              <form onSubmit={sumarPuntos}>
                <div className="input-group">
                  <label>Nombre de usuario</label>
                  <input
                    type="text"
                    placeholder="Ej. Noe Xicara"
                    value={nombrePuntos}
                    onChange={(e) => setNombrePuntos(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Puntos a sumar</label>
                  <input
                    type="number"
                    value={puntos}
                    onChange={(e) => setPuntos(e.target.value)}
                    required
                    min="1"
                  />
                </div>
                <button type="submit" className="btn-secondary">Sumar Puntos</button>
              </form>
            </div>
          )}

          {/* Mensajes de respuesta */}
          {mensaje && (
            <div className="alert">
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

