
//
function readSettings(settingsCollection)
{
    // Log saved settings for debugging purposes
    for (let setting in settingsCollection)
    {
        console.log(setting + " : " + settingsCollection[setting]);
    }

    let fact = new ModuleFactory();

    // Iterate through settings in storage
    for (moduleName in settingsCollection)
    {
        let settings = settingsCollection[moduleName];

        let module = fact.createModule(
            fact.getModuleNo(moduleName)
        );

        let options = module.getOptions();

        // Iterate through module options
        for (option in options)
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
    let fact = new ModuleFactory();

    let defaultObj = {};

    // Iterate through all possible modules
    for (let i = 0; i < fact.getMaxModules(); i++)
    {
        // Create settings object
        let settings = {};

        // Instantiate module and get options
        let module = fact.createModule(i);
        let options = module.getOptions();

        // Iterate through options
        for (option in options)
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
