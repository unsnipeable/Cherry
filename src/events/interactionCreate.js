const fs = require("fs");
const path = require("path");

const { fetchStats } = require("../api/hypixel");

const {
    buildLBEmbed,
    buildEmbed
} = require("../utils/embed");

const {
    buildMenu,
    buildLBMenu, MODES
} = require("../utils/menus");

const {
    cooldown,
    COOLDOWN
} = require("../utils/cooldown");
const {
    cache,
    CACHE_TIME,
} = require("../utils/cache");
const {EmbedBuilder} = require("discord.js");

module.exports = (client) => {

    client.on("interactionCreate", async interaction => {

        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, {
                    fetchStats,
                    buildEmbed,
                    buildLBEmbed,
                    buildMenu,
                    buildLBMenu,
                    cache,
                    CACHE_TIME,
                    cooldown,
                    COOLDOWN,
                    fs,
                    path
                });
            } catch (err) {
                console.error(err);

                if (interaction.deferred || interaction.replied) {
                    await interaction.followUp({
                        content: "Error occurred",
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: "Error occurred",
                        ephemeral: true
                    });
                }
            }

            return;
        }

        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === "mode_select_statsbot") {

            const mode = interaction.values[0];

            const username =
                interaction.message.embeds[0].description
                    .split("\n")[0]
                    .split("'")[0]
                    .replace(/`/g, "")
                    .replace(/\[[^\]]*\]/g, "")
                    .replace(/##/g, "")
                    .replace(/ /g, "")
                    .trim();

            try {

                let cached = cache.get(username);

                if (!cached || Date.now() - cached.time > CACHE_TIME) {

                    const stats = await fetchStats(username);

                    if (!stats) {
                        return interaction.reply({
                            content: "Refetch failed",
                            ephemeral: true
                        });
                    }

                    cache.set(username, {
                        stats,
                        time: Date.now()
                    });

                    cached = cache.get(username);
                }

                const embed =
                    buildEmbed(username, mode, cached.stats, cache.get(username).time);

                await interaction.update({
                    embeds: [embed],
                    components: [buildMenu(mode)]
                });

            } catch (err) {
                console.error(err);

                if (interaction.deferred || interaction.replied) {
                    await interaction.followUp({
                        content: "Error",
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: "Error",
                        ephemeral: true
                    });
                }
            }
        } else
        if (interaction.customId === "play_select_statsbot") {

            const mode = interaction.values[0];

            try {
                const modes = ["rush", "lucky", "swap", "ultimate", "voidless", "underworld"];

                let description;

                if (mode === "four_four_totallynormal") {
                    description = `Commands for this mode no longer work.`;
                } else if (modes.includes(mode)) {
                    description =
                        `## ${MODES[mode]} Mode commands\n`+
                        `\`\`\`/play bedwars_eight_two_${mode}\`\`\`\n` +
                        `\`\`\`/play bedwars_four_four_${mode}\`\`\``;
                } else {
                    description =
                        `## ${MODES[mode]} Mode command\n`+
                        `\`\`\`/play bedwars_${mode}\`\`\``;
                }

                const embed = new EmbedBuilder()
                    .setDescription(description);

                await interaction.update({
                    embeds: [embed],
                    components: [buildMenu(mode, "play_select_statsbot")]
                });
            } catch (err) {
                console.error(err);

                if (interaction.deferred || interaction.replied) {
                    await interaction.followUp({
                        content: "Error",
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: "Error",
                        ephemeral: true
                    });
                }
            }
        }

    });

};