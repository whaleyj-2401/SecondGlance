// init.js
// This file contains code to be run on installation/update of the software.
// The purpose of this code is to check for settings stored within the
// browser's local storage. If settings are not found, then default settings
// are automatically generated from the definitions of the modules in the
// system.
// Code by James Whaley (except the optionsArr object)

let optionsArr = {

    "Ad Blocker" : {
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
    },

    "Feature Remover" : {
        moduleName : "Feature Remover",

        aggressiveEnabled : {
            "type" : "select_exclusive",
            "default" : true,
            "Aggressive Mode" : true,
            "Base Mode" : false
        },

        aiRemovalEnabled : {
            "type" : "select_exclusive",
            "default" : true,
            "Enabled" : true,
            "Disabled" : false
        }
    },

    "Text Scanner" : {
        moduleName : "Text Scanner",

        model : {
            "type" : "select_exclusive",
            "default" : 0,
            "Test" : -1,
            "Naive Bayes" : 0
        }
    }
};

let generalOptions = {

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
};

// readSettings
// Reads in the settings object from browser storage.
function readSettings(settingsCollection)
{
    //let fact = new ModuleFactory();

    // Iterate through settings in storage
    for (let moduleName in settingsCollection)
    {
        let settings = settingsCollection[moduleName];

        let options = { ...generalOptions, ...optionsArr[moduleName] };

        // Iterate through module options
        for (let option in options)
        {
            // If option isn't found in settings, set default
            if (!Object.keys(settings).includes(option))
            {
                settingsCollection[moduleName][option] =
                options[option]["default"];
            }
        }
    }

    // Write adjusted settings object
    browser.storage.local.set(settingsCollection);
}


// setDefaultSettings
// Function that runs on update or installation.
// Sets defaults for unset settings.
function setDefaultSettings()
{
    // Factory for getting options
    //let fact = new ModuleFactory();

    let defaultObj = {};

    // Iterate through all possible modules
    for (let moduleName in optionsArr)
    {
        // Create settings object
        let settings = {};

        // Get options
        let options = { ...generalOptions, ...optionsArr[moduleName] };

        // Iterate through options
        for (let option in options)
        {
            if (option === "moduleName")
            {
                settings[option] = options[option];
            }
            else
            {
                settings[option] = options[option]["default"];
            }
        }

        defaultObj[settings.moduleName] = { ...settings };

        //browser.storage.local.set(storeObj);
    }

    let promise = browser.storage.local.get(defaultObj);
    promise.then(
        readSettings,
        (err) =>
        {
            console.error(err);
        }
    );
}

// Listener for installation
browser.runtime.onInstalled.addListener(setDefaultSettings);
