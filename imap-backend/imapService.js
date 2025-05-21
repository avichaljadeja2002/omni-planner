require('dotenv').config();

const imaps = require('imap-simple');
const {
    simpleParser
} = require('mailparser');
const ical = require('ical');

const config = {
    imap: {
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASSWORD,
        host: process.env.IMAP_HOST,
        port: Number(process.env.IMAP_PORT),
        tls: true,
        tlsOptions: {
            rejectUnauthorized: false
        },
        authTimeout: 5000
    }
};

async function fetchCalendarEvents() {
  try {
    console.log("📥 Fetching emails...");

    const connection = await imaps.connect({ imap: config.imap });

    await connection.openBox('INBOX');

    const searchCriteria = [['SINCE', new Date(2024, 0, 1)]];
    const fetchOptions = {
      bodies: [''],
      markSeen: false
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    const parsedEvents = [];

    for (let message of messages) {
      const part = message.parts.find(part => part.which === '');
      if (!part || !part.body) {
        console.warn('⚠️ Skipping message with no usable body');
        continue;
      }

      const parsed = await simpleParser(part.body);

      const calendarPart = parsed.attachments.find(att =>
        att.contentType === 'text/calendar'
      );

      if (calendarPart) {
        const calendarContent = calendarPart.content.toString('utf-8');

        // Parse .ics calendar content
        const parsedICS = ical.parseICS(calendarContent);

        for (const key in parsedICS) {
          const event = parsedICS[key];
          if (event.type === 'VEVENT') {
            parsedEvents.push({
              summary: event.summary,
              start: event.start,
              end: event.end
            });
          }
        }
      }
    }

    return parsedEvents;

  } catch (error) {
    console.error("❌ Error in fetchEmails:", error);
    return []; // fail safely
  }
}

module.exports = {
  fetchCalendarEvents
};