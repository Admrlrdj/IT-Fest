require('dotenv').config();
const {
    Client,
    Collection,
    GatewayIntentBits,
    Events
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] Command di ${filePath} tidak punya "data" atau "execute".`);
    }
}

client.once(Events.ClientReady, c => {
    console.log(`✅ Bot login sebagai ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`❌ Command ${interaction.commandName} tidak ditemukan.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`⚠️ Gagal menjalankan command ${interaction.commandName}:`, error);
        await interaction.reply({
            content: '❌ Terjadi kesalahan saat menjalankan perintah ini.',
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);