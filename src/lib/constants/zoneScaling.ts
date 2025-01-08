export const wavesPerZone = 10;

const zoneMinMonsters = 10
const zoneMaxMonsters = 100
export const enemyCount = (level: number) => {
    //Linearly scale between min and max monsters
    return zoneMaxMonsters + (zoneMinMonsters - zoneMaxMonsters) * (level/100);
}