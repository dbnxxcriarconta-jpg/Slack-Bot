const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Ranking geral"),

  async execute(interaction, data) {
    const rank = Object.entries(data.users)
      .sort((a, b) => b[1].wins - a[1].wins)
      .slice(0, 5)
      .map((u, i) => `**${i + 1}. <@${u[0]}> — ${u[1].wins} wins**`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle("🏅 RANKING")
      .setColor("Gold")
      .setDescription(rank || "Sem dados");

    interaction.reply({ embeds: [embed] });
  }
};
