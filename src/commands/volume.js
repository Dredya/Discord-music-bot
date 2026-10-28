const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set playback volume (0-100)')
    .addIntegerOption((opt) =>
      opt.setName('level').setDescription('Volume level (0-100)').setRequired(true).setMinValue(0).setMaxValue(100)
    ),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    }
    const level = interaction.options.getInteger('level', true);
    queue.node.setVolume(level);
    return interaction.reply(`🔊 Volume set to ${level}%.`);
  },
};
