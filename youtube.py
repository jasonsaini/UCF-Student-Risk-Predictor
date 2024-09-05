from youtubesearchpython import VideosSearch
import json
import requests

# Define the URL
url = "http://10.173.214.164:8000/square"


quiz_data = {
    "title": "Statistics 2 - Quiz",
    "instructions": "Please answer all the questions. For multiple-choice questions, select the best option.",
    "questions": [
        {
            "id": 1,
            "type": "multiple_choice",
            "question": "Which of the following is the null hypothesis in a two-tailed test?",
            "choices": [
                "H₀: μ = 0",
                "H₁: μ > 0",
                "H₀: μ ≠ 0",
                "H₁: μ < 0"
            ],
            "chosen_answer": "H₀: μ ≠ 0",  # Chosen incorrect answer
            "correct_answer": "H₀: μ = 0",  # Correct answer
            "points": 5
        },
        {
            "id": 2,
            "type": "multiple_choice",
            "question": "In simple linear regression, what does the slope of the regression line represent?",
            "choices": [
                "The predicted value of the dependent variable when the independent variable is zero.",
                "The change in the dependent variable for a one-unit change in the independent variable.",
                "The strength of the relationship between the dependent and independent variable.",
                "The standard error of the estimate."
            ],
            "chosen_answer": "The predicted value of the dependent variable when the independent variable is zero.",  # Chosen incorrect answer
            "correct_answer": "The change in the dependent variable for a one-unit change in the independent variable.",  # Correct answer
            "points": 5
        },
        {
            "id": 3,
            "type": "true_false",
            "question": "A p-value less than 0.05 suggests strong evidence against the null hypothesis.",
            "chosen_answer": "false",  # Chosen incorrect answer
            "correct_answer": "true",  # Correct answer
            "points": 3
        },
        {
            "id": 4,
            "type": "short_answer",
            "question": "Define the term 'confidence interval' and explain its importance in hypothesis testing.",
            "chosen_answer": "A confidence interval is the average value of a data sample. It shows how much the sample deviates from the population.",  # Chosen incorrect answer
            "correct_answer": "A confidence interval is a range of values, derived from a sample, that is likely to contain the value of an unknown population parameter. It is important because it provides an estimate of uncertainty around a sample statistic.",  # Correct answer
            "points": 7
        },
        {
            "id": 5,
            "type": "multiple_choice",
            "question": "Which of the following is the correct formula for the t-statistic in a hypothesis test?",
            "choices": [
                "t = (x̄ - μ) / (s/√n)",
                "t = (μ - x̄) / s",
                "t = (x̄ + μ) / (s√n)",
                "t = μ / (x̄ - s)"
            ],
            "chosen_answer": "t = μ / (x̄ - s)",  # Chosen incorrect answer
            "correct_answer": "t = (x̄ - μ) / (s/√n)",  # Correct answer
            "points": 5
        },
        {
            "id": 6,
            "type": "multiple_choice",
            "question": "What is the probability of a Type I error?",
            "choices": [
                "1 - β",
                "α",
                "β",
                "1 - α"
            ],
            "chosen_answer": "α",  # Chosen correct answer
            "correct_answer": "α",  # Correct answer
            "points": 5
        },
        {
            "id": 7,
            "type": "short_answer",
            "question": "Explain the difference between Type I and Type II errors in hypothesis testing.",
            "chosen_answer": "Type I error happens when you accept the null hypothesis, and Type II error happens when you reject the null hypothesis.",  # Chosen incorrect answer
            "correct_answer": "A Type I error occurs when the null hypothesis is true but is rejected. A Type II error occurs when the null hypothesis is false but is not rejected.",  # Correct answer
            "points": 7
        },
        {
            "id": 8,
            "type": "calculation",
            "question": "Given the following data for a regression analysis, calculate the correlation coefficient: x = [2, 4, 6, 8], y = [5, 7, 10, 12]",
            "chosen_answer": "0.50",  # Chosen incorrect answer
            "correct_answer": "0.98",  # Correct answer
            "points": 10
        },
        {
            "id": 9,
            "type": "multiple_choice",
            "question": "Which distribution is typically used for hypothesis testing with small sample sizes?",
            "choices": [
                "Normal distribution",
                "Chi-square distribution",
                "Student's t-distribution",
                "F-distribution"
            ],
            "chosen_answer": "Student's t-distribution",  # Chosen correct answer
            "correct_answer": "Student's t-distribution",  # Correct answer
            "points": 5
        },
        {
            "id": 10,
            "type": "calculation",
            "question": "A sample of 25 students has a mean test score of 75 with a standard deviation of 8. Find the 95% confidence interval for the population mean.",
            "chosen_answer": "[60.00, 90.00]",  # Chosen incorrect answer
            "correct_answer": "[71.68, 78.32]",  # Correct answer
            "points": 10
        }
    ],
    "total_points": 62
}


quiz = quiz_data["title"]

# Define the parameters
params = {
    "number": "Give me 1 optimal search query to get a broad range of videos for a student based off this quiz performance:\n" + quiz
}

# Make the GET request
response = requests.get(url, params=params)

query = ""
# Print the response content
if response.status_code == 200:
    print(response.text) 
     # Or response.json() if expecting JSON data
else:
    print(f"Failed to get data. Status code: {response.status_code}")
    


if query:
    videosSearch = VideosSearch(query, limit = 5)

    pretty_json = json.dumps(videosSearch.result(), indent=4)

    print(pretty_json)