const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const MODES = {
    overall: "Overall",
    eight_one: "Solo",
    eight_two: "Doubles",
    four_three: "Threes",
    four_four: "Fours",
    two_four: "4v4",
    castle: "Castle",
    rush: "Rush",
    lucky: "Lucky",
    swap: "Swappage",
    ultimate: "Ultimate",
    voidless: "Voidless",
    underworld: "Underworld",
    totallynormal: "Totally Normal"
};

function buildMenu(selected = "overall", id = "mode_select_statsbot") {

    return new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(id)
            .setPlaceholder("Select Mode")
            .addOptions(
                Object.entries(MODES).map(([key, label]) => ({
                    label,
                    value: key,
                    default: key === selected
                }))
            )
    );
}

module.exports = {
    buildMenu,
    MODES,
};