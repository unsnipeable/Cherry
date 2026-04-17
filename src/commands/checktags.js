const {
    SlashCommandBuilder, InteractionContextType, MessageFlags, EmbedBuilder
} = require("discord.js");
const {get} = require("axios");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("checktags")
        .setDescription("Show player's tags")
        .addStringOption(option =>
            option
                .setName("player")
                .setDescription("Minecraft username")
                .setRequired(false)
        )
        .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral});

        await interaction.editReply({
            embeds: [await embed(interaction.options.getString("player"))],
            flags: [MessageFlags.Ephemeral],
        });
    }

};

async function embed(name) {
    const url = `https://urchin.ws/player/${name}`;
    const { data } = await get(url);

    if (data.uuid === "") {
        return new EmbedBuilder()
            .setTitle(name)
            .setDescription(`No player named \`${name}\` was found.`);
    }

    const tag = data.tags?.[0];

    if (!tag) {
        return new EmbedBuilder()
            .setTitle(name)
            .setDescription(`\`${name}\` is not in the blacklist.`);
    }

    const unix = Math.floor(new Date(tag.added_on).getTime() / 1000);

    return new EmbedBuilder()
        .setTitle(name)
        .setDescription(
            `Type: ${tag.type}
            Reason: ${tag.reason}
            Added: <t:${unix}:F>`
        )
}