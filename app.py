import json
import os
from flask import Flask, render_template, jsonify
import pandas as pd

# Import our psycopg2 library, which lets us connect our Flask app to our Postgres database.
import sqlalchemy
from sqlalchemy import inspect

db_uri = os.environ.get('DATABASE_URL').replace('postgres://', 'postgresql://')


# Create an instance of our Flask app.
app = Flask(__name__)

# Pass connection url to the sqlalchemy create_engine method
engine = sqlalchemy.create_engine(db_uri)
inspector = inspect(engine)
tables = inspector.get_table_names()

# Set route
@app.route('/')
def index():
    return render_template('index.html')

# Filters
@app.route('/filters')
def filters():
    # Get unique values
    def unique_val(col_name):
        df = pd.DataFrame()
        for table in tables:
            data = pd.read_sql_query(f"SELECT DISTINCT {col_name} FROM {table}", con = engine)
            df = pd.concat([df, data], ignore_index = True)
        res = df.sort_values(by = df.columns[0], ascending = False)[df.columns[0]].unique()
        return res

    carData = {'car_year': unique_val('car_year').tolist(),
                'make':unique_val('make').tolist(),
                'model':unique_val('model').tolist(),
                'subseries':unique_val('subseries').tolist(),
                'color':unique_val('color').tolist(),
                'condition_grade':unique_val('condition_grade').tolist(),
                'mileage':unique_val('mileage').tolist()}
    return jsonify(carData)

# allData
@app.route('/allData')
def allData():
    # Store data locally
    car_year = []
    make = []
    model = []
    subseries = []
    color = []
    condition_grade = []
    mileage = []

    for table in tables:
        data = engine.execute(f"SELECT car_year, make, model, subseries, color, condition_grade, mileage FROM {table}").fetchall()
        
        for row in data:
            car_year.append(row[0])
            make.append(row[1])
            model.append(row[2])
            subseries.append(row[3])
            color.append(row[4])
            condition_grade.append(row[5])
            mileage.append(row[6])

    cars_dict = {'car_year':car_year,
                'make':make,
                'model':model,
                'subseries':subseries,
                'color':color,
                'condition_grade':condition_grade,
                'mileage':mileage}
    return cars_dict


if __name__ == "__main__":
    app.run(debug=True)