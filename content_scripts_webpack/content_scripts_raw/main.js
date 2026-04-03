// TODO: Iterate through the numbers in the ModuleFactory class. Instantate
//       each object, run its function, check the result, and destroy it.

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

        module.scanPage();
    }
}

main();
