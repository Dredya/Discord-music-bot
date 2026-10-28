const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffle the queue'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue || queue.tracks.size === 0) {
      return interaction.reply({ content: 'Queue is empty.', ephemeral: true });
    }
    queue.tracks.shuffle();
    return interaction.reply('🔀 Queue shuffled.');
  },
};
