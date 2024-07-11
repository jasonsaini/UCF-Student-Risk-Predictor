
#This call questions statistics into flask. It will make a webpage that runs off your ports (1. to practice flask. 2. To show all the info)
from flask import Flask, jsonify, request
import requests, csv, os, tempfile, uuid

app = Flask(__name__)
# This calls my personal classroom that I've been testing in.
@app.route('/', methods=['GET'])
def fetch_data_from_api():
    api_url = 'https://canvas.instructure.com/api/v1/courses/8625733/quizzes/16949911/statistics'
    #testing. Stastistics call seems to give us all the information we need, but I think looking into the question call might still some useful info.
    #https://canvas.instructure.com/api/v1/courses/8625733/quizzes/16949911/statistics
    #https://canvas.instructure.com/api/v1/courses/8625733/quizzes/16949911/questions
    # access_token = #accesstoken
    
    # Fixing error caused by wrong access_token
    access_token = "empty_value"

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
    

'''
    Endpoint to retrieve manual submission
    from instructor
'''
@app.route('/upload', methods=["POST"])
def upload_file():
    # For this to work, always make the key -> "file" when the actual data is being passed in
    if "file" not in request.files:
        return jsonify({
            "error" : "No file was uploaded or wrong key was provided"
        }), 400
        
    uploaded_file = request.files["file"]
    
    if not allowed_file(uploaded_file.filename):
        return jsonify({
            "error" : "File must always be a .csv file"
        }), 400
        
    filename = str(uuid.uuid4()) + '-' + uploaded_file.filename
    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, filename)
    uploaded_file.save(file_path)

        
        
    # Past this, everything should be fine with the code...
    retrieved_data = temporary_parser(file_path)
    
    return jsonify({
        "data_retrieved" : retrieved_data
    }), 200
    
    
def allowed_file(filename):
    ALLOWED_EXT = ["csv"] # Add in more file extensions if we want more...
    name = filename.split(".")
    return name[1].lower() in ALLOWED_EXT

def temporary_parser(file):
    with open(file, newline='') as csvfile:
        reader = csv.reader(csvfile)
        
        # Read the first row
        first_row = next(reader)
        
        first_elements = first_row[5:]
        
        return first_elements
        
if __name__ == '__main__':
    app.run(debug=True)
