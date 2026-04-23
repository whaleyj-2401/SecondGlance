import {Module} from "./module.js";
import {TextScanningModel} from "./textScanningModel.js";
import {TestTSM} from "./textScanningModel.js";
import {TextScanningModelFactory} from "./textScanningModel.js";

/* =============
 *  TextScanner
 * =============
 * Module that scans text. Searches HTML elements for text, and uses a
 * child class of the TextScanningModel class to come to a decision about
 * input pieces of text.
 * Code by James Whaley and Andrew Detering
 */

export class TextScanner extends Module
{
    constructor()
    {
        super();

        this.options = {

            moduleName : "Text Scanner",

            "Shortest Scannable Paragraph (Characters)" : {
                "type" : "text",
                "default" : "100"
            },

            model : {
                "type" : "select_exclusive",
                "default" : 0,
                "Test" : -1,
                "Naive Bayes" : 0
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

        let minLength = parseInt(
            this.settings["Shortest Scannable Paragraph (Characters)"],
            10
        );

        if (isNaN(minLength) || minLength < 1)
            minLength = 100;

        for (let i = 0; i < bodyElements.length; i++)
        {
            let innerText = bodyElements[i].innerText;

            if (!innerText || innerText.length <= minLength)
                continue;

            let result = model.scanText(innerText);

            /*
            console.log("Scanned: ",
                        innerText,
                        "\nLength: ",
                        innerText.length,
                        "\nValue: ",
                        result);
            */

            if (result === 1)
            {
                bodyElements[i].style.backgroundColor = "black";
                bodyElements[i].style.color = "white";
            }
        }
    }
}
