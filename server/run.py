from flask import Flask, request, jsonify
from flask_mysql import MySQL
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# MySQL configuration
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'root123'
app.config['MYSQL_DATABASE_DB'] = 'sampleproject'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql = MySQL(app)

@app.route('/signup', methods=['POST'])
def signup():
    # Get the data from the request
    data = request.get_json()
    srn = data.get('srn')
    name = data.get('name')
    email = data.get('email')
    student_class = data.get('class')
    password = data.get('password')

    # Validate the input data
    if not (srn and name and email and student_class and password):
        return jsonify({'error': 'All fields are required!'}), 400

    # Hash the password before saving it
    hashed_password = generate_password_hash(password)

    try:
        # Create a cursor to execute SQL queries
        cursor = mysql.get_db().cursor()

        # Insert the user into the database
        insert_query = '''
        INSERT INTO credentials (srn, name, email, class, password)
        VALUES (%s, %s, %s, %s, %s)
        '''
        cursor.execute(insert_query, (srn, name, email, student_class, hashed_password))
        mysql.get_db().commit()

        print('User signed up successfully!')  # Log the success message
        return jsonify({'message': 'User signed up successfully!'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()

@app.route('/login', methods=['POST'])
def login():
    # Get the data from the request
    data = request.get_json()
    srn = data.get('srn')
    password = data.get('password')

    # Validate the input data
    if not (srn and password):
        return jsonify({'error': 'SRN and password are required!'}), 400

    try:
        # Create a cursor to execute SQL queries
        cursor = mysql.get_db().cursor()

        # Check if the user exists
        query = 'SELECT password FROM credentials WHERE srn = %s'
        cursor.execute(query, (srn,))
        result = cursor.fetchone()

        if result and check_password_hash(result[0], password):
            print('User logged in successfully!')  # Log the success message
            return jsonify({'message': 'Login successful!'}), 200
        else:
            return jsonify({'error': 'Invalid SRN or password!'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
