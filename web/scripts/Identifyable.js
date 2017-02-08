class Identifyable {
    
    constructor() {
        
        if (window.objectIDs === undefined)
            window.objectIDs = 0;
        this.objectID_ = window.objectIDs++;
    }
    
    get objectID() {
        return this.objectID_;
    }
}
