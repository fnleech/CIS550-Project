import cx_Oracle
import csv
rows = []
with open('FinalData/Cases.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for line in spamreader:
        row = (line[0], line[1])
        rows.append(row)


# insert all of the rows as a batch and commit
host = 'cis550project.cgajnbzkqq1i.us-west-2.rds.amazonaws.com' 
port = 1521
SID = 'PENNDB'
database_table_name = 'Cases'
dsn = cx_Oracle.makedsn(host, port, SID)
connection = cx_Oracle.connect('cis550project', 'cis550projectkeyPENN', dsn)
cursor = cx_Oracle.Cursor(connection)
cursor.prepare('insert into ' + database_table_name+ ' (StateCode,CaseNum, CaseDate, CaseType) values (:1, :2, :3, :4)')
cursor.executemany(None, rows)
connection.commit()
cursor.close()
connection.close()
