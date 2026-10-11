export default abstract class Entity {
    abstract id: number;

    static async fetch(id: number): Promise<Entity | null> {
        throw new Error("You must implement the fetching method for your entity");
    }

    constructor(...args: any[]) {}
}