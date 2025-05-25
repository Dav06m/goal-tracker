from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import json
import os
from datetime import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app)

mongo_uri = os.environ.get("MONGO_URI")
client = MongoClient(mongo_uri)

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
        "Set aside 30 minutes each day to work on this goal",
        "Share your goal with a friend for accountability",
        "Break this goal down into smaller weekly targets",
        "Create a vision board for this goal to stay motivated",
        "Journal about your progress weekly"
    ],
    "work": [
        "Schedule a specific time block in your calendar for this task",
        "Use the Pomodoro technique (25min work, 5min break) to make progress",
        "Create a distraction-free environment when working on this goal",
        "Find an accountability partner at work",
        "Set up automated reminders to work on this goal"
    ],
    "health": [
        "Track your progress with a dedicated health app",
        "Find a workout buddy to keep you motivated",
        "Prepare your gym clothes the night before to remove friction",
        "Try habit stacking - attach your new health habit to an existing one",
        "Schedule your workouts at the same time each day to build consistency"
    ],
    "finance": [
        "Set up an automatic transfer to a dedicated savings account",
        "Review your progress weekly and adjust your budget as needed",
        "Use a spending tracker app to identify areas where you can cut back",
        "Try the 30-day rule - wait 30 days before making any large purchase",
        "Consider consulting with a financial advisor for personalized advice"
    ],
    "learning": [
        "Use spaced repetition techniques to retain what you learn",
        "Teach someone else what you've learned to solidify your understanding",
        "Join an online community related to what you're learning",
        "Apply the Feynman Technique - explain the concept in simple terms",
        "Set up a distraction-free learning environment"
    ],
    "other": [
        "Review your goal weekly and adjust your approach as needed",
        "Create a visual reminder of your goal somewhere you'll see daily",
        "Celebrate small wins to maintain motivation",
        "Use the SMART framework to refine your goal",
        "Try the 'don't break the chain' method - mark each day you work on your goal"
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