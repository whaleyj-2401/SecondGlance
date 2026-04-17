// Contains wrapper classes for text scanning ML models used in the project.
// Code by James Whaley

import BayesClassifier from "natural/lib/natural/classifiers/bayes_classifier.js";
import PorterStemmer from "natural/lib/natural/stemmers/porter_stemmer.js";

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
    constructor(model)
    {
        super();

        this.model = model;

    }

    scanText(text)
    {
        let result = this.model.classify(text);

        if (result === "0")
            return 0;
        else if (result === "1")
            return 1;
    }
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

    async createModel(modelNo)
    {
        switch(modelNo)
        {
            case -1:
                return new TestTSM();
                break;
            case 0:

                let serialUrl = browser.runtime.getURL(
                    "ml_serialized/naiveBayesNatural.json"
                );

                let file = await fetch(serialUrl);

                let modelSerial = await file.json();

                let model = new BayesClassifier(PorterStemmer);

                model.docs = modelSerial.docs;
                model.features = modelSerial.features;
                model.lastAdded = modelSerial.lastAdded;

                model.classifier.classFeatures = modelSerial.classifier.classFeatures;
                model.classifier.classTotals = modelSerial.classifier.classTotals;
                model.classifier.smoothing = modelSerial.classifier.smoothing;
                model.classifier.totalExamples = modelSerial.classifier.totalExamples;

                return new NaiveBayesTSM(model);

                break;
            default:
                return null;
                break;
        }
    }
}
