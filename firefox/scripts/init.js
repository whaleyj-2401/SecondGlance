function setDefaultSettings()
{
    fact = new ModuleFactory();

    for (let i = 0; i < fact.getMaxModules(); i++)
    {
        // Create settings object
        let settings = {};

        let module = fact.createModule(i);

        let options = module.getOptions();

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

        let storeObj = {};

        storeObj[settings.moduleName] = { ...settings };

        browser.storage.local.set(storeObj);
    }
}

browser.runtime.onInstalled.addListener(setDefaultSettings);
