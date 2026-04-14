const axios = require("axios");
let key = process.env.HYPIXEL_KEY;

function getModeStats(bw, key) {
    return {
        win: bw[`${key}_wins_bedwars`] ?? 0,
        loss: bw[`${key}_losses_bedwars`] ?? 0,
        bedbroken: bw[`${key}_beds_broken_bedwars`] ?? 0,
        bedlost: bw[`${key}_beds_lost_bedwars`] ?? 0,

        kills: bw[`${key}_kills_bedwars`] ?? 0,
        deaths: bw[`${key}_deaths_bedwars`] ?? 0,
        finalKills: bw[`${key}_final_kills_bedwars`] ?? 0,
        finalDeaths: bw[`${key}_final_deaths_bedwars`] ?? 0,

        vkills: bw[`${key}_void_kills_bedwars`] ?? 0,
        vdeaths: bw[`${key}_void_deaths_bedwars`] ?? 0,
        vfinalKills: bw[`${key}_void_final_kills_bedwars`] ?? 0,
        vfinalDeaths: bw[`${key}_void_final_deaths_bedwars`] ?? 0
    };
}

function merge(a, b) {
    return {
        kills: a.kills + b.kills,
        deaths: a.deaths + b.deaths,
        finalKills: a.finalKills + b.finalKills,
        finalDeaths: a.finalDeaths + b.finalDeaths
    };
}

async function fetchStats(username) {

    const mojang = await axios.get(
        `https://api.mojang.com/users/profiles/minecraft/${username}`
    );

    const uuid = mojang.data.id;

    const hypixel = await axios.get(
        `https://api.hypixel.net/player?key=${key}&uuid=${uuid}`
    );

    const player = hypixel.data.player;
    if (!player) return null;

    const bw = player?.stats?.Bedwars ?? {};

    const name = player?.displayname ?? "";

    let rank = (player?.newPackageRank ?? "").replace(/_PLUS/g, "+");
    if (rank === "MVP+" && player?.monthlyPackageRank === "SUPERSTAR") rank = "MVP++";
    if (rank !== "") rank = `[${rank}] `;

    const star = player?.achievements?.bedwars_level ?? 0;

    const discordId = player?.socialMedia?.links?.DISCORD ?? "";

    const stats = {
        name,
        star,
        rank,
        discordId
    };

    stats.overall = {
        win: bw.wins_bedwars ?? 0,
        loss: bw.losses_bedwars ?? 0,
        bedbroken: bw.beds_broken_bedwars ?? 0,
        bedlost: bw.beds_lost_bedwars ?? 0,
        kills: bw.kills_bedwars ?? 0,
        deaths: bw.deaths_bedwars ?? 0,
        finalKills: bw.final_kills_bedwars ?? 0,
        finalDeaths: bw.final_deaths_bedwars ?? 0,
        vkills: bw.void_kills_bedwars ?? 0,
        vdeaths: bw.void_deaths_bedwars ?? 0,
        vfinalKills: bw.void_final_kills_bedwars ?? 0,
        vfinalDeaths: bw.void_final_deaths_bedwars ?? 0
    };

    const normalModes = [
        "eight_one",
        "eight_two",
        "four_three",
        "four_four",
        "two_four",
        "castle",
        "four_four_totallynormal"
    ];

    for (const m of normalModes) {
        stats[m] = getModeStats(bw, m);
    }

    const mergeModes = [
        "rush",
        "lucky",
        "swap",
        "ultimate",
        "voidless",
        "underworld"
    ];

    for (const m of mergeModes) {
        const d = getModeStats(bw, `eight_two_${m}`);
        const f = getModeStats(bw, `four_four_${m}`);
        stats[m] = merge(d, f);
    }

    return stats;
}

module.exports = {
    getKey: () => key,
    setKey: (newKey) => key = newKey,
    fetchStats
};