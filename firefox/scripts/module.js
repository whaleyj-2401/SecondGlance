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
    static settingsIsValid(settings, keys)
    {
        /* For a settings object to be valid, it must contain at least the
         * following attributes:
         * moduleName
         * enabled
         * whitelistEnabled
         * whitelist
         * urlList
         */

        let isValid = true;
        let validKeysSuper = ["moduleName", "enabled", "whitelistEnabled", "whitelist", "urlList"];
        let validKeys = validKeysSuper.concat(keys);
        let settingsKeys = Object.keys(settings);

        validKeys.forEach((item, index, arr) =>
        {
            if (!settingsKeys.includes(item))
            {
                isValid = false;
            }
        })

        return isValid;
    }

    setSettings(settings)
    {
        let settingsKeys = [];

        if (!(typeof this.options != 'undefined'))
        {
            settingsKeys = Object.keys(this.options);
        }

        if (Module.settingsIsValid(settings, settingsKeys))
        {
            this.settings = settings;
        }
        else
        {
            throw new Error(this.constructor.name +
                            ": Settings object not valid.");
        }
    }

    scanPage()
    {
        if (this.constructor.name === "Module")
        {
            throw new Error("Function scanPage() not implemented.\n");
        }
    }
}
