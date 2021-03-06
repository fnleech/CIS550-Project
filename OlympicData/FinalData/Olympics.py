#oracle connection separate package we need to install
import cx_Oracle
import datetime

#with python, use CSV reader 
import csv
rows = []
with open('C:\Studying Folder\CIS 550\pj\CIS550-Project\OlympicData\FinalData\Olympics_v1.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for line in spamreader:
        row = (int(line[0]), line[2], line[3], float(line[1]))
        rows.append(row)

# insert all of the rows as a batch and commit

host = 'cis550project.cgajnbzkqq1i.us-west-2.rds.amazonaws.com' 
port = 1521
SID = 'PENNDB'
database_table_name = 'Olympics'
dsn = cx_Oracle.makedsn(host, port, SID)
connection = cx_Oracle.connect('cis550project', 'cis550projectkeyPENN', dsn)
cursor = cx_Oracle.Cursor(connection)
cursor.prepare('insert into ' + database_table_name + ' (Year, Opening_ceremony, Closing_ceremony, Cost) values (:1, :2, :3, :4)')
cursor.executemany(None, rows)
connection.commit()
cursor.close()
connection.close()