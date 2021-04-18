module.exports = {
    name: "avatar",
    aliases: ['av', 'my-avatar', 'my-av'],
    permissions: ['SEND_MESSAGES', 'ADMINISTRATOR'],
    botPermissions: ['SEND_MESSAGES', 'ADMINISTRATOR'],
    cooldown: 5,
    status: "enabled",
    args: 1,
    usage: "avatar <user>",
    guildOnly: true,
    ownerOnly: false,
    execute (client, message, args, cmd, Discord) { //If you need "async", then: async execute (client, message, args, cmd, Discord)
        var user = message.mentions.users.first()
        if (!user) user = message.guild.members.cache.get(args[0]);
        var avatar = user.displayAvatarURL({ dynamic: true });
        message.channel.sebd(avatar);
    }
}