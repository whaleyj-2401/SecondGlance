// This file contains the Module abstract class.
// Code by James Whaley.

/* ========
 *  Module
 * ========
 * Abstract class from which all modules (Adblocker, text scanner, etc) are
 * derived.
 */

export class Module
{
    constructor()
    {
        if (this.constructor.name === "Module")
        {
            throw new Error("Module class cannot be instantiated.\n");
        }
    }

    getOptions()
    {
        return { ...Module.generalOptions, ...this.options };
    }

    // settingsIsValid
    // Checks if a given settings object has the minimum required attributes
    // to be considered a settings object. Should probably be called in
    // setSettings().
    static settingsIsValid(settings, keys)
    {
        let isValid = true;
        let validKeysSuper = Object.keys(Module.generalOptions);
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

    static generalOptions =
    {
        enabled : {
            "type" : "select_exclusive",
            "default" : true,
            "Enabled" : true,
            "Disabled" : false
        },

        urlListEnabled : {
            "type" : "select_exclusive",
            "default" : true,
            "Enabled" : true,
            "Disabled" : false
        },

        urlList : {
            "type" : "text_list",
            "default" : [],
        },

        isWhitelist : {
            "type" : "select_exclusive",
            "default" : true,
            "Whitelist" : true,
            "Blacklist" : false
        },
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
