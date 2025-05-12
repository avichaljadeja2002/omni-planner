# Importing libraries
import imaplib
import email

import yaml  #To load saved login credentials from a yaml file

import optparse

from icalendar import Calendar, Event

#from datetime import datetime

with open("credentials.yml") as f:
    content = f.read()
    
# from credentials.yml import user name and password
my_credentials = yaml.load(content, Loader=yaml.FullLoader)

#Load the user name and passwd from yaml file
user, password = my_credentials["user"], my_credentials["password"]

# Initialize a calendar to hold the merged data
merged_calendar = Calendar()
merged_calendar.add('prodid', '-//mailbox2ics//doughellmann.com//')
merged_calendar.add('calscale', 'GREGORIAN')

#URL for IMAP connection
imap_url = 'imap.gmail.com'

# Connection with GMAIL using SSL
my_mail = imaplib.IMAP4_SSL(imap_url)

# Log in using your credentials
my_mail.login(user, password)

# Select the Inbox to fetch messages
my_mail.select('Inbox')

#Define Key and Value for email search
#For other keys (criteria): https://gist.github.com/martinrusev/6121028#file-imap-search
key = 'FROM'
value = 'norflewe@rose-hulman.edu'
_, data = my_mail.search(None, key, value)  #Search for emails with specific key and value

mail_id_list = data[0].split()  #IDs of all emails that we want to fetch 

msgs = [] # empty list to capture all messages
#Iterate through messages and extract data into the msgs list
for num in mail_id_list:
    typ, data = my_mail.fetch(num, '(RFC822)') #RFC822 returns whole message (BODY fetches just body)
    msgs.append(data)

#Now we have all messages, but with a lot of details
#Let us extract the right text and print on the screen

#In a multipart e-mail, email.message.Message.get_payload() returns a 
# list with one item for each part. The easiest way is to walk the message 
# and get the payload on each part:
# https://stackoverflow.com/questions/1463074/how-can-i-get-an-email-messages-text-content-using-python

# NOTE that a Message object consists of headers and payloads.

for msg in msgs[::-1]:
    # Set up our options
    option_parser = optparse.OptionParser(
        usage='usage: %prog [options] hostname username mailbox [mailbox...]'
        )
    option_parser.add_option('-p', '--password', dest='password',
                             default='',
                             help='Password for username',
                             )
    option_parser.add_option('--port', dest='port',
                             help='Port for IMAP server',
                             type="int",
                             )
    option_parser.add_option('-v', '--verbose',
                             dest="verbose",
                             action="store_true",
                             default=True,
                             help='Show progress',
                             )
    option_parser.add_option('-q', '--quiet',
                             dest="verbose",
                             action="store_false",
                             help='Do not show progress',
                             )
    option_parser.add_option('-o', '--output', dest="output",
                             help="Output file",
                             default=None,
                             )

    (options, args) = option_parser.parse_args()
    # parse response
    for response_part in msg:
        if type(response_part) is tuple:
            my_msg=email.message_from_bytes((response_part[1]))
            for part in my_msg.walk():  
                #print(part.get_content_type())
                if part.get_content_type() == 'text/calendar':
                        # Parse the calendar attachment
                        ics_text = part.get_payload(decode=1)
                        importing = Calendar.from_ical(ics_text)                  # Add events from the calendar to our merge calendar
                        for event in importing.subcomponents:
                            if event.name != 'VEVENT':
                                continue
                            if options.verbose:
                                print("_________________________________________")
                                print('Event Name: %s' % event['SUMMARY'])
                                start = event['DTSTART'].dt
                                print('Start Date: %s' % start.strftime('%m/%d/%Y %I:%M %p'))
                                end = event['DTEND'].dt
                                print('End Date: %s' % end.strftime('%m/%d/%Y %I:%M %p'))
                            merged_calendar.add_component(event)
