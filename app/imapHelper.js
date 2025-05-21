function getEventUsingIMAP(user, password) {
  console.log(`user: ${user}`);
  console.log(`password: ${password}`);
}

export default getEventUsingIMAP;

// const Imap = require('imap');
// const { simpleParser } = require('mailparser');
// const ical = require('ical.js');

// function getEventUsingIMAP(user, password) {
//     // Create IMAP connection
//     const imap = new Imap({
//         user,
//         password,
//         host: 'imap.gmail.com',
//         port: 993,
//         tls: true,
//     });
    
//     // Utility function to open a mailbox
//     function openInbox(cb) {
//         imap.openBox('INBOX', false, cb);
//     }
    
//     // Start IMAP connection
//     imap.once('ready', function () {
//         openInbox(function (err, box) {
//             if (err) throw err;
            
//             // Search for emails from specific sender
//             imap.search([['FROM', 'norflewe@rose-hulman.edu']], function (err, results) {
//                 if (err) throw err;
//                 if (!results || results.length === 0) {
//                     console.log('No emails found.');
//                     imap.end();
//                     return;
//                 }
                
//                 // Fetch emails
//                 const f = imap.fetch(results, { bodies: '' });
                
//                 f.on('message', function (msg, seqno) {
//                     msg.on('body', function (stream) {
//                         simpleParser(stream, async (err, parsed) => {
//                             if (err) {
//                                 console.error('Parse error:', err);
//                                 return;
//                             }
                            
//                             // Check attachments
//                             if (parsed.attachments.length > 0) {
//                                 for (const attachment of parsed.attachments) {
//                                     if (attachment.contentType === 'text/calendar') {
//                                         const jcalData = ical.parse(attachment.content.toString());
//                                         const vcalendar = new ical.Component(jcalData);
//                                         const events = vcalendar.getAllSubcomponents('vevent');
                                        
//                                         events.forEach(event => {
//                                             const summary = event.getFirstPropertyValue('summary');
//                                             const dtstart = event.getFirstPropertyValue('dtstart');
//                                             const dtend = event.getFirstPropertyValue('dtend');
                                            
//                                             console.log('_________________________________________');
//                                             console.log('Event Name:', summary);
//                                             console.log('Start Date:', new Date(dtstart).toLocaleString());
//                                             console.log('End Date:', new Date(dtend).toLocaleString());
//                                         });
//                                     }
//                                 }
//                             }
//                         });
//                     });
//                 });
                
//                 f.once('end', function () {
//                     console.log('Done fetching all messages!');
//                     imap.end();
//                 });
//             });
//         });
//     });
    
//     // Handle errors
//     imap.once('error', function (err) {
//         console.log(err);
//     });
    
//     // Close connection
//     imap.once('end', function () {
//         console.log('Connection ended');
//     });
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//     imap.connect();
// }

// export default getEventUsingIMAP;