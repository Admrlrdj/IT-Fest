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

(async () => {
    try {
        console.log('🌐 Men-deploy global command...');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID), // global route
            {
                body: commands
            }
        );
        console.log('✅ Semua command berhasil didaftarkan secara global.');
    } catch (error) {
        console.error('❌ Error saat deploy global:', error);
    }
})();