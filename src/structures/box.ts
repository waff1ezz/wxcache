import Entity from "./entity.ts";

export default class Box<T extends Entity> {
    private _entity: T | null;
    private _timeout: ReturnType<typeof setTimeout> | undefined;
    readonly entity_identifier: number;

    constructor(identifier: number, entity: T | null) {
        this.entity_identifier = identifier;
        this._entity = entity;
    }

    get entity() {
        return this._entity;
    }

    get is_empty() {
        return !this.entity;
    }

    set_timeout(minutes: number): void {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => this._entity = null, 1000 * 60 * minutes);
    }

    set_value(entity: T | null): void {
        this._entity = entity;
    }
}