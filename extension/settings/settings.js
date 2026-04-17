// settings.js
// This file contains an object which contains various functions used for
// creating a dynamic settings page.
// Code by James Whaley

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
            "default" : -1,
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

/*
 ==========
  Settings
 ==========
 This class consists of static functions
*/
class Settings
{
    constructor()
    {
        throw new Error("Settings class is abstract.");
    }

    /*
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
    */

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
        for (let options in optionsArr)
        {
            Settings.readStoredSettings(
                options
            );
        }
    }

    static populateSettingsPage(settings)
    {
        for (let setting in settings)
        {
            console.log(setting + " : " + settings[setting])
        }
        // Make sure the settings object isn't a value in another object
        for (let setting in settings)
        {
            settings = settings[setting];
        }

        // Add header for module section
        /*document.getElementById("settings_form").innerHTML +=
        `<h2>${settings.moduleName}</h2>
        `;*/
        let form = document.getElementById("settings_form");
        let card = document.createElement("div");
        card.className = "module-card";
        card.innerHTML = `<h2>${settings.moduleName}</h2>`;
        form.appendChild(card);

        // Get options object
        let options = { ...generalOptions, ...optionsArr[settings.moduleName] };

        // Iterate through options to assign settings
        for (let option in options)
        {
            // Module name is immutable
            if (option === "moduleName")
            { continue; }

            // Header states the option
            let header = "<p>" + option.replace(/([A-Z])/g, " $1").replace(/^./, c=> c.toUpperCase()) + "</p>";

            // Type is stored in a variable for ease of access
            let type = options[option]["type"];

            // Base for HTML ids
            let id = settings.moduleName + "_" + option + "_" + type;

            // Whitespaces cannot exist in HTML ids
            id = id.replaceAll(" ", "_");

            // Decides which action to take based on the type of the option
            switch (type)
            {
                // Adds a text input
                case "text":

                    card.innerHTML +=

                    `<label for="${id}">${option}: </label>
                     <input type="text"
                            id="${id}"
                            name="${option + "_" + settings.moduleName}"
                            value="${settings[option] ?
                                settings[option] : ""}">
                     <br>
                    `;

                    break;

                // Adds a multiline text field, options are newline-delimited
                case "text_list":

                    card.innerHTML +=

                    `<label for="${id}">${option}: </label><br>
                     <textarea id="${id}"></textarea>
                    `;

                    settings[option].forEach((value) => {
                        document.getElementById(`${id}`).innerHTML += value;
                        document.getElementById(`${id}`).innerHTML += "\n";
                    })

                    break;

                // Adds radio buttons for the options
                case "select_exclusive":

                    card.innerHTML +=
                    `<p>${header}</p>
                    `;

                    for (let opt in options[option])
                    {
                        if (opt === "type" ||
                            opt === "default" ||
                            opt === "moduleName")
                        { continue; }

                        card.innerHTML +=

                        `<input type="radio"
                                id="${id + opt.replaceAll(" ", "_")}"
                                name="${option + "_" + settings.moduleName}"
                                value=${opt.replaceAll(" ", "_")}
                                ${options[option][opt] === settings[option] ?
                                    "checked" : ""}>
                         <label for="${id + opt.replaceAll(" ", "_")}">
                             ${opt}
                         </label><br>
                        `;
                    }

                    break;

                // Adds check boxes for the options
                case "select_inclusive":

                    card.innerHTML +=
                    `<p>${header}</p>
                    `;

                    for (let opt in options[option])
                    {
                        if (opt === "type" ||
                            opt === "default" ||
                            opt === "moduleName")
                        { continue; }

                        card.innerHTML +=

                        `<input type="checkbox"
                                id="${id + opt.replaceAll(" ", "_")}"
                                name="${option + "_" + settings.moduleName}"
                                value=${opt.replaceAll(" ", "_")}
                                ${settings[option].includes(
                                    options[option][opt]) ?
                                    "checked" : ""}>
                         <label for="${id + opt.replaceAll(" ", "_")}">
                             ${opt}
                         </label><br>
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

        for (let moduleName in optionsArr)
        {
            let options = { ...generalOptions, ...optionsArr[moduleName] };

            let settings = {};
            settings["moduleName"] = options["moduleName"];

            // Iterate through options
            for (let option in options)
            {
                // Type is stored in a variable for ease of access
                let type = options[option].type;

                let elements = null;

                let selectedValue = null;

                // Base for HTML ids
                let id = options.moduleName + "_" + option + "_" + type;

                // Whitespaces cannot exist in HTML ids
                id = id.replaceAll(" ", "_");

                // Decides which action to take based on the type of the option
                switch (options[option]["type"])
                {
                    // Reads from the text box corresponding to the option
                    case "text":

                        settings[option] =
                        document.getElementById(`${id}`).value;

                        break;

                    // Reads from the text field, and delimits by newline
                    case "text_list":

                        let optStr = document.getElementById(`${id}`).value;
                        let urlArray = optStr.split("\n");
                        let cpyFunc = (el) => { return el };

                        settings[option] = urlArray.map(cpyFunc);

                        break;

                    // Reads from the selected radio button
                    case "select_exclusive":

                        elements = document.getElementsByName(
                            option + "_" + options.moduleName
                        );

                        elements.forEach((el) => {
                            if (el.checked)
                            {
                                selectedValue =
                                options[option][el.value.replaceAll("_", " ")];
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

                    // Reads from the selected check boxes
                    case "select_inclusive":

                        settings[option] = [];

                        elements = document.getElementsByName(
                            option + "_" + options.moduleName
                        );

                        elements.forEach((el) => {
                            if (el.checked)
                            {
                                selectedValue =
                                options[option][el.value.replaceAll("_", " ")];
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

            // Logs settings stored in the console for debugging purposes
            console.log(`==${settings.moduleName}==`);
            for (let setting in settings)
            {
                console.log(
                    `${setting}` +
                    " : " +
                    `${settings[setting]}`
                );
            }

            // Object to store the settings
            let storeObj = {};

            // Assign settings for the module
            storeObj[options.moduleName] = { ...settings };

            // Stores settings
            browser.storage.local.set(storeObj);
        }
    }
}

// Listener for page load
document.addEventListener(
    "DOMContentLoaded",
    Settings.loadSettingsPage
);

// Listener for save button
document.getElementById("settings_form").addEventListener(
    "submit",
    Settings.writeSettingsFromPage
);

