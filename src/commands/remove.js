const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a track from the queue by position')
    .addIntegerOption((opt) =>
      opt.setName('position').setDescription('Position in queue (1-based)').setRequired(true).setMinValue(1)
    ),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue || queue.tracks.size === 0) {
      return interaction.reply({ content: 'Queue is empty.', ephemeral: true });
    }
    const pos = interaction.options.getInteger('position', true);
    if (pos > queue.tracks.size) {
      return interaction.reply({ content: `Position out of range (queue has ${queue.tracks.size} tracks).`, ephemeral: true });
    }
    const track = queue.tracks.at(pos - 1);
    queue.tracks.removeOne((_, i) => i === pos - 1);
    return interaction.reply(`🗑️ Removed: **${track?.title || 'track'}**.`);
  },
};
