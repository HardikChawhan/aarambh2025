import csv
import os
import mysql.connector
from dotenv import load_dotenv
from pathlib import Path

def load_data_from_csv():
    # Load environment variables from .env file
    load_dotenv()
    
    # Get database configuration from environment variables
    db_config = {
        'host': os.getenv('DB_HOST'),
        'user': os.getenv('DB_USER'),
        'password': os.getenv('DB_PASSWORD'),
        'database': os.getenv('DB_NAME'),
    }
    
    print('Connecting to database...')
    
    # Create database connection
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        print('Database connection established successfully')
    except mysql.connector.Error as error:
        print(f'Failed to connect to the database: {error}')
        return
    
    # Path to CSV file
    csv_file_path = Path(__file__).parent / 'users.csv'
    print(f'Reading CSV file from: {csv_file_path}')
    
    try:
        # Read and parse the CSV file
        with open(csv_file_path, 'r') as file:
            csv_reader = csv.DictReader(file)
            records = list(csv_reader)
            
        print(f'CSV file parsed. Found {len(records)} records to import.')
        
        # Prepare the SQL query with placeholders
        query = '''
            INSERT INTO users 
            (email, username, prn, phone_no, Faculty, Department, Year, statusday1, statusday2, statusfood) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        
        # Process each row from the CSV
        for row in records:
            # Extract values ensuring they match the order in the query
            values = (
                row.get('email'),
                row.get('username'),
                row.get('prn'),
                row.get('phone_no'),
                row.get('Faculty'),
                row.get('Department'),
                row.get('Year'),
                row.get('statusday1', 0),  # Default to 0 if missing
                row.get('statusday2', 0),  # Default to 0 if missing
                row.get('statusfood', 0)   # Default to 0 if missing
            )
            
            # Execute the query
            cursor.execute(query, values)
        
        # Commit changes to the database
        connection.commit()
        print(f'Successfully imported {len(records)} records to the database')
    
    except Exception as error:
        print(f'Error importing data: {error}')
    
    finally:
        # Close the database connection
        if connection.is_connected():
            cursor.close()
            connection.close()
            print('Database connection closed')

if __name__ == "__main__":
    load_data_from_csv()