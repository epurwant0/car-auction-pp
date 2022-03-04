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
columns = ['car_year', 'make', 'model', 'subseries', 'color', 'condition_grade', 'mileage']
columns_clean = ['Car Year', 'Make', 'Model', 'Subseries', 'Color', 'Condition Grade', 'Mileage']

# Set route
@app.route('/')
def index():
    # Load Car Years
    cars_df = pd.DataFrame()
    for table in tables:
        data = pd.read_sql_query(f"SELECT car_year FROM {table}", con = engine)
        cars_df = pd.concat([cars_df, data], ignore_index = True)
    car_year_list = cars_df['car_year'].sort_values(ascending = False).unique().tolist()
    return render_template('index.html', car_year_list = car_year_list, columns = columns, columns_clean = columns_clean)

# Make
@app.route('/data/<car_year>/make')
def make(car_year):
    make_df = pd.DataFrame()
    for table in tables:
        data = pd.read_sql_query(f"SELECT car_year, make FROM {table} WHERE car_year = {car_year}", con = engine)
        make_df = pd.concat([make_df, data], ignore_index = True)
    make_list = make_df['make'].sort_values(ascending = True).unique().tolist()
    return jsonify(make_list)

# Model
@app.route('/data/<car_year>/<make>/model')
def model(car_year, make):
    model_df = pd.read_sql_query(f"SELECT car_year, make, model FROM {make} WHERE car_year = {car_year}", con = engine)
    model_list = model_df['model'].sort_values(ascending = True).unique().tolist()
    return jsonify(model_list)

# Subseries
@app.route('/data/<car_year>/<make>/<model>/subseries')
def subseries(car_year, make, model):
    subseries_df = pd.read_sql_query(f"SELECT car_year, make, model, subseries FROM {make} WHERE car_year = {car_year} AND model = '{model}'", con = engine) 
    subseries_list = subseries_df['subseries'].sort_values(ascending = True).unique().tolist()
    return jsonify(subseries_list)

# Other Info
@app.route('/data/<car_year>/<make>/<model>/<subseries>/info')
def info(car_year, make, model, subseries):
    info_df = pd.read_sql_query(f"SELECT car_year, make, model, subseries, color, condition_grade, mileage FROM {make} WHERE car_year = {car_year} AND model = '{model}' AND subseries = '{subseries}'", con = engine)  
    color_list = info_df['color'].sort_values(ascending = True).unique().tolist()
    condition_grade_list = info_df['condition_grade'].sort_values(ascending = True).unique().tolist()  
    mileage_list = info_df['mileage'].sort_values(ascending = True).unique().tolist()
    info_dict = {
        "color":color_list,
        "condition_grade":condition_grade_list,
        "mileage":mileage_list
    }
    return jsonify(info_dict)

# Other Info Changes
@app.route('/data/<car_year>/<make>/<model>/<subseries>/<category>/<value>')
def change(car_year, make, model, subseries, category, value):
    query = f"SELECT car_year, make, model, subseries, color, condition_grade, mileage FROM {make} WHERE car_year = {car_year} AND model = '{model}' AND subseries = '{subseries}' AND {category} = '{value}'"
    change_df = pd.read_sql_query(query, con = engine) 
    color_list = change_df['color'].sort_values(ascending = True).unique().tolist()
    condition_grade_list = change_df['condition_grade'].sort_values(ascending = True).unique().tolist()  
    mileage_list = change_df['mileage'].sort_values(ascending = True).unique().tolist()
    change_dict = {
        "color":color_list,
        "condition_grade":condition_grade_list,
        "mileage":mileage_list
    }
    return jsonify(change_dict)

if __name__ == "__main__":
    app.run(debug=True)