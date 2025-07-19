require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
    REST,
    Routes
} = require('discord.js');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST().setToken(process.env.TOKEN);

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const IT_FEST = process.env.IT_FEST;

(async () => {
    try {
        console.log('🔄 Men-deploy command...');
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID, IT_FEST), {
                // Routes.applicationGuildCommands(CLIENT_ID), {
                body: commands
            }
        );
        console.log('✅ Semua command berhasil didaftarkan.');
    } catch (error) {
        console.error('❌ Error saat deploy:', error);
    }
})();