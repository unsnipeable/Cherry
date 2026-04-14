const {
    SlashCommandBuilder, EmbedBuilder, InteractionContextType
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const { fetchStats } = require("../api/hypixel");

const linkPath = path.join(__dirname, "../data/link.json");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("link")
        .setDescription("Link your Minecraft account")
        .addStringOption(option =>
            option
                .setName("player")
                .setDescription("Minecraft username")
                .setRequired(true)
        )
        .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild),

    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true });

        const username = interaction.options.getString("player");

        const stats = await fetchStats(username);

        if (!stats) {
            return interaction.editReply("Player not found.");
        }

        if (stats.discordId !== interaction.user.username) {
            return interaction.editReply(`Your Discord ID does not match the ID linked in Hypixel.\nYour Discord ID: \`${interaction.user.username}\`\nLinked in Hypixel: \`${stats.discordId}\``);
        }

        const linkDB = JSON.parse(fs.readFileSync(linkPath, "utf8"));

        linkDB[interaction.user.id] = {
            username
        };

        fs.writeFileSync(linkPath, JSON.stringify(linkDB, null, 2));

        const embed = new EmbedBuilder().setDescription(`You are now verified to **\`${stats.rank}${stats.name}\`**`);

        await interaction.editReply({
            embeds: [embed]
        });

    }

};