const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("apostar")
    .setDescription("Entrar na fila de apostas")
    .addIntegerOption(o =>
      o.setName("valor")
        .setDescription("Valor da aposta")
        .setRequired(true)
    ),

  async execute(interaction, data, save) {
    const valor = interaction.options.getInteger("valor");
    const id = interaction.user.id;

    if (!data.users[id]) data.users[id] = { saldo: 1000, wins: 0 };

    if (data.users[id].saldo < valor)
      return interaction.reply({ content: "❌ Saldo insuficiente", ephemeral: true });

    data.users[id].saldo -= valor;
    data.fila.push({ id, valor });

    save();

    const embed = new EmbedBuilder()
      .setTitle("📌 FILA ATUAL")
      .setColor("Blue")
      .setDescription(
        data.fila
          .map((u, i) => `**${i + 1}️⃣ <@${u.id}> — R$ ${u.valor}**`)
          .join("\n")
      );

    await interaction.reply({ embeds: [embed] });
  }
};
