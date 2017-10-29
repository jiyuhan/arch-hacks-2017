import pymysql.cursors
# 0x15F << 32 | yourNum

def mean(numbers):
    return float(sum(numbers)) / max(len(numbers), 1)

def timeQu(timeZero, interval):

    # connecting to thomas han database
    connection = pymysql.connect(host='phly.c7jx0v6pormd.us-east-1.rds.amazonaws.com',
                                 user='phly',
                                 password='phlyisthebest',
                                 db='phly',
                                 port=3306,
                                 cursorclass=pymysql.cursors.DictCursor)

    try:

        with connection.cursor() as cursor:
            fut = timeZero+interval
            cursor.execute("SELECT * FROM accel_data WHERE `time_stamp` < {} AND `time_stamp` > {}".format(fut,timeZero) )
            return cursor.fetchall()

    finally:
        connection.close()




def meanData(timeZero, interval):
    t = timeQu(timeZero, interval)
    print(len(t))
    ax =[]
    ay=[]
    az=[]
    gx=[]
    gy=[]
    gz=[]

    #For one minute
    for row in t:
        ax.append(float(row['ax']))
        ay.append(float(row['ay']))
        az.append(float(row['az']))
        gx.append(float(row['gx']))
        gy.append(float(row['gy']))
        gz.append(float(row['gz']))

    return [mean(ax), mean(ay), mean(az), mean(gx), mean(gy), mean(gz)] #One minute means
