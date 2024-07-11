
#This call questions statistics into flask. It will make a webpage that runs off your ports (1. to practice flask. 2. To show all the info)
from flask import Flask, jsonify
import requests

app = Flask(__name__)
# This calls my personal classroom that I've been testing in.
@app.route('/', methods=['GET'])
def fetch_data_from_api():
    api_url = #truncated
    access_token = #truncatred

    headers ={
        'Authorization': f'Bearer {access_token}'
    }
    try:
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            data = response.json()
            return jsonify(data) #["quiz_statistics"][0]["question_statistics"]
        else:
            return jsonify({'error': f'Failed to fetch data from API: {response.text}'}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)