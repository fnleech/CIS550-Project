import csv
rows = []
with open('latlongdata/StateStateCode.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for line in spamreader:
        print line
 
