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


def timeZ(traceTime):

    print("time for trace is {}".format(traceTime))
    t = traceTime & 0xFFFFFFFF
    print("trace time truncated is {}".format(t))
    cursor = mysql.get_db().cursor()
    lowerBound = traceTime - 2000
    upperBound = traceTime + 2000
    cursor.execute("SELECT time_stamp FROM `accel_data` WHERE time_stamp < {} AND time_stamp > {}".format(upperBound, lowerBound))
    if cursor.fetchone() is not None:
        checkedTime = cursor.fetchone()[0]
        print("time queried from the trace is {}".format(checkedTime))
        return checkedTime
    return traceTime



@app.route('/OneSecAvr', methods=['POST'])
def oneSecData():
    t = int(time.time() * 1000)
    zero = timeZ(t)
    while t == zero:
        t = t - 4000
        zero = timeZ(t)
    zero = t
    print("The time for query is {}".format(zero))
    avgArr = shortQuery.meanData(zero,1000)
    data = []
    mag = mathUtl.magnitude(avgArr[0], avgArr[1], avgArr[2])
    gyro = mathUtl.magnitude(avgArr[3], avgArr[4], avgArr[5])
    concProb = mathUtl.concussion_probability(mag, gyro)

    x= zero
    while x != 0:
        avgArr = shortQuery.meanData(x, 1000)
        # print(x)
        data.append(mathUtl.magnitude(avgArr[0],avgArr[1],avgArr[2]))

        x = timeZ(x)

    return jsonify({'name': 'Paul Ruales', 'position':'QB','concussion_risk':concProb,
                   'data':data })




@app.route('/')
def returnData():
    t = int(time.time() * 1000)
    zero = timeZ(t)
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM `accel_data`")
    data = cursor.fetchall()
    #print(jsonify(data))
    out = [x for x in data ]
    return jsonify(out)



if __name__ == '__main__':
    app.run()
