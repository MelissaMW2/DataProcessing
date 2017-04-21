#!/usr/bin/env python
#
#Melissa Wijngaarden
#Dataprocessing, week3
#Convert CSVfile to JSONfile

import csv
import json
import numpy as np
from collections import Counter

# write a function that converts a fieldname column from a given csv file to a jsonfile
def convert_data(filename, jsonname, fieldname):

	# open the csv file to read
	csvfile = open(filename, 'r')

	# open a json file to write
	jsonfile = open(jsonname, 'w')

	# use DictReader to read csvfile
	reader = csv.DictReader(csvfile)

	# create a database to load in the data from the csvfile
	database = []

	# store for each row the value from the column with the given fieldname in the database
	# if the column contains a value
	for row in reader:
		if row[fieldname] != None and row[fieldname] != '':
		    database.append(row[fieldname])

	# take all the unique values from the database
	neighbourhoods = np.unique(database)

	# use a counter to count the values in database
	c = Counter(database)

	# start writing the JSONfile

	# we want a list of objects, so start and end with brackets
 	jsonfile.write('[')

 	# for each unique neighbourhood in the database 
	for i,n in enumerate(neighbourhoods):
		# write object to jsonfile with neighbourhood n
	 	jsonfile.write('{"neighbourhood": ')
	  	json.dump(n, jsonfile)
	 	jsonfile.write(',\t')

	 	# write to object in jsonfile how many times the neighbourhood is listed
	 	jsonfile.write('"listings": ')
	 	json.dump(c[n], jsonfile)

	 	# add a comma after each object except for the last
	 	if (i < len(neighbourhoods) - 1):
			jsonfile.write('},')
		else:
			jsonfile.write('}')
		jsonfile.write('\n')

	jsonfile.write(']')

if __name__ == '__main__':

	# introduce the variables used in function convert_data
	filename = 'dataAirbnb.csv'
	jsonname = 'dataAirbnb.json'
	fieldname = 'neighbourhood'

	# convert the files 
	jsonfile = convert_data(filename, jsonname, fieldname)

