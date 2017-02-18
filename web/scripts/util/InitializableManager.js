include("Initializable");

class InitializableManager {

    constructor() {

        this.initialized = 0;
        this.initializables = [];
    }

    add(initializable) {

        this.initializables.push(initializable);
    }

    initialize(callback) {

        let manager = this;
        for (let i in this.initializables)
            this.initializables[i].initialize(function() {
                manager.initialized++;
                if (manager.initialized === manager.initializables.length)
                    callback();
            });
    }
}
