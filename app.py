from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client

app = Flask(__name__)
CORS(app) # Permite que el frontend se comunique con el backend

# Configuración de Supabase
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.route('/registrar', methods=['POST'])
def registrar_usuario():
    data = request.get_json()
    nombre = data.get('nombre')
    
    if not nombre:
        return jsonify({"error": "Falta el nombre"}), 400
        
    try:
        response = supabase.table('usuarios').insert({"nombre": nombre, "visitas": 0}).execute()
        return jsonify({"mensaje": "Usuario registrado exitosamente", "data": response.data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/sumar_puntos', methods=['POST'])
def sumar_puntos():
    data = request.get_json()
    nombre = data.get('nombre')
    puntos_a_sumar = data.get('puntos', 1) # Suma 1 por defecto si no se envía
    
    try:
        # 1. Obtener visitas actuales
        user = supabase.table('usuarios').select('visitas').eq('nombre', nombre).execute()
        if not user.data:
            return jsonify({"error": "Usuario no encontrado"}), 404
            
        nuevas_visitas = user.data[0]['visitas'] + puntos_a_sumar
        
        # 2. Actualizar visitas
        update = supabase.table('usuarios').update({"visitas": nuevas_visitas}).eq('nombre', nombre).execute()
        return jsonify({"mensaje": "Puntos sumados", "visitas_totales": nuevas_visitas}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)