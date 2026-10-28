const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Stop playback and disconnect'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue) {
      return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    }
    await queue.delete();
    return interaction.reply('⏹️ Stopped and disconnected.');
  },
};
