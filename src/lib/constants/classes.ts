class BaseClass {
    name: string
    attributes: string[]
    id: number

    constructor(name: string, attributes: string[], id: number) {
        this.name = name
        this.attributes = attributes
        this.id = id
    }
}

const baseClasses = [
    new BaseClass("Warrior", ["Strength"], 0),
    new BaseClass("Witch", ["Intelligence"], 1),
    new BaseClass("Ranger", ["Dexterity"], 2),
    new BaseClass("Templar", ["Strength", "Intelligence"], 3),
    new BaseClass("Shadow", ["Dexterity", "Intelligence"], 4),
    new BaseClass("Duelist", ["Strength", "Dexterity"], 5)
]

export { BaseClass, baseClasses }