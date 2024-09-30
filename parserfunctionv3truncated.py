
#This call questions statistics into flask. It will make a webpage that runs off your ports (1. to practice flask. 2. To show all the info)
from flask import jsonify
import requests
from pymongo import MongoClient
from pandas import DataFrame
import datetime

def get_database():
 
   # connection to database string. Change this to switch databases
   CONNECTION_STRING = #connection string

   client = MongoClient(CONNECTION_STRING)
 
   # Create/select the database with inputted name
   return client['StudentsAtRisk']

def updatequizrec(courseid, access_token, dbname, collection_name, currentquiz):


   #print("really/")
    api_url = f'https://canvas.instructure.com/api/v1/courses/{courseid}/quizzes/{currentquiz}/statistics'
    headers ={
        'Authorization': f'Bearer {access_token}'
    }

    print("yippoiee")
    try:
        response = requests.get(api_url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            questiontext = []
            selectors = [[]]
            noanswerset = ["multiple_choice_question", "true_false_question", "short_answer_question"]
            answerset = ["fill_in_multiple_blanks_question", "multiple_dropdowns_question", "matching_question"]
            
            print(selectors[0])
            print("check this shi out^")
            
            for x in range(len(data["quiz_statistics"][0]["question_statistics"])):
                questiontext.append(data["quiz_statistics"][0]["question_statistics"][x]["question_text"])
                selectors.append([])
                if data["quiz_statistics"][0]["question_statistics"][x]["question_type"] in noanswerset:
                    for y in range(len(data["quiz_statistics"][0]["question_statistics"][x]["answers"])):
                        print("what do we have here...")
                        print(data["quiz_statistics"][0]["question_statistics"][x]["answers"][y])
                        if(data["quiz_statistics"][0]["question_statistics"][x]["answers"][y]["correct"] == False):
                            if(len(data["quiz_statistics"][0]["question_statistics"][x]["answers"][y]["user_ids"]) > 0):
                                print("my number is "+str(x))
                                selectors[x] += data["quiz_statistics"][0]["question_statistics"][x]["answers"][y]["user_ids"]
                            else:
                                selectors[x] += [-1]
                if data["quiz_statistics"][0]["question_statistics"][x]["question_type"] in answerset:
                    for z in range(len(data["quiz_statistics"][0]["question_statistics"][x]["answer_sets"])):
                        for y in range(len(data["quiz_statistics"][0]["question_statistics"][x]["answer_sets"][z]["answers"])):
                            print("what do we have here...")
                            print(data["quiz_statistics"][0]["question_statistics"][x]["answer_sets"][z]["answers"][y])
                            if(data["quiz_statistics"][0]["question_statistics"][x]["answer_sets"][z]["answers"][y]["correct"] == False):
                                if(len(data["quiz_statistics"][0]["question_statistics"][x]["answer_sets"][z]["answers"][y]["user_ids"]) > 0):
                                    print("my number is "+str(x))
                                    selectors[x] += data["quiz_statistics"][0]["question_statistics"][x]["answer_sets"][z]["answers"][y]["user_ids"]
                                else:
                                    selectors[x] += [-1]                
            print("successfully saved students's quesitons for quiz")
                
            print(selectors)
            return [questiontext, selectors]

        else:
            print("error")
            return {'error'f'Failed to fetch data from API: {response.text}'}, response.status_code
    except Exception as e:
        print("everyday!"+ str(e))
        return {'error': str(e)}, 500

def updateassignments(courseid, access_token, assignmentmaxscore, dbname, collection_name):


    api_url = f'https://canvas.instructure.com/api/v1/courses/{courseid}/gradebook_history/feed'
    headers ={
        'Authorization': f'Bearer {access_token}'
    }

    try:
        response = requests.get(api_url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            data_sorted = sorted(data, key=lambda x: datetime.datetime.strptime(x['graded_at'], '%Y-%m-%dT%H:%M:%SZ'), reverse=True)


            seen_assignment_ids = set()

            # Filter out duplicates based on `assignment_id`
            unique_data = []
            for item in data_sorted:
                if item['assignment_id'] not in seen_assignment_ids:
                    unique_data.append(item)
                    seen_assignment_ids.add(item['assignment_id'])


            studentmap = {}
            print(assignmentmaxscore)
            print("checkpoiunt 0")
            print(data_sorted[0]["assignment_id"])
            print(assignmentmaxscore[data_sorted[0]["assignment_id"]])

            for x in range(len(unique_data)):
                if unique_data[x]["assignment_id"] not in assignmentmaxscore:
                    continue
                grade =  unique_data[x]["entered_score"] / float(assignmentmaxscore[unique_data[x]["assignment_id"]])
                grade = round(grade, 2) 
                print("check one")
                if unique_data[x]["user_id"] in studentmap:
                    print("precheck")
                    print(studentmap)
                    print(unique_data[x]["user_id"])
                    print(grade)
                    studentmap[unique_data[x]["user_id"]].append(grade)
                else:
                    studentmap.update({unique_data[x]["user_id"] : [grade]})
                    print(studentmap)
                    print("check two")

            print("are we empty?")
            print(studentmap)
            for key in studentmap.keys():
                print("do we check in")
                try:

                    

                    print("surely this works!")
                    if len(studentmap[key]) > 5:
                        recentgrades = studentmap[key][:3]
                    else:
                        recentgrades = studentmap[key]
                    
                    if (sum(studentmap[key]) / len(studentmap[key])) - 0.2 > (sum(recentgrades) / len(recentgrades)):
                        alert = True
                    else:
                        alert = False

                    print("CHECKPOINT WE MAKE")
                    collection_name.update_one({'_id': key}, {"$set": {"assignment_scores": studentmap[key], "recent_scores": recentgrades, "alert":alert}}, upsert=True)
                    print("total avg grade: ")
                    print((sum(studentmap[key]) / len(studentmap[key])) )
                    print("recent grade: ")
                    print(sum(recentgrades) / len(recentgrades))
                except Exception as e:
                    print("Error:", e)

            print("successfully saved students's assignment grades")
                

            return len(data) #["quiz_statistics"][0]["question_statistics"]
        else:
            return {'error': f'Failed to fetch data from API: {response.text}'}, response.status_code

    except Exception as e:
        print(e)
        return {'error': str(e)}, 500



def getquizzes(courseid, access_token):


    api_url = f'https://canvas.instructure.com/api/v1/courses/{courseid}/quizzes'
    headers ={
        'Authorization': f'Bearer {access_token}'
    }
    try:
        response = requests.get(api_url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            quizlist = []
            for x in range(len(data)):
                quizlist.append(data[x]["id"])
            return quizlist 
        else:
            return {'error': f'Failed to fetch data from API: {response.text}'}, response.status_code
    except Exception as e:
        return {'error': str(e)}, 500

def getassignments(courseid, access_token):


    api_url = f'https://canvas.instructure.com/api/v1/courses/{courseid}/assignments'
    headers ={
        'Authorization': f'Bearer {access_token}'
    }
    try:
        response = requests.get(api_url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            thisdict = {}
            for x in range(len(data)):
                thisdict.update({data[x]["id"]: data[x]["points_possible"]})
            return thisdict 
        else:
            return {'error': f'Failed to fetch data from API: {response.text}'}, response.status_code
    except Exception as e:
        return {'error': str(e)}, 500
    
def updatedb(courseid, access_token):

    # Selects newly created databse
    print("connecting...")
    dbname = get_database()
    # Makes collection with inputted name
    collection_name = dbname["Students"]
    print("connection complete")

    quizlist = getquizzes(courseid,access_token)
    assignmentmaxscore = getassignments(courseid, access_token)
    api_url = f'https://canvas.instructure.com/api/v1/courses/{courseid}/enrollments'
    headers ={
        'Authorization': f'Bearer {access_token}'
    }
    try:
        response = requests.get(api_url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            studentmap = {}

            print("we skip this?")
            print(assignmentmaxscore)
            print("before")
            updateassignments(courseid, access_token, assignmentmaxscore, dbname, collection_name)
            for x in range(len(data)):
                if(data[x]["type"] == "StudentEnrollment"):


                    try:
                        collection_name.update_one({'_id': data[x]["user_id"]}, {"$set": {"current_grade": data[x]["grades"]["current_score"]}}, upsert=True)
                        
                    except Exception as e:
                        print("Error:", e)
                    print("successfully saved "+data[x]["user"]["name"]+"'s final grade")

            #update quiz topics
            for x in range(len(quizlist)):
                print("hehah haha")
                print(quizlist)
                print("we need a center!")

      
                print("why is it ignoring...")
                results = updatequizrec(courseid, access_token, dbname, collection_name,quizlist[x])
                print("we dont leave????")
                print(results)
                print("we break aftr?")
                print(results[1])
                print("we break or here?")

                for y in range(len(results[1])):

                        for z in range(len(results[1][y])):
                            if results[1][y][z] != -1:
                                if results[1][y][z] in studentmap:
                                    print("we dont make it here?1")
                                    studentmap[results[1][y][z]].append(results[0][y])
                                else:
                                    print("we dont make it here?2")
                                    studentmap[results[1][y][z]] = [results[0][y]]
            for key in studentmap.keys():
                try:
                    collection_name.update_one({'_id': key}, {"$set": {"failed_questions": studentmap[key]}}, upsert=True)
                except Exception as e:
                    print("Error:", e)
            
            return 1 #["quiz_statistics"][0]["question_statistics"]
        else:
            return 0
    except Exception as e:
        return 0

courseid = #courseid
access_token = #accesstoken
updatedb(courseid, access_token)
print("ender")

