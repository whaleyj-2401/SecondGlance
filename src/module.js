/* ========
 *  Module
 * ========
 * Abstract class from which all modules (Adblocker, text scanner, etc) are
 * derived.
 */
class Module
{
    constructor()
    {
        if (this.constructor.name === "Module")
        {
            throw new Error("Module class cannot be instantiated.\n");
        }
    }

    // settingsIsValid
    // Checks if a given settings object has the minimum required attributes
    // to be considered a settings object. Should probably be called in
    // setSettings().
    settingsIsValid(settings)
    {
        /* For a settings object to be valid, it must contain at least the
         * following attributes:
         * moduleName
         * enabled
         * whitelistEnabled
         * whitelist
         * urlList
         */

        isValid = true;
        validKeys = ["moduleName", "enabled", "whitelistEnabled", "whitelist", "urlList"];
        settingsKeys = Object.keys(settings);

        validKeys.forEach((item, index, arr) =>
        {
            if (!settingsKeys.includes(item))
            {
                isValid = false;
            }
        })

        return isValid;
    }

    scanPage()
    {
        if (this.constructor.name === "Module")
        {
            throw new Error("Function scanPage() not implemented.\n");
        }
    }

    setSettings(settings)
    {
        if (this.constructor.name === "Module")
        {
            throw new Error("Function setSettings() not implemented.\n");
        }
    }
}

class ContentBlocker extends Module
{
    scanPage()
    {
        console.log("Success!");
    }
}
