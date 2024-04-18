import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

from model_22summer import blacklisted_columns as summer22_list
from model_22spring import blacklisted_columns as spring22_list
from model_22summer import blacklisted_columns as fall22_list
from model_23spring import blacklisted_columns as spring23_list

import tabloo

class Sanitizer:
    blacklisted_rows = [
        0
    ]

    def get_qualifiers(df):
        return [
            df['Student'] == 'Student, Test',
            df['Student'] == '    Points Possible' # TODO when standardizing we will probably want to use this value!
        ]

    def replace_nan_with_zero(df, cond=None):
        for col in df.columns:
            if 'EC' in col or 'FYI' in col:
                df[col] = df[col].fillna(0)
        return fd

    def get_data(file, blacklisted_columns):
        df = pd.read_csv(file)
        for qual in Sanitizer.get_qualifiers(df):
            indices = df[qual].index
            df.drop(indices, inplace=True)

        df.drop(columns=blacklisted_columns, axis='columns', inplace=True)
        df.drop(blacklisted_rows, axis='index', inplace=True)

        print(df.head())
        print(df.train())

        for col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

        df.dropna(inplace=True)
        df.to_csv('cleaned.csv')

        return df

class LinearRegression:
    def train_and_test(file, blacklisted):
        data = Sanitizer.get_data(file, blacklisted)
        X = df.drop('Final Score', axis='columns') # Features
        y = df['Final Score'] # Target

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

        model = LinearRegression()
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)

        print("MSE: ", mse)
