const {
    SlashCommandBuilder, EmbedBuilder, InteractionContextType
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const linkPath = path.join(__dirname, "../data/link.json");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("unlink")
        .setDescription("Unlink your Minecraft account")
        .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild),

    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true });

        const linkDB = JSON.parse(fs.readFileSync(linkPath, "utf8"));

        if (!linkDB[interaction.user.id]) {
            return interaction.editReply("You are not linked.");
        }

        delete linkDB[interaction.user.id];

        fs.writeFileSync(linkPath, JSON.stringify(linkDB, null, 2));

        const embed = new EmbedBuilder().setDescription("Successfully unverified your account!");

        await interaction.editReply({
            embeds: [embed]
        });

    }

};