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
            }
        }
    }

    async scanPage()
    {
        //if (!this.canRunHere())
        //    return;

        let modelFact = new TextScanningModelFactory();
        let model = modelFact.createModel(this.settings["model"]);

        let textElementTags = [
            "SPAN",
            "P",
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6"
        ];

        let bodyElements = [];

        for (let i = 0; i < textElementTags.length; i++)
        {
            bodyElements = bodyElements.concat(
                document.getElementsByTagName(textElementTags[i])
            );
        }

        for (let i = 0; i < bodyElements.length; i++)
        {
            for (let j = 0; j < bodyElements[i].length; j++)
            {
                let innerText = bodyElements[i][j].innerText;

                console.log(innerText, " : ", model.scanText);

                if (model.scanText(innerText) === 1)
                {
                    bodyElements[i][j].style.backgroundColor = "black";
                    bodyElements[i][j].style.color = "white";
                }
            }
        }
    }

    canRunHere()
    {
        if (!this.settings.enabled)
            return false;


    }
}
