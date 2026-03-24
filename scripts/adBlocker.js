/* ===========
 *  AdBlocker
 * ===========
 * Module which hides advertisements in a web page.
 */
class AdBlocker extends Module
{
    constructor()
    {
        super();
        
        this.options =
        {
            moduleName : "Ad Blocker",

            blockAll : {
                "type" : "select_exclusive",
                "default" : true,
                "Block All" : true,
                "Don't Block All" : false
            },

            blockPopups : {
                "type" : "select_exclusive",
                "default" : true,
                "Block Popups" : true,
                "Don't Block Popups" : false
            },

            blockBanners : {
                "type" : "select_exclusive",
                "default" : true,
                "Block Banners" : true,
                "Don't Block Banners" : false
            }
        }
    }

    scanPage()
    {
        if (this._running) return;
        this._running = true;

        console.log("AdBlocker scanPage running...");

        // Make sure settings are enabled and valid
        if (!this.settings || !this.settings.enabled) {
            //this._running = false;
            return;
        }

        // TODO: Implement URL whitelisting logic here

        const blockEverything = this.settings.blockAll;
        // Popup ads
        if (blockEverything || this.settings.blockPopups) {
            const popupSelectors = [
                "iframe[src*='popup']",
                "img[src*='popup']",
                "div[class*='popup']",
                "div[class*='modal']",
                "div[class*='overlay']",
                "div[class*='dialog']",
                "div[role='dialog']",
                "[aria-modal='true']",
                "div[class*='subscribe']",
                "div[class*='newsletter']"
            ]

            popupSelectors.forEach((selector) => {
                document.querySelectorAll(selector).forEach(element => {
                    this.hideElement(element);
                });
            });
        }

        //Banner ads
        if (blockEverything || this.settings.blockBanners) {
            const bannerSelectors = [
                // Define a list of common ad related selectors
                // Might miss some ads, but should catch most
                "iframe[src*='ads']",
                "iframe[src*='doubleclick']",
                "iframe[src*='googlesyndication']",
                //"div[id*='ad']",
                "div[class*='ad-']",
                //"div[class*='_ad_']",
                "div[class*='ads']",
                "div[class*='advert']",
                //"div[id*='-ad-']",
                //"div[id*='_ad_']",
                //"div[class*='-ad-']",
                //"img[src*='ad']",
                "img[src*='ads']",
                "img[src*='doubleclick']",
                "[data-ad]",
                //"[aria-label*='ad']",
                "section[class*='sponsor']",
                "div[class*='sponsor']"
            ];
            
            // Iterate through each selector and hide matching elements
            bannerSelectors.forEach((selector) => {
                document.querySelectorAll(selector).forEach(element => {
                    this.hideElement(element);
                });
            });
        }
        /*
        // text-based ad detection
        document.querySelectorAll("div, iframe, section, img, article").forEach(element => {
            const text = element.innerText?.toLowerCase();
            if (text && (text.includes("sponsored") ||
                text.includes("advertisement"))) {
                this.hideElement(element);
            }
        });
        */

        // Mutation Observer to detect dynamically loaded ads
        if (!this._observer) {
            this._observer = new MutationObserver(() => {
                this.scanPage();
            });

            this._observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        this._running = false;
    }

    hideElement(element)
    {
        element.style.display = "none";
        // element.remove();

        // Highlight ads for testing purposes
        /*
        if (element.dataset.secondGlanceBlocked) return;

        element.dataset.secondGlanceBlocked = "true";

        element.style.outline = "4px solid red";
        element.style.backgroundColor= "rgba(255, 0, 0, 0.2)";
        */
    }
}
