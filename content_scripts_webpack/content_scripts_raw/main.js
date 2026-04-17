// Contains the main function. Execution begins and ends here.
// Code by James Whaley

import {ModuleFactory} from "./moduleFactory.js";

async function main()
{
    let fact = new ModuleFactory();

    for (let i = 0; i < fact.getMaxModules(); i++)
    {
        let module = fact.createModule(i);

        let settings = await browser.storage.local.get(
            fact.getModuleName(i)
        );

        settings = settings[fact.getModuleName(i)];

        module.setSettings(settings);

        let isEnabledHere = true;

        if (!module.settings.enabled)
            isEnabledHere = false;
        else if (module.settings.urlListEnabled)
        {
            console.log(module.settings.urlList);

            if (module.settings.isWhitelist)
            {
                for (let i = 0; i < module.settings.urlList.length; i++)
                {
                    let url = window.location.href;

                    let listItem = module.settings.urlList[i];

                    // If url found in whitelist, return
                    if (url.includes(listItem) && !(listItem === ""))
                        isEnabledHere = false;
                }
            }
            else if (!module.settings.isWhitelist)
            {
                let urlNotBlacklisted = true;

                for (let i = 0; i < module.settings.urlList.length; i++)
                {
                    let url = window.location.href;

                    let listItem = module.settings.urlList[i];

                    // Check if url is in blacklist
                    if (url.includes(listItem) && !(listItem === ""))
                        urlNotBlacklisted = false;
                }

                // If url was not found in blacklist, return
                if (urlNotBlacklisted)
                    isEnabledHere = false;
            }
        }

        if (isEnabledHere)
            module.scanPage();
    }
}

main();
