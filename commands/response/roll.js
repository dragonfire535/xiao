const commando = require('discord.js-commando');

class RollChooseCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'roll', 
            group: 'response',
            memberName: 'roll',
            description: 'Rolls a Dice of your choice. (;roll 6)',
            examples: [';roll 6']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        if(message.content.match(/\d/)) {
            let [value] = message.content.split(" ").slice(1);
            let roll = Math.floor(Math.random() * value) + 1;
            message.reply("You rolled a " + roll);
        } else {
            message.reply(":x: This message contains no number!");
        }
    }
}

module.exports = RollChooseCommand;