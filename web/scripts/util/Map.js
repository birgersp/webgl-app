class Map {

    constructor() {

        this.keys = [];
        this.values = [];
    }

    get(key) {

        let i = this.getIndex(key);
        if (i !== -1)
            return this.values[i];
        return null;
    }

    put(key, value) {

        let i = this.getIndex(key);
        if (i !== -1) {
            this.keys[i] = key;
            this.values[i] = key;
        } else {
            this.keys.push(key);
            this.values.push(value);
        }
    }

    contains(key) {

        return this.getIndex(key) !== -1;
    }

    getIndex(key) {

        return this.keys.indexOf(key);
    }
}
