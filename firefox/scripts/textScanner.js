/* =============
 *  TextScanner
 * =============
 * Module that scans text. Searches HTML elements for text, and uses a
 * child class of the TextScanningModel class to come to a decision about
 * input pieces of text.
 */
class TextScanner extends Module
{
    constructor()
    {
        super();

        this.options = {

            moduleName : "Text Scanner",

            delimiter : {
                "type" : "text",
                "default" : "."
            }
        }
    }

    scanPage()
    {
        // TODO: Implement this function.
    }
}
