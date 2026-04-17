import {Module} from "./module.js";
import {TextScanningModel} from "./textScanningModel.js";
import {TestTSM} from "./textScanningModel.js";
import {TextScanningModelFactory} from "./textScanningModel.js";

import BayesClassifier from "natural/lib/natural/classifiers/bayes_classifier.js";
import PorterStemmer from "natural/lib/natural/stemmers/porter_stemmer.js";

/* =============
 *  TextScanner
 * =============
 * Module that scans text. Searches HTML elements for text, and uses a
 * child class of the TextScanningModel class to come to a decision about
 * input pieces of text.
 */

export class TextScanner extends Module
{
    constructor()
    {
        super();

        this.options = {

            moduleName : "Text Scanner",

            model : {
                "type" : "select_exclusive",
                "default" : 0,
                "Test" : -1,
                "Naive Bayes" : 0
            },

            scanChunkSize : {
                "type" : "text",
                "default" : "500"
            }
        }
    }

    async scanPage()
    {
        console.log("Textscanner Scanpage running.");

        let modelFact = new TextScanningModelFactory();
        let model = await modelFact.createModel(this.settings["model"]);

        let textElementTags = [
            //"SPAN",
            "P",
            //"H1",
            //"H2",
            //"H3",
            //"H4",
            //"H5",
            //"H6"
        ];

        let bodyElements = [];

        for (let i = 0; i < textElementTags.length; i++)
        {
            bodyElements = bodyElements.concat(
                Array.from(document.getElementsByTagName(textElementTags[i]))
            );
        }

        let chunkSize = parseInt(this.settings["scanChunkSize"], 10);

        if (isNaN(chunkSize) || chunkSize < 1)
        {
            chunkSize = 500;
        }

        for (let i = 0; i < bodyElements.length; i++)
        {
            let innerText = bodyElements[i].innerText;

            if (!innerText || innerText.length <= 50)
            {
                continue;
            }

            let flagged = false;

            for (let j = 0; j < innerText.length; j += chunkSize)
            {
                let textChunk = innerText.slice(j, j + chunkSize);

                if (textChunk.length <= 50)
                {
                    continue;
                }

                let result = model.scanText(textChunk);

                /*
                console.log(textChunk,
                            "\nLength: ",
                            textChunk.length,
                            "\nValue: ",
                            result,
                            "\nResult type: ",
                            typeof(result));
                */

                if (result === 1)
                {
                    flagged = true;
                    break;
                }
            }

            if (flagged)
            {
                bodyElements[i].style.backgroundColor = "black";
                bodyElements[i].style.color = "white";
            }
        }
    }
}
