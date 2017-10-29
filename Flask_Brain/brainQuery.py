import pymysql.cursors

def queryAccel():

    # connecting to thomas han database
    connection = pymysql.connect(host='phly.c7jx0v6pormd.us-east-1.rds.amazonaws.com',
                                 user='phly',
                                 password='phlyisthebest',
                                 db='phly',
                                 port=3306,
                                 cursorclass=pymysql.cursors.DictCursor)

    try:

        with connection.cursor() as cursor:
            # Read a single record
            cursor.execute("SELECT `time_stamp` FROM accel_data")
            timeZ = float(cursor.fetchone()['time_stamp'])
            print(timeZ)
            cursor.execute("SELECT * FROM accel_data")
            print(cursor.fetchall()[:500])
    finally:
        connection.close()

    return timeZ

if __name__ == '__main__':
    queryAccel()