export const wavesPerZone = 2;

const zoneMinMonsters = 1
const zoneMaxMonsters = 100
export const enemyCount = (level: number) => {
    //Linearly scale between min and max monsters
    return Math.round(zoneMinMonsters + (zoneMaxMonsters - zoneMinMonsters) * (level/100));
}