/* ===================
 *  TextScanningModel
 * ===================
 * Abstract class from which all machine learning models meant for scanning
 * text are derived. Derived classes must implement scanText.
 */
class TextScanningModel
{
    constructor()
    {
        if (this.constructor.name === "TextScanningModel")
        {
            throw new Error("Class TextScanningModel cannot be instantiated.\n");
        }
    }

    scanText(text)
    {
        if (this.constructor.name === "TextScanningModel")
        {
            throw new Error("Function scanText has not been implemented.\n");
        }
    }
}

/* =========
 *  TestTSM
 * =========
 * Not actually a machine learning model. Flags correct if a certain token is
 * found in the input string.
 */
class TestTSM extends TextScanningModel
{
    constructor()
    {
        super();
        this.token = "i";

    }

    scanText(text)
    {
        if (text.indexOf(this.token) != -1)
            return 0;
        else
            return 1;
    }
}

/* ==========================
 *  TextScanningModelFactory
 * ==========================
 * Factory class which produces models for classifying text.
 */
class TextScanningModelFactory
{
    constructor()
    {
        this.maxModels = 1;
    }

    createModel(modelNo)
    {
        switch(modelNo)
        {
            case -1:
                return new TestTSM();
                break;
            default:
                return null;
                break;
        }
    }
}
