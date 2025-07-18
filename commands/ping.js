const {
    SlashCommandBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Cek respon jaringan bot'),

    async execute(interaction) {
        const sent = await interaction.reply({
            content: 'Pinging...',
            fetchReply: true
        });
        const ping = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`📶 ${ping}ms jaringan`);
    },
};