const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('nowplaying').setDescription('Show the current track'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    }
    const track = queue.currentTrack;
    let progress = '';
    try {
      progress = queue.node.createProgressBar() || '';
    } catch (e) {
      progress = '';
    }
    return interaction.reply(`🎶 Now playing: **${track.title}** (${track.duration})\n${progress}`);
  },
};
