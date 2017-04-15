#!/usr/bin/env python
# Name: Melissa Wijngaarden
# Student number:   10810412
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv
import sys


from pattern.web import URL, DOM, Element

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    element = Element(dom)

    # sort information per serie
    series = element.get_elements_by_classname('lister-item-content')

    # for every serie in series take out the right data
    serie_data = []

    for serie in series:

        # title is in class 'lister-item-header' at tag a
        # to give only the name, we encode its content such that other values than ascii
        # will be ignored
        title = serie.by_class('lister-item-header')[0].by_tag('a')[0].content.encode('ascii', 'ignore')
        
        # rating 
        rating = serie.by_class('ratings-imdb-rating')[0].by_tag('strong')[0].content.encode('ascii', 'ignore')
        genre = serie.by_class('genre')[0].content.strip().encode('ascii', 'ignore')
        actors_container = serie.by_tag('p')[2].by_tag('a')
        runtime = serie.by_class('runtime')[0].content.split(' ')[0].encode('ascii', 'ignore')
        # print actors_container + ','
        actors = ''
        
        for a in actors_container: # print filmtitels, waarom?
            actors += a.content + ','
        
        actors = actors[:-1].encode('ascii', 'ignore')

        serie_data.append([title, rating, genre, actors, runtime])
        print actors, genre
    #print serie_data
        #The tag name passed to Element.by_tag()
#can include a class ("div.message") or an id ("div#header")

    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.


    return serie_data # replace this line as well as appropriate


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK
    for serie in tvseries:
        writer.writerow(serie)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)