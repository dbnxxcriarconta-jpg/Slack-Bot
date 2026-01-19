const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("finalizar")
    .setDescription("Finalizar a fila (mediador)"),

  async execute(interaction, data, save) {
    if (!interaction.member.roles.cache.some(r => r.name === "Mediador"))
      return interaction.reply({ content: "❌ Apenas mediador", ephemeral: true });

    if (!data.fila.length)
      return interaction.reply("Fila vazia.");

    const players = data.fila.map(u => ({
      label: interaction.guild.members.cache.get(u.id)?.user.username || u.id,
      value: u.id
    }));

    const selectVencedor = new StringSelectMenuBuilder()
      .setCustomId("vencedor")
      .setPlaceholder("Escolha o vencedor")
      .addOptions(players);

    const selectTipo = new StringSelectMenuBuilder()
      .setCustomId("tipo")
      .setPlaceholder("Tipo de vitória")
      .addOptions([
        { label: "Vitória Normal", value: "normal" },
        { label: "WO", value: "wo" },
        { label: "Desistência", value: "desistencia" }
      ]);

    await interaction.reply({
      content: "🎛️ Selecione vencedor e tipo",
      components: [
        new ActionRowBuilder().addComponents(selectVencedor),
        new ActionRowBuilder().addComponents(selectTipo)
      ]
    });

    const collector = interaction.channel.createMessageComponentCollector({
      time: 60000
    });

    let winner, tipo;

    collector.on("collect", i => {
      if (i.customId === "vencedor") winner = i.values[0];
      if (i.customId === "tipo") tipo = i.values[0];
      i.deferUpdate();

      if (winner && tipo) {
        const ganho = data.fila.reduce((a, b) => a + b.valor, 0);
        data.users[winner].saldo += ganho;
        data.users[winner].wins++;

        data.fila = [];
        save();

        const embed = new EmbedBuilder()
          .setTitle("🏆 RESULTADO FINAL")
          .setColor("Green")
          .setDescription(
            `**Vencedor:** <@${winner}>\n**Forma:** ${tipo.toUpperCase()}\n**Ganho:** R$ ${ganho}`
          );

        interaction.editReply({ content: "", embeds: [embed], components: [] });
        collector.stop();
      }
    });
  }
};
