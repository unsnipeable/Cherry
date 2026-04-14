const { EmbedBuilder } = require("discord.js");
const { MODES } = require("./menus");


function buildEmbed(username, modeKey, stats) {

    const s = stats[modeKey];

    const wlr = s.loss === 0 ? s.win : (s.win / s.loss).toFixed(2);
    const bblr = s.bedlost === 0 ? s.bedbroken : (s.bedbroken / s.bedlost).toFixed(2);

    const kdr = s.deaths === 0 ? s.kills : (s.kills / s.deaths).toFixed(2);
    const fkdr = s.finalDeaths === 0 ? s.finalKills : (s.finalKills / s.finalDeaths).toFixed(2);

    const vkdr = s.vdeaths === 0 ? s.vkills : (s.vkills / s.vdeaths).toFixed(2);
    const vfkdr = s.vfinalDeaths === 0 ? s.vfinalKills : (s.vfinalKills / s.vfinalDeaths).toFixed(2);

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
            { name: "<:final_kill:1493524704353325157> | Void FKDR <:void:1493524701480353854>", value: `${vfkdr}`, inline: true }
        )
        .setFooter({
            text:"made by mtnk | @unsnipeable"
        })
        .setTimestamp();
}

module.exports = {
    buildEmbed
};