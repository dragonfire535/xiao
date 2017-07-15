const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class AnimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'history',
            aliases: ['todayinhistory', 'inhistory'],
            group: 'search',
            memberName: 'history',
            description: 'Returns a random event that occurred at a certain date in history.',
            args: [
                {
                    key: 'month',
                    prompt: 'What is the month of the date you want to look up?',
                    type: 'integer',
                    validate: (text) => {
                        if (parseInt(text) => 1 && parseInt(text) <= 12) return true;
                        else return 'Please specify a valid month from 1 to 12.';
                    }
                },
                {
                    key: 'day',
                    prompt: 'What is the day of the date you want to look up?',
                    type: 'integer',
                    validate: (text) => {
                        if (parseInt(text) => 1 && parseInt(text) <= 31) return true;
                        else return 'Please specify a valid day from 1 to 31.';
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        const { month, day } = args;
        if(month === 2 && day > 29) return msg.say('Please specify a valid day from 1 to 29.');
        if([4, 6, 9, 11].includes(month) && day > 30) return msg.say('Please specify a valid day from 1 to 30.');
        try {
            const res = await snekfetch.get(`http://history.muffinlabs.com/date/${month}/${day}`);
            const data = JSON.parse(res.text);
            const events = data.data.Events;
            const event = events[Math.floor(Math.random() * events.length)];
            
            return msg.say(`**${data.date}, ${event.year}**\n${event.text}`);
        } catch (err) {
            return msg.say('An error occured when trying to fetch an event.');
            throw err;
        }
    }
};
