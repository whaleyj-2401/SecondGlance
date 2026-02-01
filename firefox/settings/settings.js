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
        for (let setting in settings)
        {
            settings = settings[setting];
        }

        document.getElementById("settings_form").innerHTML +=
        `<h2>${settings.moduleName}</h2>
        `;

        let fact = new ModuleFactory();
        let options = fact.getModuleOptions(
            fact.getModuleNo(settings.moduleName)
        );

        for (let option in options)
        {
            if (option === "moduleName")
            { continue; }

            let header = "<p>" + option + "</p>";

            let type = options[option].type;

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
                                ${options[option][opt] === settings[option] ?
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
}

document.addEventListener("DOMContentLoaded", Settings.loadSettingsPage)
