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

def calculate_risk_index(rps, cgs, gts, current_score):
    if current_score <= 69:
        return 38, "High Risk"
    
    # Base weights
    weights = {
        'rps': 0.3,
        'cgs': 0.55,
        'gts': 0.15
    }

    # Calculate risk index
    risk_index = (weights['rps'] * rps + 
                  weights['cgs'] * cgs + 
                  weights['gts'] * gts)

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

    # Trim whitespace from headers
    data.columns = data.columns.str.strip()

    # Extract relevant columns (adjust column names based on actual CSV structure)
    relevant_columns = ['Student', 'Final Score']
    assignment_columns = [col for col in data.columns if 'Assignment' in col]

    # Drop rows with '(read only)' in 'Final Score'
    data = data[data['Final Score'] != '(read only)']

    # Convert all assignment columns to numeric values, handling non-numeric values
    data[assignment_columns] = data[assignment_columns].apply(pd.to_numeric, errors='coerce')

    # Fill missing values in assignment scores with the mean score of the respective column
    data[assignment_columns] = data[assignment_columns].fillna(data[assignment_columns].mean())

    # Convert 'Final Score' to numeric, handling non-numeric values
    data['Final Score'] = pd.to_numeric(data['Final Score'], errors='coerce')

    # Fill missing values in 'Final Score' with a default value (e.g., 0)
    data['Final Score'] = data['Final Score'].fillna(0.0)

    # Calculate RPS, CGS
    data['RPS'] = data[assignment_columns].mean(axis=1)  # Recent Performance Score
    data['CGS'] = data['Final Score'].astype(float)      # Cumulative Grade Score

    # Calculate GTS (Grade Trend Score) based on assignment scores
    data['GTS'] = data[assignment_columns].apply(lambda row: normalize_gts(calculate_slope(np.arange(len(row)), row)), axis=1)

    # Convert the 'Current Score' column to numeric, setting errors='coerce' will turn non-numeric values to NaN
    data['Current Score'] = pd.to_numeric(data['Current Score'], errors='coerce')

    # Fill NaN values with a default value if necessary (e.g., 0 or some other appropriate value)
    data['Current Score'] = data['Current Score'].fillna(0).astype(int)


    # Calculate risk index and risk level for each student
    data['Risk Index'], data['Risk Level'] = zip(*data.apply(
        lambda row: calculate_risk_index(
            row['RPS'], row['CGS'], row['GTS'], row['Current Score']
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

    # Assuming 'Final Score' is a numeric column representing percentage grades
    data['Actual Risk Level'] = data['Current Score'].apply(determine_actual_risk_level)
    current_score = data['Current Score']
    # Save the results to a new CSV file
    output_file_path = file_path.replace('.csv', '_processed.csv')
    data.to_csv(output_file_path, index=False)
    print(f"Processed data saved to {output_file_path}")

# Process the provided CSV file
file_path = 'gradebook_data/redacted 2024-02-16T1142_Grades-EEL3801C-23Spring_0M01.csv'
process_gradebook(file_path)

