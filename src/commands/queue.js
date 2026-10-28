const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('queue').setDescription('Show the current queue'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      return interaction.reply({ content: 'The queue is empty.', ephemeral: true });
    }

    const current = queue.currentTrack;
    const tracks = queue.tracks.toArray().slice(0, 10);
    let desc = `**Now:** ${current.title} (${current.duration})\n\n**Up next:**\n`;
    if (tracks.length === 0) {
      desc += 'Nothing queued.';
    } else {
      desc += tracks.map((t, i) => `${i + 1}. ${t.title} (${t.duration})`).join('\n');
      if (queue.tracks.size > 10) {
        desc += `\n...and ${queue.tracks.size - 10} more`;
      }
    }

    return interaction.reply(desc);
  },
};
