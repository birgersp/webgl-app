class User {

    constructor() {

        this.velocity = new Vector3();
        this.position = new Vector3();
    }
}

User.HEIGHT = 3.5;
User.BOTTOM_TO_TOP = new Vector3(0, User.HEIGHT, 0);
User.BOTTOM_CENTER_POS = new Vector3(0, -User.HEIGHT / 2, 0);
User.TOP_CENTER_POS = new Vector3(0, User.HEIGHT / 2, 0);
