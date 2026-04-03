import BayesClassifier from "natural/lib/natural/classifiers/bayes_classifier.js";
import LancasterStemmer from "natural/lib/natural/stemmers/lancaster_stemmer.js";

/* ===================
 *  TextScanningModel
 * ===================
 * Abstract class from which all machine learning models meant for scanning
 * text are derived. Derived classes must implement scanText.
 */
export class TextScanningModel
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
export class TestTSM extends TextScanningModel
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

/* ===============
 *  NaiveBayesTSM
 * ===============
 * Implements a pre-trained Naive Bayes classifier provided by Natural JS.
 */
export class NaiveBayesTSM extends TextScanningModel
{
    constructor()
    {
        super();

        let serialUrl = browser.runtime.getURL(
            "ml_serialized/naiveBayesNatural.json"
        );

        let modelSerial;

        // TODO: Wake up from the async/sync nightmare.

        fetch(serialUrl).then((response) => {

            console.log("Reached fetch then.");
            console.log(response);

            return response.json()
        }).then((jsonData) => {

            console.log("Reached json then.");
            console.log(jsonData);

            modelSerial = jsonData;
        });

        console.log(modelSerial);

        this.model = BayesClassifier.restore(modelSerial);

        console.log("Model deserialized.");
    }

    scanText(text)
    { return model.classify(text); }
}

/* ==========================
 *  TextScanningModelFactory
 * ==========================
 * Factory class which produces models for classifying text.
 */
export class TextScanningModelFactory
{
    constructor()
    {
        this.maxModels = 2;
    }

    createModel(modelNo)
    {
        switch(modelNo)
        {
            case -1:
                return new TestTSM();
                break;
            case 0:
                return new NaiveBayesTSM();
                break;
            default:
                return null;
                break;
        }
    }
}
