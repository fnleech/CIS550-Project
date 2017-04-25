#oracle connection separate package we need to install
import cx_Oracle

#with python, use CSV reader 
import csv
rows = []
with open('C:\Studying Folder\CIS 550\pj\CIS550-Project\OlympicData\FinalData\Country_v3.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for line in spamreader:
        if (line[2] == "NA" and line[3] == "NA"):
            row = (line[0], line[1], line[4], -1, -1, line[5], line[6])
        elif (line[2] == "NA"):
            row = (line[0], line[1], line[4], -1, float(line[3]), line[5], line[6])
        elif (line[3] == "NA"):
            row = (line[0], line[1], line[4], float(line[2]),-1, line[5], line[6])
        else:
            row = (line[0], line[1], line[4], float(line[2]), float(line[3]), line[5], line[6])
        rows.append(row)

# insert all of the rows as a batch and commit

host = 'cis550project.cgajnbzkqq1i.us-west-2.rds.amazonaws.com' 
port = 1521
SID = 'PENNDB'
database_table_name = 'Country'
dsn = cx_Oracle.makedsn(host, port, SID)
connection = cx_Oracle.connect('cis550project', 'cis550projectkeyPENN', dsn)
cursor = cx_Oracle.Cursor(connection)
cursor.prepare('insert into ' + database_table_name + ' (CID, Name, Continent, Population, GDP, PM10, PM25) values (:1, :2, :3, :4, :5, :6, :7)')
cursor.executemany(None, rows)
connection.commit()
cursor.close()
connection.close()