#oracle connection separate package we need to install
import cx_Oracle

#with python, use CSV reader 
import csv
rows = []
with open('from1.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for line in spamreader:
        row = (line[0], line[1])
        rows.append(row)

# insert all of the rows as a batch and commit

host = 'cis550project.cgajnbzkqq1i.us-west-2.rds.amazonaws.com' 
port = 1521
SID = 'PENNDB'
database_table_name = 'AFromC'
dsn = cx_Oracle.makedsn(host, port, SID)
connection = cx_Oracle.connect('cis550project', 'cis550projectkeyPENN', dsn)
cursor = cx_Oracle.Cursor(connection)
cursor.prepare('insert into ' + database_table_name + ' (AID, CID) values (:1, :2)')
cursor.executemany(None, rows)
connection.commit()
cursor.close()
connection.close()