
class TestModule extends Module
{
    constructor()
    {
        super();

        this.options = {

            testThingOne : {
                type : "select",
                optionOne : true,
                optionTwo : false
            },

            testThingTwo : {
                type : "select",
                optionOne : 1,
                optionTwo : 2,
                optionThree : 3
            },

            testThingThree : {
                type : "text"
            }
        }
    }

    scanPage()
    {
        console.log("Settings keys: " + Object.keys(this.settings).toString() + "\n"
                    + "Settings values: " + Object.values(this.settings).toString() + "\n");
    }
}
