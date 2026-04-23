/*
 * Copyright 2026 Andrew Detering, Kelowna Ngoyi, James Whaley
 *
 * This file is part of SecondGlance.
 *
 * SecondGlance is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * SecondGlance is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with SecondGlance. If not, see <https://www.gnu.org/licenses/>.
 */

// This file contains the Module abstract class. All program modules are
// derived therefrom.
// Code by James Whaley

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
