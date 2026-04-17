const { EmbedBuilder } = require("discord.js");
const { MODES } = require("./menus");


function buildEmbed(username, modeKey, stats, now) {

    const s = stats[modeKey];

    const wlr = ratio(s.win, s.loss);
    const bblr = ratio(s.bedbroken, s.bedlost);
    const kdr = ratio(s.kills, s.deaths);
    const fkdr = ratio(s.finalKills, s.finalDeaths);
    const vkdr = ratio(s.vkills, s.vdeaths);
    const vfkdr = ratio(s.vfinalKills, s.vfinalDeaths);

    return new EmbedBuilder()
        .setColor(0x000000)
        .setThumbnail("https://skins.mcstats.com/face/" + stats.uuid)
        .setDescription(`## \`\`[${stats.star}✫] ${stats.rank}${stats.name}\`\`'s __**${MODES[modeKey]}**__ Stats`)
        .addFields(

            { name: "Wins", value: `${s.win}`, inline: true },
            { name: "Losses", value: `${s.loss}`, inline: true },
            { name: "<:win:1493524707830399026> | WLR", value: `${wlr}`, inline: true },

            { name: "Kills", value: `${s.kills}`, inline: true },
            { name: "Deaths", value: `${s.deaths}`, inline: true },
            { name: "<:kill:1493524702927257711> | KDR", value: `${kdr}`, inline: true },

            { name: "Final Kills", value: `${s.finalKills}`, inline: true },
            { name: "Final Deaths", value: `${s.finalDeaths}`, inline: true },
            { name: "<:final_kill:1493524704353325157> | FKDR", value: `${fkdr}`, inline: true },

            { name: "Bed Broken", value: `${s.bedbroken}`, inline: true },
            { name: "Bed Lost", value: `${s.bedlost}`, inline: true },
            { name: "<:bed:1493524705829978174> | BBLR", value: `${bblr}`, inline: true },

            { name: "<:void:1493524701480353854> Void Stats <:void:1493524701480353854>", value: `\u200B`, inline: false },

            { name: "Void Kills", value: `${s.vkills}`, inline: true },
            { name: "Void Deaths", value: `${s.vdeaths}`, inline: true },
            { name: "<:kill:1493524702927257711> | Void KDR <:void:1493524701480353854>", value: `${vkdr}`, inline: true },

            { name: "Void Final Kills", value: `${s.vfinalKills}`, inline: true },
            { name: "Void Final Deaths", value: `${s.vfinalDeaths}`, inline: true },
            { name: "<:final_kill:1493524704353325157> | Void FKDR <:void:1493524701480353854>", value: `${vfkdr}`, inline: true },

            { name: `Last Fetch: <t:${Math.floor( now/ 1000)}:R>`, value: `\u200B`, inline: false },
        )
        .setFooter({
            text:"made by mtnk | @unsnipeable"
        })
        .setTimestamp();
}

function ratio(a, b) {
    a = a ?? 0;
    b = b ?? 0;
    return b === 0 ? a : (a / b).toFixed(2);
}

module.exports = {
    buildEmbed
};