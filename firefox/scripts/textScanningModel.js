/*===================
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
