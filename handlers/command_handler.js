const fs = require('fs');

module.exports = (client, Discord) => {
    const commandFolders = fs.readdirSync("./commands");

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
    }
    // const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

    // for(const file of command_files){
    //     const command = require(`../commands/${file}`);
    //     if(command.name){
    //         client.commands.set(command.name, command);
    //     } else {
    //         continue;
    //     }
    // }
}