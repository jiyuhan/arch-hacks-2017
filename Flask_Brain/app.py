from flask import Flask
from flaskext.mysql import MySQL
from flask import jsonify
from flask_cors import CORS
import time
import shortQuery
import mathUtl

mysql = MySQL()
app = Flask(__name__)
CORS(app)
app.config['MYSQL_DATABASE_USER'] = 'phly'
app.config['MYSQL_DATABASE_PASSWORD'] = 'phlyisthebest'
app.config['MYSQL_DATABASE_DB'] = 'phly'
app.config['MYSQL_DATABASE_HOST'] = 'phly.c7jx0v6pormd.us-east-1.rds.amazonaws.com'
mysql.init_app(app)


def timeZ():
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT `time_stamp` FROM accel_data")
    return float(cursor.fetchone()[0])


@app.route('/OneSecAvr', methods=['POST'])
def oneSecData():
    zero = timeZ()
    print(zero)
    avgArr = shortQuery.meanData(zero,1000)
    data = []
    mag = mathUtl.magnitude(avgArr[0], avgArr[1], avgArr[2])
    gyro = mathUtl.magnitude(avgArr[3], avgArr[4], avgArr[5])
    concProb = mathUtl.concussion_probability(mag, gyro)

    x= zero
    while x < zero+10000:
        avgArr = shortQuery.meanData(x, 1000)
        print(x)
        data.append(mathUtl.magnitude(avgArr[0],avgArr[1],avgArr[2]))
        x+=500

    return jsonify({'name': 'Paul Ruales', 'position':'QB','concussion_risk':concProb,
                   'data':data })




@app.route('/')
def returnData():
    zero = timeZ()
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM accel_data")
    data = cursor.fetchall()
    out = [x for x in data ]
    return jsonify(out)



if __name__ == '__main__':
    app.run()
