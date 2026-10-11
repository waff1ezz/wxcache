import Entity from "./entity.ts";
import Box from "./box.ts";

export default class Cache {
    private static readonly storage: Map<Function, Box<Entity>[]> = new Map();
    private static timeout_duration = 15;

    static set_config<C extends typeof Entity>(class_name: C, timeout_duration: number): void {
        if (this.storage.has(class_name)) {
            this.storage.set(class_name, []);
        }

        this.timeout_duration = timeout_duration;
    }

    static async retrieve<C extends typeof Entity>(class_name: C, identifier: number): Promise<Box<InstanceType<C>> | null> {
        if (!this.storage.has(class_name)) {
            throw new Error(`${class_name} store is not initialized`);
        }

        let box = this.storage
            .get(class_name)!
            .find(box => box.entity_identifier === identifier);

        if (!box) {
            box = new Box(identifier, null);
            box.set_value(await class_name.fetch(identifier));

            this.storage
                .get(class_name)!
                .push(box);
        }

        else if (box.is_empty) {
            const refreshed = await class_name.fetch(identifier);
            if (!refreshed) return box as Box<InstanceType<C>>;

            box.set_value(refreshed);
        }

        box.set_timeout(this.timeout_duration);
        return box as Box<InstanceType<C>>;
    }

    static invalidate<C extends typeof Entity>(class_name: C, identifier: number): void {
        if (!this.storage.has(class_name)) {
            throw new Error(`${class_name} store is not initialized`);
        }

        const box = this.storage
            .get(class_name)!
            .find(box => box.entity_identifier === identifier);

        if (box) {
            box.set_value(null);
        }
    }
}