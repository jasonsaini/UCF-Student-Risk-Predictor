from flask import Flask, request, jsonify
from risk3 import *
from pymongo import MongoClient

app = Flask(__name__)



@app.route('/call_assignment_scores', methods=['POST'])
def call_assignment_scores_endpoint():
    data = request.get_json()
    
    id = data.get('id')
    courseid = data.get('courseid')
    authkey = data.get('authkey')

    # Make sure there is no missing parameters from request
    if not all([id, courseid, authkey]):
        return jsonify({'error': 'Missing parameters'}), 400

    client = MongoClient(authkey)
    dbname = client['Courses']
    collection_name = dbname[courseid]
    search_result = collection_name.find_one({"_id": id}, { "assignment_scores": 1})


    return jsonify({'assignment_scores': search_result["assignment_scores"]})

if __name__ == '__main__':
    app.run(debug=True)