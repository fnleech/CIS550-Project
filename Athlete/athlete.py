#oracle connection separate package we need to install
import cx_Oracle
import datetime

#with python, use CSV reader 
import csv
rows = []
with open('athlete_v5.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for line in spamreader:
        if (line[4] == "n/a" and line[5] == "n/a"):
            row = (line[0], line[1], line[2], line[3], -1, -1)
        elif (line[4] == "n/a" ):
            row = (line[0], line[1], line[2], line[3], -1, float(line[5]))
        elif (line[5] == "n/a"):
            row = (line[0], line[1], line[2], line[3], float(line[4]), -1)
        else:
            row = (line[0], line[1], line[2], line[3], float(line[4]), float(line[5]))
        rows.append(row)

# insert all of the rows as a batch and commit

host = 'cis550project.cgajnbzkqq1i.us-west-2.rds.amazonaws.com' 
port = 1521
SID = 'PENNDB'
database_table_name = 'Athlete'
dsn = cx_Oracle.makedsn(host, port, SID)
connection = cx_Oracle.connect('cis550project', 'cis550projectkeyPENN', dsn)
cursor = cx_Oracle.Cursor(connection)
cursor.prepare('insert into ' + database_table_name + ' (AID, FullName, DOB, Gender, Height, Weight) values (:1, :2, :3, :4, :5, :6)')
cursor.executemany(None, rows)
connection.commit()
cursor.close()
connection.close()