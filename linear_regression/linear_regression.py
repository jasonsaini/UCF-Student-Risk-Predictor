import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

import tabloo

class DataSanitizer:
    # Paths to your CSV files
    fall22 = '22_Fall.csv'
    spring22 = '22_Spring.csv'
    summer22 = '22_Summer.csv'
    csv_files = [fall22, spring22, summer22]

    # csv_files = [fall22, spring22, summer22]
    # These columns have letter grades and are non-numeric
    excluded_cols=['Root Account', 'Section',
            'Current Grade', 'Unposted Current Grade',
            'Final Grade', 'Unposted Final Grade']

    # rows_to_skip = [1, 2, 126]
    # convert to 0-index
    # rows_to_skip = [0, 1, 126]
    # remove last index
    skip_rows = [0, 1]
    column_filter = lambda column: column not in DataSanitizer.excluded_cols

    # Find the common columns between all csvs
    def get_common_columns():
        # Grab all columns in csv list
        common_cols = pd.read_csv(DataSanitizer.csv_files[0], skiprows=DataSanitizer.skip_rows, usecols=DataSanitizer.column_filter).columns
        for path in DataSanitizer.csv_files[1:]:
            print("Reading file ", path)
            cur = pd.read_csv(path, skiprows=DataSanitizer.skip_rows, usecols=DataSanitizer.column_filter).columns
            common_cols = np.intersect1d(common_cols, cur)
        print("Returning from get common cols with cols: ", common_cols)
        return common_cols

    def clean_data(filename, data, exclude_rows=None, exclude_cols=None, removeLastRow=True):
        if exclude_rows is not None:
            data = data.drop(data.index[exclude_rows])
        if exclude_cols is not None:
            data = data.drop(exclude_cols, axis='columns')
        if removeLastRow:
            data = data.drop(data.index[-1])
        return data.dropna(axis='columns')

    # Grab cleaned and sanitized data from the csv files
    """

    def get_data():
        dataframes = []
        # Make dataframe with all relevant info
        for file in DataSanitizer.csv_files:
            frame = DataSanitizer.clean_data(file, pd.read_csv(file, header=None), exclude_rows=DataSanitizer.skip_rows, exclude_cols=DataSanitizer.excluded_cols, removeLastRow=True)
            print("Frame: '", frame, "'")
            dataframes.append(frame)
        # Merge all frames into one set
        train_data = pd.concat(dataframes, ignore_index=True)
        # Remove test student
        train_data = train_data[~train_data['Student'].str.startswith('Student, Test', na=False)]
        # Cast strings to int
        for col in train_data.columns:
            train_data[col] = pd.to_numeric(train_data[col], errors='coerce')
        # Remove string values that might have passed by undetected
        train_data = train_data.select_dtypes(exclude=['string'])
        # Fill the rest with the mean (TODO this should be tested for accuracy)
        train_data.fillna(train_data.mean(), inplace=True)
        return train_data
    """
    def get_data():
        dataframes = []
        # Make dataframe with all relevant info
        for file in DataSanitizer.csv_files:
            frame = pd.read_csv(file, header=None)
            # Get the column names from the first row of the CSV file
            column_names = frame.iloc[0]
            # Update the excluded_cols list with the column names that are actually present
            excluded_cols = [col for col in DataSanitizer.excluded_cols if col in column_names]
            frame = DataSanitizer.clean_data(file, frame, exclude_rows=DataSanitizer.skip_rows, exclude_cols=excluded_cols, removeLastRow=True)
            print("Frame: '", frame, "'")
            dataframes.append(frame)
        # Merge all frames into one set
        train_data = pd.concat(dataframes, ignore_index=True)
        # Remove test student if it exists
        if 'Student' in train_data:
            train_data = train_data[~train_data['Student'].str.startswith('Student, Test', na=False)]
        # Cast strings to int
        for col in train_data.columns:
            train_data[col] = pd.to_numeric(train_data[col], errors='coerce')
        # Remove string values that might have passed by undetected
        train_data = train_data.select_dtypes(exclude=['string'])
        # Fill the rest with the mean (TODO this should be tested for accuracy)
        train_data.fillna(train_data.mean(), inplace=True)
        return train_data

class Debug:
    def print(np_matrix, name, printToConsole=False):
        print(name, ": ")
        if printToConsole:
            for col in np_matrix:
                print("`", col, "`")
        np.savetxt(name, np_matrix, fmt='%s')

"""
data_frames = [pd.read_csv(file) for file in csv_files]
# Find common columns across all datasets
common_cols = set.intersection(*[set(df.columns) for df in data_frames])
common_cols = list(common_cols)
"""

common_cols = DataSanitizer.get_common_columns()
if 'Final Score' not in common_cols:
    print("--------------- Did not find final score in file ---------------")

# common_cols =  get_common_columns(csv_files, skip_rows=rows_to_skip, usecols=column_filter)

Debug.print(common_cols, "Common cols", printToConsole=True)

"""
print("Common cols:")
for col in common_cols:
    print("'", col, "'")
np.savetxt('common_cols.txt', common_cols, fmt='%s')
"""

# Load and concatenate the datasets
# dataframes = [pd.read_csv(file, skiprows=rows_to_skip, usecols=common_cols) for file in csv_files]
# tabloo.show(train_data)

train_data = DataSanitizer.get_data()

# Remove NaN values
# train_data = train_data.dropna(axis=1)
if 'Final Score' not in train_data.columns:
    print("------------ Did not find final score in training data after dropping na! --------------")
else:
    print("------------ Found final score in training data after dropping na --------------")

# Preprocess data (handle missing values, encode categorical variables, etc.)
# This step depends on the structure of your data

np.savetxt('train_data.txt', train_data, fmt='%s')

print("Columns before dropping: ", train_data.columns)

try:
    X = train_data.drop(-1, axis='columns')
    y = train_data[-1]
except KeyError:
    print("Final Score column not listed in data. Available columns are: ")
    for col in train_data.columns:
        print(col)
    print("----END----")

model = LinearRegression()

# Split your data into training and validation sets to evaluate performance
X_train, X_val, y_train, y_val = train_test_split(X, y)

# Fit the model
model.fit(X_train, y_train)

# Predict on validation set
# predictions = model.predict(X_val)

# Evaluate the model
# print("Mean Squared Error:", mean_squared_error(y_val, predictions))
# print("Coefficient of Determination (R^2):", r2_score(y_val, predictions))

test_csv = pd.read_csv(DataSanitizer.summer22, header=None, skiprows=[],
        usecols=DataSanitizer.get_common_columns())

tabloo.show(test_csv)

test_data = DataSanitizer.clean_data(DataSanitizer.summer22, test_csv, exclude_rows=DataSanitizer.skip_rows, exclude_cols=DataSanitizer.excluded_cols)
print("Column in test data?", 'Assignment Reminders Current Score' in test_data)

try:
    X_test = test_data.drop(test_data.columns[-1], axis='columns')
    y_test = test_data[test_data.columns[-1]]
except KeyError as e:
    print("Final Score column not listed in data. Available columns are: ")
    print(f"An error occurred: {e}")
    traceback.print_exc()
    for col in test_data.columns:
        print(col)

test_predictions = model.predict(X_test)
print("Test Mean Squared Error:", mean_squared_error(y_test, test_predictions))
print("Test Coefficient of Determination (R^2):", r2_score(y_test, test_predictions))

# Initialize the Random Forest Regressor instead of LinearRegression
model = RandomForestRegressor(n_estimators=100, random_state=42)

# Split your data into training and validation sets to evaluate performance
X_train, X_val, y_train, y_val = train_test_split(X, y, random_state=42)

# Fit the model on the training data
model.fit(X_train, y_train)

# Predict on the validation set (uncomment to evaluate)
predictions = model.predict(X_val)

# Evaluate the model on the validation set
print("Validation Mean Squared Error:", mean_squared_error(y_val, predictions))
print("Validation Coefficient of Determination (R^2):", r2_score(y_val, predictions))

# Preparation of test_data remains unchanged
# Ensure test_data is preprocessed in the same way as the training data
test_data = pd.read_csv(summer22, skiprows=rows_to_skip, usecols=common_cols)
print("Column in test data?", 'Assignment Reminders Current Score' in test_data)

# Preparing test features and target variable
X_test = test_data.drop('Final Score', axis=1)
y_test = test_data['Final Score']

# Predict on your test set
test_predictions = model.predict(X_test)

# Evaluate the model on the test set
print("Test Mean Squared Error:", mean_squared_error(y_test, test_predictions))
print("Test Coefficient of Determination (R^2):", r2_score(y_test, test_predictions))

# Plotting the results
plt.scatter(y_test, test_predictions)
plt.xlabel('Actual Grades')
plt.ylabel('Predicted Grades')
plt.title('Actual vs. Predicted Grades')
plt.show()

# Optionally, plot the results
plt.scatter(y_test, test_predictions)
plt.xlabel('Actual Grades')
plt.ylabel('Predicted Grades')
plt.title('Actual vs. Predicted Grades')
plt.show()

