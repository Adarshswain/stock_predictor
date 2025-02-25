from flask import Flask, jsonify, request, render_template
import pandas as pd

app = Flask(__name__)
df = pd.read_csv("dump.csv")

# Route to serve the webpage
@app.route('/')
def index():
    companies = df['index_name'].unique().tolist()
    return render_template('index.html', companies=companies)

# API endpoint to get company data
@app.route('/api/company/<company_name>', methods=['GET'])
def get_company_data(company_name):
    company_data = df[df['index_name'] == company_name]
    if company_data.empty:
        return jsonify({"error": "Company not found"}), 404

    selected_columns = [
        "open_index_value", "high_index_value", "low_index_value", 
        "closing_index_value", "points_change", "change_percent", 
        "volume", "turnover_rs_cr"
    ]

    # Log fetched data for debugging
    print(f"Data for {company_name}:\n{company_data[selected_columns].head()}")

    # Calculate average for chart
    average_data = company_data[selected_columns].mean().to_dict()

    # Prepare full data for table
    table_data = company_data[selected_columns].to_dict(orient='records')

    return jsonify({"chartData": average_data, "tableData": table_data})

if __name__ == '__main__':
    app.run(debug=True)