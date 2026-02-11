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
        // Make sure settings are enabled and valid
        if (!this.settings || !this.settings.enabled) {
            return;
        }

        // TODO: Implement URL whitelisting logic here

        const blockEverything = this.settings.blockAll;
        // Popup ads
        if (blockEverything || this.settings.blockPopups) {
            const popupSelectors = [
                "iframe[src*='popup']",
                "div[class*='popup']",
                "img[src*='popup']",
                "div[class*='modal']"
            ]

            popupSelectors.forEach((selector) => {
                document.querySelectorAll(selector).forEach(element => {
                    element.style.display = 'none';
            });
        });

        }

        //Banner ads
        if (blockEverything || this.settings.blockBanners) {
            const bannerSelectors = [
                // Define a list of common ad related selectors
                "iframe[src*='ads']", // Matches iframes with 'ads' in the src attribute
                "div[class*='ad']", // Matches divs with 'ad' in the class attribute
                "img[src*='ad']", // Matches images with 'ad' in the src attribute
                "section[class*='sponsor']" // Matches sections with 'sponsor' in the class attribute (Sponsored content)
            ];
            
            // Iterate through each selector and hide matching elements
            bannerSelectors.forEach((selector) => {
                document.querySelectorAll(selector).forEach(element => {
                    element.style.display = 'none';
                });
            });
        }
    }
}
