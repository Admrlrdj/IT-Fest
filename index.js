require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const {
    Client,
    Collection,
    GatewayIntentBits
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.commands = new Collection();

// Ambil semua file command dari folder commands/
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`[WARNING] Command di ${filePath} tidak punya data atau execute`);
    }
}

client.once('ready', () => {
    console.log(`✅ Bot online sebagai ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: '❌ Terjadi error saat eksekusi command!',
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);