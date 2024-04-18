import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

import tabloo

# TODO remove all columns with "EC" => Extra Credit?
# TODO replace all EC with 0, since they get 0 extra credit

# This works for extra credit
# Implement conditional cond for generalized filtering
def replace_nan_with_zero(df, cond=None):
    for col in df.columns:
        if 'EC' in col:
            df[col] = df[col].fillna(0)
    return df

df = pd.read_csv('22_Spring.csv')

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
        'Imported Assignments Current Score',
        'Imported Assignments Unposted Current Score',
        'Imported Assignments Final Score',
        'Imported Assignments Unposted Final Score',
        'Migrated Quizzes Current Score',
        'Migrated Quizzes Unposted Current Score',
        'Migrated Quizzes Final Score',
        'Migrated Quizzes Unposted Final Score',
        'Current Grade',
        'Unposted Current Grade',
        'Final Grade',
        'Unposted Final Grade',
        'FYI - not an assignment: Intel Overclocking video (7456091)',
        'Assignments Current Score',
        'Assignments Unposted Current Score',
        'Assignments Final Score',
        'Assignments Unposted Final Score',
        'Assignment Reminders Current Score',
        'Assignment Reminders Unposted Current Score',
        'Assignment Reminders Final Score',
        'Assignment Reminders Unposted Final Score',
        'Imported Assignments Current Score',
        'Imported Assignments Unposted Current Score',
        'Imported Assignments Final Score',
        'Imported Assignments Unposted Final Score',

        'Migrated Quizzes Unposted Current Score',
        'Migrated Quizzes Final Score',
        'Migrated Quizzes Unposted Final Score',
        'Current Grade',
        'Unposted Current Grade',
        'Final Grade',
        'Unposted Final Grade',
]

blacklisted_rows = [
    0
]

df = replace_nan_with_zero(df)

for qual in qualifiers:
    indices = df[qual].index
    df.drop(indices, inplace=True)

df.drop(columns=blacklisted_columns, axis='columns', inplace=True)
df.drop(blacklisted_rows, axis='index', inplace=True)

df.to_csv('cleaned.csv')
# tabloo.show(df)

# EDA: Summary Statistics
print("Summary statistics: ", df.describe())

# Save Correlation Matrix Heatmap to file
plt.figure(figsize=(60, 60))
sns.heatmap(df.corr(), annot=True, fmt=".2f", cmap='coolwarm')
plt.title('Correlation Matrix')
plt.savefig('correlation_matrix.png')  # Saves the plot as a PNG file
plt.close()  # Close the plot to free up memory

# Convert object types to floating point
for col in df.columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')

df.dropna(inplace=True)


X = df.drop('Final Score', axis='columns') # Features
y = df['Final Score'] # Target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)

print("MSE: ", mse)
