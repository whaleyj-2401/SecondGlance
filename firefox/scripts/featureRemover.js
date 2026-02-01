/* ================
 *  FeatureRemover
 * ================
 * Class which removes unwanted features from the web page.
 */
class FeatureRemover extends Module
{
    constructor()
    {
        super();

        this.options = {

            moduleName : "Feature Remover",

            isAggressive : {
                "type" : "select_exclusive",
                "default" : false,
                "Aggressive" : true,
                "Passive" : false
            }
        }
    }

    scanPage()
    {
        // TODO: Implement this function.
    }
}
