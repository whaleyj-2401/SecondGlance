// This file contains an object which contains various functions used for
// creating a dynamic settings page.
// Code by James Whaley

/*
==========
 Settings
==========
This class consists of static functions
*/
class Settings
{
    static getOptionsOf(moduleId)
    {
        let fact = new ModuleFactory();
        let options;

        if (typeof moduleId === "number")
        {
            options = fact.getModuleOptions(
                fact.getModuleNo(moduleName)
            );
        }
        else if (typeof moduleId === "string")
        {
            options = fact.getModuleOptions(moduleId);
        }
        else
        {
            throw new Error(`Settings.getOptionsOf: Invalid type,
                             must be string or number`)
        }

        for (let option in options)
        {
            console.log(option);
        }

        return options;
    }

    static readStoredSettings(moduleName)
    {
        browser.storage.local.get(moduleName).then(
            Settings.populateSettingsPage,
            (err) =>
            {
                console.error(err);
            }
        );
    }

    static loadSettingsPage()
    {
        let fact = new ModuleFactory();

        for (let i = 0; i < fact.getMaxModules(); i++)
        {
            Settings.readStoredSettings(
                fact.getModuleName(i)
            );
        }
    }

    static populateSettingsPage(settings)
    {
        // Make sure the settings object isn't a value in another object
        for (let setting in settings)
        {
            settings = settings[setting];
        }

        // Add header for module section
        document.getElementById("settings_form").innerHTML +=
        `<h2>${settings.moduleName}</h2>
        `;

        // Get options object
        let fact = new ModuleFactory();
        let options = fact.getModuleOptions(
            fact.getModuleNo(settings.moduleName)
        );

        // Iterate through options to assign settings
        for (let option in options)
        {
            // Module name is immutable
            if (option === "moduleName")
            { continue; }

            // Header states the option
            let header = "<p>" + option + "</p>";

            // Type is stored in a variable for ease of access
            let type = options[option]["type"];

            //
            let id = settings.moduleName + "_" + option + "_" + type;

            switch (type)
            {
                case "text":

                    document.getElementById("settings_form").innerHTML +=

                    `<label for="${id}">${option}: </label>
                     <input type="text"
                            id="${id}"
                            name="${option + "_" + settings.moduleName}"
                            value="${settings[option] ? settings[option] : ""}">
                            <br>
                    `;

                    break;

                case "text_list":

                    document.getElementById("settings_form").innerHTML +=

                    `<label for="${id}">${option}: </label><br>
                     <textarea id="${id}"></textarea>
                    `;

                    settings[option].forEach((value) => {
                        document.getElementById(`${id}`).innerHTML += value;
                        document.getElementById(`${id}`).innerHTML += "\n";
                    })

                    break;

                case "select_exclusive":

                    document.getElementById("settings_form").innerHTML +=
                    `<p>${header}</p>
                    `;

                    for (let opt in options[option])
                    {
                        if (opt === "type" ||
                            opt === "default" ||
                            opt === "moduleName")
                        { continue; }

                        document.getElementById("settings_form").innerHTML +=

                        `<input type="radio"
                                id="${id + opt}"
                                name="${option + "_" + settings.moduleName}"
                                value=${opt}
                                ${options[option][opt] === settings[option] ?
                                    "checked" : ""}>
                            <label for="${id}">${opt}</label><br>
                        `;
                    }

                    break;

                case "select_inclusive":

                    document.getElementById("settings_form").innerHTML +=
                    `<p>${header}</p>
                    `;

                    for (let opt in options[option])
                    {
                        if (opt === "type" ||
                            opt === "default" ||
                            opt === "moduleName")
                        { continue; }

                        document.getElementById("settings_form").innerHTML +=

                        `<input type="checkbox"
                                id="${id + opt}"
                                name="${option + "_" + settings.moduleName}"
                                value=${opt}
                                ${settings[option].includes(options[option][opt]) ?
                                    "checked" : ""}>
                        <label for="${id}">${opt}</label><br>
                        `;
                    }

                    break;

                default:
                    throw new Error(`Settings: Undefined type for module ${settings.moduleName}:
                                     ${type}`);

                    break;
            }
        }
    }

    static writeSettingsFromPage(ev)
    {
        ev.preventDefault();

        let fact = new ModuleFactory();

        for (let i = 0; i < fact.getMaxModules(); i++)
        {
            let module = fact.createModule(i);
            let options = module.getOptions();

            let settings = {};
            settings["moduleName"] = options["moduleName"];

            for (let option in options)
            {
                // Type is stored in a variable for ease of access
                let type = options[option].type;

                let elements = null;

                let selectedValue = null;

                //
                let id = options.moduleName + "_" + option + "_" + type;

                switch (options[option]["type"])
                {
                    case "text":

                            settings[option] =
                            document.getElementById(`${id}`).value;

                        break;

                    case "text_list":

                        let optStr = document.getElementById(`${id}`).value;
                        let urlArray = optStr.split("\n");
                        let cpyFunc = (el) => { return el };

                        settings[option] = urlArray.map(cpyFunc);

                        break;

                    case "select_exclusive":

                        elements = document.getElementsByName(
                            option + "_" + options.moduleName
                        );

                        elements.forEach((el) => {
                            if (el.checked)
                            {
                                selectedValue = options[option][el.value];
                            }
                        });

                        if (selectedValue === null)
                        {
                            throw new Error(
                                `In stored settings: ` +
                                `${option} ` +
                                `was not defined.`
                            );
                        }

                        settings[option] = selectedValue;

                        break;

                    case "select_inclusive":

                        settings[option] = [];

                        elements = document.getElementsByName(
                            option + "_" + options.moduleName
                        );

                        elements.forEach((el) => {
                            if (el.checked)
                            {
                                selectedValue = options[option][el.value];
                            }
                        });

                        if (selectedValue === null)
                        {
                            throw new Error(
                                `In stored settings: ` +
                                `${option} ` +
                                `was not defined.`
                            );
                        }

                        settings[option].push(selectedValue);

                        break;

                    default:

                        break;
                }
            }

            let storeObj = {};

            storeObj[options.moduleName] = { ...settings };

            browser.storage.local.set(storeObj);
        }
    }
}

document.addEventListener(
    "DOMContentLoaded",
    Settings.loadSettingsPage
);

document.getElementById("settings_form").addEventListener(
    "submit",
    Settings.writeSettingsFromPage
);

