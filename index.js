const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const DATA_FILE = "./data.json";
let data = JSON.parse(fs.readFileSync(DATA_FILE));

function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

client.once(Events.ClientReady, async () => {
  const cmds = client.commands.map(c => c.data.toJSON());
  await client.application.commands.set(cmds);
  console.log("✅ Bot online e comandos registrados");
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    await cmd.execute(interaction, data, save);
  }
});

client.login(process.env.TOKEN);

