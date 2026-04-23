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

// This file contains the main function. Execution begins and ends here.
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
