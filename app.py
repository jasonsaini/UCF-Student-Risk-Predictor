
#This call questions statistics into flask. It will make a webpage that runs off your ports (1. to practice flask. 2. To show all the info)
from flask import Flask, jsonify
import requests

app = Flask(__name__)
# This calls my personal classroom that I've been testing in.
@app.route('/', methods=['GET'])
def fetch_data_from_api():
    api_url = 'https://canvas.instructure.com/api/v1/courses/8625733/quizzes/16949911/statistics'
    #testing. Stastistics call seems to give us all the information we need, but I think looking into the question call might still some useful info.
    #https://canvas.instructure.com/api/v1/courses/8625733/quizzes/16949911/statistics
    #https://canvas.instructure.com/api/v1/courses/8625733/quizzes/16949911/questions
    access_token = '7~BA14Jhif9Im1vFkYT0sgqmm094w8QunmPFMGCaVVhzpWrY5yDuYgy1CqbqCeDbhd'

    headers ={
        'Authorization': f'Bearer {access_token}'
    }
    try:
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            data = response.json()
            return data["quiz_statistics"][0]["question_statistics"]
        else:
            return jsonify({'error': f'Failed to fetch data from API: {response.text}'}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)