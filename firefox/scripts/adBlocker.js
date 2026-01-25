/* ===========
 *  AdBlocker
 * ===========
 * Module which hides advertisements in a web page.
 */
class AdBlocker extends Module
{
    setSettings(settings) 
    {   
        // If the settings object is not valid, log an error and return.
        if (this.settingsIsValid(settings)) {
            console.error("Invalid settings object passed to AdBlocker.setSettings().\n");
            return;
        }

        this.settings = settings;
    }

    scanPage()
    {
        // Make sure settings are enabled and valid
        if (!this.settings || !this.settings.enabled) {
            return;
        }

        // TODO: Implement whitelisting logic here

        // Define a list of common ad related selectors
        const ads = [
            "iframe[src*='ads']", // Matches iframes with 'ads' in the src attribute
            "div[class*='ad']", // Matches divs with 'ad' in the class attribute
            "img[src*='ad']", // Matches images with 'ad' in the src attribute
            "section[class*='sponsor']" // Matches sections with 'sponsor' in the class attribute (Sponsored content)
            // TODO : Possibly expand list with more ad selectors
        ];

        // Iterate through each selector and hide matching elements
        ads.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                element.style.display = 'none';
            });
        });
        }
}
