from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import json
import os
from datetime import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://admin:admin@localhost:27017/')
db = client['goaltracker']
goals_collection = db['goals']

# JSON encoder for MongoDB ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

app.json_encoder = JSONEncoder

SUGGESTIONS_BY_CATEGORY = {
    "personal": [
        "Dedica 30 minuti ogni giorno per lavorare su questo obiettivo",
        "Condividi il tuo obiettivo con un amico per responsabilizzarti",
        "Suddividi questo obiettivo in piccoli traguardi settimanali",
        "Crea una mood board per questo obiettivo per mantenere la motivazione",
        "Tieni un diario dei tuoi progressi ogni settimana"
    ],
    "work": [
        "Pianifica nel calendario un blocco di tempo specifico per questo compito",
        "Usa la tecnica Pomodoro (25 min di lavoro, 5 min di pausa) per fare progressi",
        "Crea un ambiente di lavoro senza distrazioni quando lavori su questo obiettivo",
        "Trova un partner di responsabilità sul lavoro",
        "Imposta promemoria automatici per lavorare su questo obiettivo"
    ],
    "health": [
        "Monitora i tuoi progressi con un’app dedicata alla salute",
        "Trova un compagno di allenamento per mantenerti motivato",
        "Prepara abiti da palestra la sera prima per ridurre l’attrito",
        "Prova l’abbinamento di abitudini: collega la nuova abitudine alla salute a una già esistente",
        "Programma i tuoi allenamenti alla stessa ora ogni giorno per creare costanza"
    ],
    "finance": [
        "Imposta un trasferimento automatico su un conto di risparmio dedicato",
        "Rivedi i tuoi progressi ogni settimana e aggiusta il budget se necessario",
        "Usa un’app di monitoraggio delle spese per individuare dove puoi tagliare",
        "Prova la regola dei 30 giorni: attendi 30 giorni prima di fare grandi acquisti",
        "Valuta di consultare un consulente finanziario per consigli personalizzati"
    ],
    "learning": [
        "Usa tecniche di ripetizione dilazionata per memorizzare ciò che impari",
        "Insegna a qualcuno ciò che hai appreso per solidificare la comprensione",
        "Unisciti a una comunità online correlata a ciò che stai studiando",
        "Applica la Tecnica di Feynman: spiega il concetto in termini semplici",
        "Prepara un ambiente di apprendimento senza distrazioni"
    ],
    "other": [
        "Rivedi il tuo obiettivo ogni settimana e aggiusta il tuo approccio se necessario",
        "Crea un promemoria visivo del tuo obiettivo in un luogo che vedrai ogni giorno",
        "Celebra i piccoli successi per mantenere alta la motivazione",
        "Usa il framework SMART per affinare il tuo obiettivo",
        "Prova il metodo “non rompere la catena”: segnala ogni giorno in cui lavori sul tuo obiettivo"
    ]

}

@app.route('/api/goals', methods=['GET'])
def get_goals():
    goals = list(goals_collection.find())
    return jsonify(goals)

@app.route('/api/goals', methods=['POST'])
def create_goal():
    goal = request.json
    goal['createdAt'] = datetime.now()
    result = goals_collection.insert_one(goal)
    goal['_id'] = result.inserted_id
    return jsonify(goal)

@app.route('/api/goals/<goal_id>', methods=['GET'])
def get_goal(goal_id):
    goal = goals_collection.find_one({'_id': ObjectId(goal_id)})
    if goal:
        return jsonify(goal)
    return jsonify({'error': 'Goal not found'}), 404

@app.route('/api/goals/<goal_id>', methods=['PUT'])
def update_goal(goal_id):
    updates = request.json
    result = goals_collection.update_one(
        {'_id': ObjectId(goal_id)},
        {'$set': updates}
    )
    if result.modified_count:
        return jsonify({'message': 'Goal updated successfully'})
    return jsonify({'error': 'Goal not found'}), 404

@app.route('/api/goals/<goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    result = goals_collection.delete_one({'_id': ObjectId(goal_id)})
    if result.deleted_count:
        return jsonify({'message': 'Goal deleted successfully'})
    return jsonify({'error': 'Goal not found'}), 404

@app.route('/api/suggestions/<category>', methods=['GET'])
def get_suggestions(category):
    if category not in SUGGESTIONS_BY_CATEGORY:
        category = "other"
    suggestions = SUGGESTIONS_BY_CATEGORY[category][:3]
    return jsonify([
        {"text": text, "type": ["action", "resource", "tip"][i % 3]}
        for i, text in enumerate(suggestions)
    ])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)