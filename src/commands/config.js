const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");
const {setKey} = require("../api/hypixel");

const premium = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../data/premium.json"),
        "utf8"
    )
);

module.exports = {

    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Admins only")
        .addStringOption(option =>
            option
                .setName("value")
                .setDescription("Value")
                .setRequired(true)
        ),

    async execute(interaction) {
        const admins = premium.admins || [];

        if (!admins.includes(interaction.user.id)) {
            return interaction.reply({
                content: "Admin only",
                ephemeral: true
            });
        }

        await interaction.deferReply({ephemeral: true});

        const envPath = path.join(__dirname, "../../.env");
        let env = fs.readFileSync(envPath, "utf8");
        const newKey = interaction.options.getString("value");
        env = env.replace(/^HYPIXEL_API=.*/m, `HYPIXEL_API=${newKey}`);

        fs.writeFileSync(envPath, env);

        setKey(newKey);

        const embed = new EmbedBuilder().setDescription(`Updated Hypixel API to \`\`\`${newKey}\`\`\``);

        await interaction.editReply({
            embeds: [embed]
        });

    }

};