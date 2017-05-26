#Convert CSVfile to JSONfile

import csv
import json

# write a function that converts a fieldname column from a given csv file to a jsonfile
def convert_data(filename, jsonname):

	# open the csv file to read
	csvfile = open(filename, 'r')

	# open a json file to write
	jsonfile = open(jsonname, 'w')

	# use DictReader to read csvfile
	reader = csv.reader(csvfile, delimiter=';')
	next(reader)

	# create a database to load in the data from the csvfile
	database = []

	# store for each row the value from the column with the given fieldname in the database
	# if the column contains a value
	for row in reader:
		if row != None and row != '':
		    database.append(row)
	
	# write jsonfile
	jsonfile.write('[')

	for i,d in enumerate(database):
		jsonfile.write('{"state": ')
		# jsonfile.write('"')
	  	json.dump(d[0], jsonfile)
	  	# jsonfile.write('"')
	 	jsonfile.write(', ')
	 	jsonfile.write('"GSP": ')
	  	json.dump(d[1], jsonfile)
	  	jsonfile.write(', ')
	  	jsonfile.write('"FIPS": ')
	  	json.dump(d[2], jsonfile)
	  	jsonfile.write(', ')
	  	jsonfile.write('"percentagegsp": ')
	  	json.dump(d[4], jsonfile)
	  	jsonfile.write(', ')
	  	jsonfile.write('"percentagepop": ')
	  	json.dump(d[5], jsonfile)
 		if (i < len(database) - 1):
			jsonfile.write('},')
			jsonfile.write('\n')
		else:
			jsonfile.write('}')

	jsonfile.write(']')

if __name__ == '__main__':

	# introduce the variables used in function convert_data
	filename = 'GSPUS.csv'
	jsonname = 'GSPUS.json'

	# convert the files 
	jsonfile = convert_data(filename, jsonname)