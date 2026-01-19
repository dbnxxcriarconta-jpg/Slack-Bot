const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fila")
    .setDescription("Ver fila atual"),

  async execute(interaction, data) {
    if (!data.fila.length)
      return interaction.reply("Fila vazia.");

    const embed = new EmbedBuilder()
      .setTitle("📌 FILA ATUAL")
      .setColor("Blue")
      .setDescription(
        data.fila
          .map((u, i) => `**${i + 1}️⃣ <@${u.id}> — R$ ${u.valor}**`)
          .join("\n")
      );

    interaction.reply({ embeds: [embed] });
  }
};
