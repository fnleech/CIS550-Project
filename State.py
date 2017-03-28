#oracle connection separate package we need to install


#with python, use CSV reader 

import csv
	with open('StateStateCode.csv', 'rb') as csvfile:
		spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
			rows = []
			for i in range(spamreader):
				row = (StateCode[index], State[index])
        		rows.append(row)


# insert all of the rows as a batch and commit
ip = '192.1.2.3' 
port = 1521
SID = 'my_sid'
dsn = cx_Oracle.makedsn(ip, port, SID)
connection = cx_Oracle.connect('username', 'password', dsn)
cursor = cx_Oracle.Cursor(connection)
cursor.prepare('insert into ' + database_table_name + ' (id, record_date, temp, precip) values (:1, :2, :3, :4)')
cursor.executemany(None, rows)
connection.commit()
cursor.close()
connection.close()