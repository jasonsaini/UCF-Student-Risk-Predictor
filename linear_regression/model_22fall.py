import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

import tabloo

df = pd.read_csv('22_Fall.csv')

qualifiers = [
        df['Student'] == 'Student, Test',
        df['Student'] == '    Points Possible' # TODO when standardizing we will probably want to use this value!
]

blacklisted_columns = [
        'ID',
        'SIS User ID',
        'SIS Login ID',
        'Root Account',
        'Section',
        'Assignments Current Score',
        'Assignments Unposted Current Score',
        'Assignments Final Score',
        'Assignments Unposted Final Score',
        'Assignment Reminders Current Score',
        'Assignment Reminders Unposted Current Score',
        'Assignment Reminders Final Score',
        'Assignment Reminders Unposted Final Score',
        'Migrated Quizzes Current Score',
        'Migrated Quizzes Unposted Current Score',
        'Migrated Quizzes Final Score',
        'Migrated Quizzes Unposted Final Score',
        'Current Grade',
        'Unposted Current Grade',
        'Final Grade',
        'Unposted Final Grade',
        'FYI - not an assignment: Intel Overclocking video (7727584)',
        'Quiz 3 Raw Score without curve which is Not used for letter grade calculation - Requires Respondus LockDown Browser (7790127)',
        'EC Total to Ex1 (7727580)',
        'EC Total to Ex2 (7727581)',
        "Student's Request for Authorization of Absence - Webcourses Quiz for Step 1 (7728942)"
]

blacklisted_rows = [
    0
]

"""
'FYI - not an assignment: Intel Overclocking video (7559325)',
'Testing Loop Unrolling Question (758099)'
"""

is_blacklisted = lambda col: col in blacklisted_columns

for qual in qualifiers:
    indices = df[qual].index
    df.drop(indices, inplace=True)

df.drop(columns=blacklisted_columns, axis='columns', inplace=True)
df.drop(blacklisted_rows, axis='index', inplace=True)

# EDA: Summary Statistics
print("Summary statistics: ", df.describe())

# Save Correlation Matrix Heatmap to file
plt.figure(figsize=(60, 60))
sns.heatmap(df.corr(), annot=True, fmt=".2f", cmap='coolwarm')
plt.title('Correlation Matrix')
plt.savefig('correlation_matrix.png')  # Saves the plot as a PNG file
plt.close()  # Close the plot to free up memory

"""
# Save Correlation Matrix Heatmap to file
f = plt.figure(figsize=(60, 60))
plt.matshow(df.corr(), fignum=f.number)
plt.xticks(range(df.select_dtypes(['number']).shape[1]), df.select_dtypes(['number']).columns, fontsize=14, rotation=45)
plt.yticks(range(df.select_dtypes(['number']).shape[1]), df.select_dtypes(['number']).columns, fontsize=14)
cb = plt.colorbar()
cb.ax.tick_params(labelsize=14)
plt.title('Correlation Matrix', fontsize=16);
plt.savefig('correlation_matrix.png')  # Saves the plot as a PNG file
"""

# Save Distribution of Final Scores to file
plt.figure(figsize=(60, 60))
sns.histplot(df['Final Score'], kde=True, color='blue')
plt.title('Distribution of Final Scores')
plt.xlabel('Final Score')
plt.ylabel('Frequency')
plt.savefig('final_score_distribution.png')
plt.close()

# Convert object types to floating point
for col in df.columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')

df.dropna(inplace=True)

df.to_csv('cleaned.csv')

X = df.drop('Final Score', axis='columns') # Features
y = df['Final Score'] # Target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)

print("MSE: ", mse)
