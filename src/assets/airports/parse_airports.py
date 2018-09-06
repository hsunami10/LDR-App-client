import sys
import json

# https://openflights.org/data.html

if len(sys.argv) != 2:
    print "Error: Please include one argument"
    exit(1)

try:
    file = open(sys.argv[1], "r")
except Exception as e:
    print "Error: File not found."
    raise

lines = [line.rstrip('\n') for line in file]
airport_dict = {}
for line in lines:
    parsed_line = line.split(',')
    airport_dict[parsed_line[0]] = {
        "name": parsed_line[1].strip("\""),
        "city": parsed_line[2].strip("\""),
        "country": parsed_line[3].strip("\""),
        "iata": parsed_line[4].strip("\""),
        "icao": parsed_line[5].strip("\""),
        "latitude": parsed_line[6].strip("\""),
        "longitude": parsed_line[7].strip("\""),
        "timezone": parsed_line[9].strip("\"")
    }

json_file = open("airports.txt", "w+")
airport_dict = json.dumps(airport_dict)
json_file.write(airport_dict)

json_file.close()
file.close()
