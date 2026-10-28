const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube (or add to queue)')
    .addStringOption((opt) =>
      opt.setName('query').setDescription('Song name or YouTube URL').setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.member?.voice?.channel;
    if (!channel) {
      return interaction.reply({ content: 'Join a voice channel first!', ephemeral: true });
    }

    const player = useMainPlayer();
    const query = interaction.options.getString('query', true);

    await interaction.deferReply();
    try {
      const { track } = await player.play(channel, query, {
        nodeOptions: { metadata: { channel: interaction.channel, requestedBy: interaction.user } },
      });
      return interaction.followUp(`➕ Enqueued: **${track.title}**`);
    } catch (err) {
      console.error(err);
      return interaction.followUp(`Something went wrong: ${err?.message || err}`);
    }
  },
};
