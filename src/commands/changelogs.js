const {
    SlashCommandBuilder, InteractionContextType, MessageFlags, ContainerBuilder
} = require("discord.js");
const {get} = require("axios");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("changelogs")
        .setDescription("Show changelogs of the latest update")
        .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral});

        const data = await fetchchangelogs(process.env.GIST, 3);

        const content = data.data.files[process.env.GIST_FILE].content;

        const blocks = content.split("\n\n");

        const changeLogsContainer = new ContainerBuilder()

        blocks.forEach((block, index) => {
            changeLogsContainer.addTextDisplayComponents(
                (textDisplay) => textDisplay.setContent(block)
            );

            if (index !== blocks.length - 1) {
                changeLogsContainer
                    .addSeparatorComponents((separator) => separator)
            }
        });

        await interaction.editReply({

            components: [changeLogsContainer],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        });
    }

};

async function fetchchangelogs(url, retries = 3) {
    try {
        const res = await get(url, {
            headers: {
                "User-Agent": "StatsBot"
            },
            timeout: 5000
        });
        return res;
    } catch (err) {
        if (retries > 0) {
            await new Promise(r => setTimeout(r, 1000));
            return fetchchangelogs(url, retries - 1);
        }
        throw err;
    }
}