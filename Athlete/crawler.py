"""
Web crawlwer for CIS 550 Project
Athlete dataset
"""

import requests
from bs4 import BeautifulSoup
import csv
import sys  

reload(sys)  
sys.setdefaultencoding('utf8')

def string_processor(data):
    tokens = data.split(";")
    athlete_info = "" 
    lst = ['id', 'Full name', 'Gender', 'Height', 'Weight', 'Born', 'Country', 'Sport']
    idx = 0
    sport_idx = 0
    
    isHeight = False
    isWeight = False
    for token in tokens:
        if (tokens[idx].split(":")[0].strip(" ") in lst):
            if (tokens[idx].split(":")[0].strip(" ") == 'Born'):
                if (not isHeight):
                    athlete_info += "n/a;"
                if (not isWeight):
                    athlete_info += "n/a;"
                athlete_info += tokens[idx].split(":")[1].split("in")[0].strip(" ")
                athlete_info += ";"
            else:
                if (tokens[idx].split(":")[0].strip(" ") == 'Height'):
                    isHeight = True
                if (tokens[idx].split(":")[0].strip(" ") == 'Weight'):
                    isWeight = True
                if (tokens[idx].split(":")[0].strip(" ") == 'Sport'):
                    sport_idx = idx
                athlete_info += tokens[idx].split(":")[1].strip(" ")
                athlete_info += ";"
        idx += 1

    record_num = (len(tokens) - sport_idx - 2) / 10
    
    datalst = [] 
    check = False
    for i in range(record_num):
        medal_info = tokens[sport_idx + 1 + 10 * i : sport_idx + 1 + 10 * (i + 1)]
        full_row = athlete_info
        for j in range(len(medal_info)):
            if (medal_info[0].split(" ")[0] >= 1960 and medal_info[0].split(" ")[1] == "Summer"):
                check = True
            else:
                return
            full_row += medal_info[j]
            full_row += ";"
        datalst.append(full_row)
    if (check):
        write_to_csv(datalst)

def get_single_item_data(item_url):
    source_code = requests.get(item_url)
    plain_text = source_code.text
    soup = BeautifulSoup(plain_text, 'lxml')
    
    data = ""
    aid = soup.find('div', {'class':"x_small_text clear_both"})
    if (aid != None):
        data += aid.string
        data += ";"
        counter1 = 0
        for link in soup.findAll('p'): 
            if (counter1 == 2):
                read = link.get_text()
                data += read.replace("\n", ";")
            counter1 += 1
        for link in soup.findAll('div', {'id':"div_results"}):
            for row in link.findAll('td'): 
                data += str(row.string)
                data += ";"
        string_processor(data)


def spider():                                                                                                                                                                                                                                                                                          
    counter = 0
    for i in range(26):
        for j in range (26):
            idx = chr(ord('a') + i) + chr(ord('a') + j)
            url = 'http://www.sports-reference.com/olympics/athletes/' + idx
            source_code = requests.get(url)
            plain_text = source_code.text
            # extract data from html from soup
            soup = BeautifulSoup(plain_text, 'lxml')
            for link in soup.findAll('p', {'class': 'margin_top small_text'}):  
                for row in link.findAll('a'):
                    href = 'http://www.sports-reference.com' + row.get('href')
                    print href
                    counter += 1
                    get_single_item_data(href)
    print "number of athletes: " + str(counter)
        
        
def write_to_csv(datalst):
    with open('athlete.csv', 'a') as f:
        writer = csv.writer(f, lineterminator='\n')
        for data in datalst:
            writer.writerow([data.encode("utf-8")])  
      
spider()


        