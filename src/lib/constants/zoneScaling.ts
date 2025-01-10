export const wavesPerZone = 5;

const zoneMinMonsters = 10
const zoneMaxMonsters = 100
export const enemyCount = (level: number) => {
    //Linearly scale between min and max monsters
    return Math.round(zoneMinMonsters + (zoneMaxMonsters - zoneMinMonsters) * (level/100));
}