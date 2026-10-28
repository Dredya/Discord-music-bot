const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('clear').setDescription('Clear the queue (keeps current track)'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue || queue.tracks.size === 0) {
      return interaction.reply({ content: 'Queue is already empty.', ephemeral: true });
    }
    if (typeof queue.tracks.clear === 'function') {
      queue.tracks.clear();
    } else {
      queue.tracks.splice(0, queue.tracks.size);
    }
    return interaction.reply('🧹 Queue cleared.');
  },
};
