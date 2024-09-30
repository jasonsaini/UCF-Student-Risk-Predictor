from risk3 import *
from pymongo import MongoClient



def call_scores(id, authkey):
    
    client = MongoClient(authkey)
 
    # Create/select the database with inputted name
    dbname = client['StudentsAtRisk']
    collection_name = dbname["Students"]
    search_result = collection_name.find_one({"_id": id}, { "assignment_scores": 1, "recent_scores": 1, "current_grade": 1 })
    currentgradescore = search_result["current_grade"]
    recentgradescore= sum(search_result["recent_scores"])/len(search_result["recent_scores"])
    gradetrendscore = sum(search_result["assignment_scores"])/len(search_result["assignment_scores"])
    print(calculate_risk_index(recentgradescore, currentgradescore, gradetrendscore, 70))

call_scores([studentid],[connectionstring to data base] )
