require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeExtractor } = require('discord-player-youtubei');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();

// Player instance (shared). Commands access it via useMainPlayer() / useQueue().
const player = new Player(client);

// Load slash command modules
const commandsDir = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsDir).filter((f) => f.endsWith('.js'))) {
  const command = require(path.join(commandsDir, file));
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  }
}

client.once('ready', async () => {
  console.log(`[bot] Logged in as ${client.user.tag}`);

  // Register the YouTube extractor (discord-player-youtubei).
  try {
    await player.extractors.register(YoutubeExtractor, {});
    console.log('[bot] YouTube extractor registered');
  } catch (err) {
    console.error('[bot] Failed to register YouTube extractor:', err);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Restrict to the configured guild only.
  if (process.env.GUILD_ID && interaction.guildId !== process.env.GUILD_ID) {
    return interaction.reply({ content: 'This bot is private.', ephemeral: true });
  }

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, player);
  } catch (err) {
    console.error(err);
    const payload = { content: 'There was an error running that command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload).catch(() => {});
    } else {
      await interaction.reply(payload).catch(() => {});
    }
  }
});

// ---- Player events ----
player.events.on('playerStart', (queue, track) => {
  const channel = queue.metadata?.channel;
  if (channel) channel.send(`▶️ Now playing: **${track.title}** (${track.duration})`).catch(() => {});
});

player.events.on('audioTrackAdd', (queue, track) => {
  const channel = queue.metadata?.channel;
  // Don't announce the track that is currently playing (handled by playerStart).
  if (channel && queue.currentTrack !== track) {
    channel.send(`➕ Added to queue: **${track.title}**`).catch(() => {});
  }
});

player.events.on('disconnect', (queue) => {
  const channel = queue.metadata?.channel;
  if (channel) channel.send('👋 Disconnected from the voice channel.').catch(() => {});
});

player.events.on('emptyChannel', (queue) => {
  const channel = queue.metadata?.channel;
  if (channel) channel.send('🔇 Voice channel empty — leaving.').catch(() => {});
  queue.delete().catch(() => {});
});

player.events.on('emptyQueue', (queue) => {
  const channel = queue.metadata?.channel;
  if (channel) channel.send('⏹️ Queue finished.').catch(() => {});
});

player.events.on('playerError', (queue, error) => {
  const channel = queue.metadata?.channel;
  console.error('[player error]', error);
  if (channel) channel.send(`⚠️ Playback error: ${error.message || error}`).catch(() => {});
});

client.login(process.env.DISCORD_TOKEN);
