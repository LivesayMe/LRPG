const itemNameAdjectives = [
    "Tempest",
    "Maelstrom",
    "Miracle",
    "Fury",
    "Dread",
    "Storm",
    "Torment"
]

const itemNameNouns = [
    "Paw",
    "Stinger",
    "Fang",
    "Claw",
    "Knell",
    "Pillar"
]

const generateName = () => {
    const adjective = itemNameAdjectives[Math.floor(Math.random() * itemNameAdjectives.length)];
    const noun = itemNameNouns[Math.floor(Math.random() * itemNameNouns.length)];
    return `${adjective} ${noun}`;
}

export { generateName };