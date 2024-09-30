import pandas as pd
import numpy as np

def calculate_slope(x, y):
    n = len(x)
    sum_x = np.sum(x)
    sum_y = np.sum(y)
    sum_xy = np.sum(x * y)
    sum_x_squared = np.sum(x ** 2)
    slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x_squared - sum_x ** 2)
    return slope

def normalize_gts(slope, min_slope=-10, max_slope=10):
    return ((slope - min_slope) / (max_slope - min_slope)) * 100

def calculate_risk_index(rps, cgs, gts, as_score, es, attendance_graded, engagement_graded):
    # Base weights
    weights = {
        'rps': 0.4,
        'cgs': 0.3,
        'gts': 0.2,
        'as': 0.1 if attendance_graded else 0,
        'es': 0.1 if engagement_graded else 0
    }

    # Adjust weights to sum to 1
    total_weight = sum(weights.values())
    adjusted_weights = {k: v / total_weight for k, v in weights.items()}

    risk_index = (adjusted_weights['rps'] * rps + 
                  adjusted_weights['cgs'] * cgs + 
                  adjusted_weights['gts'] * gts + 
                  adjusted_weights['as'] * as_score + 
                  adjusted_weights['es'] * es)

    if risk_index > 70:
        risk_level = "Low Risk"
    elif 40 < risk_index <= 70:
        risk_level = "Medium Risk"
    else:
        risk_level = "High Risk"

    return risk_index, risk_level

def process_gradebook(file_path):
    # Load the CSV file
    data = pd.read_csv(file_path)

    # Extract relevant columns (adjust column names based on actual CSV structure)
    # Assume 'Final Grade' is the final submitted grade
    data.columns = data.columns.str.strip()
    relevant_columns = ['Student', 'Final Score']
    assignment_columns = [col for col in data.columns if 'Assignment' in col]

    data = data[data['Final Score'] != '(read only)']

    for col in data.columns:
        print(col)
    
    data = data[relevant_columns + assignment_columns]

    data[assignment_columns] = data[assignment_columns].apply(pd.to_numeric, errors='coerce')
        # Fill missing values in assignment scores with the mean score of the respective column
    data[assignment_columns] = data[assignment_columns].fillna(data[assignment_columns])
    
    data['Final Score'] = data['Final Score'].fillna(0.0)
    print("Data Assignment Cols: ")
    print(data[assignment_columns])
    # Calculate GTS (Grade Trend Score) based on assignment scores
    data['RPS'] = data[assignment_columns].mean(axis=1)  # Recent Performance Score
    print("Final Grade Data: ")
    print(data['Final Score'])
    data['CGS'] = data['Final Score'].astype(float)      # Cumulative Grade Score
    
       # Calculate GTS (Grade Trend Score) based on assignment scores
    data['GTS'] = data[assignment_columns].apply(lambda row: normalize_gts(calculate_slope(np.arange(len(row)), row)), axis=1)
    

    # Calculate risk index and risk level for each student
    data['Risk Index'], data['Risk Level'] = zip(*data.apply(
        lambda row: calculate_risk_index(
            row['RPS'], row['CGS'], row['GTS'], False, False
        ), axis=1
    ))

    # Compare the calculated risk level with the actual final grade
    def determine_actual_risk_level(final_grade):
        if final_grade >= 87:
            return "Low Risk"
        elif 70 <= final_grade < 87:
            return "Medium Risk"
        else:
            return "High Risk"

    # Assuming 'Final Grade' is a numeric column representing percentage grades
    data['Actual Risk Level'] = data['Final Grade'].apply(determine_actual_risk_level)

    # Save the results to a new CSV file
    output_file_path = file_path.replace('.csv', '_processed.csv')
    data.to_csv(output_file_path, index=False)
    print(f"Processed data saved to {output_file_path}")

# Process the provided CSV file
file_path = 'gradebook_data/redacted 2024-02-16T1142_Grades-EEL3801C-23Spring_0M01.csv'
process_gradebook(file_path)
