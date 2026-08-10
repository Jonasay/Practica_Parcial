import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

# Configuración de Supabase (se recomienda usar variables de entorno en producción/Render)
SUPABASE_URL = os.environ.get("SUPABASE_URL", "TU_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "TU_SUPABASE_KEY")

supabase: Client = None
if SUPABASE_URL != "TU_SUPABASE_URL" and SUPABASE_KEY != "TU_SUPABASE_KEY":
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error al conectar con Supabase: {e}")

@app.route('/', methods=['GET'])
def home():
    """Endpoint de estado / verificación"""
    return jsonify({
        "status": "success",
        "message": "API Flask funcionando correctamente en Render"
    }), 200

@app.route('/api/items', methods=['GET', 'POST'])
def handle_items():
    """Endpoint principal de ejemplo para obtener o guardar datos"""
    if request.method == 'GET':
        if supabase:
            try:
                response = supabase.table('items').select("*").execute()
                return jsonify({"status": "success", "data": response.data}), 200
            except Exception as e:
                return jsonify({"status": "error", "message": str(e)}), 500
        return jsonify({
            "status": "success",
            "data": [
                {"id": 1, "nombre": "Ejemplo 1"},
                {"id": 2, "nombre": "Ejemplo 2"}
            ]
        }), 200

    elif request.method == 'POST':
        data = request.get_json() or {}
        if supabase:
            try:
                response = supabase.table('items').insert(data).execute()
                return jsonify({"status": "success", "data": response.data}), 201
            except Exception as e:
                return jsonify({"status": "error", "message": str(e)}), 500
        return jsonify({
            "status": "success",
            "message": "Item recibido correctamente",
            "received": data
        }), 201

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
