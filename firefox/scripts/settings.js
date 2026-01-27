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
                                              });
    }

    static populateSettingsPage()//settings)
    {

        let options =
        {
            testThingOne : {
                type : "select_exclusive",
                optionOne : true,
                optionTwo : false
            },

            testThingTwo : {
                type : "select_inclusive",
                optionOne : 1,
                optionTwo : 2,
                optionThree : 3
            },

            testThingThree : {
                type : "text"
            }
        }

        let settings =
        {
            moduleName : "TestModule",
            enabled : true,
            whitelistEnabled : true,
            whitelist : true,
            urlList : "www.duckduckgo.com, www.google.com",

            testThingOne : true,
            testThingTwo : 2,
            testThingThree : "Test text."
        }
        /*
        let fact = ModuleFactory();
        let moduleNo = fact.getModuleNo(settings.moduleName);
        let options = fact.getModuleOptions(moduleNo);*/

        document.getElementById("settings_form").innerHTML +=

        `<p>Enabled</p>

        <input type="radio" id="${settings.moduleName}_enabled_radio" name="enabled" value="E">
        <label for="${settings.moduleName}_enabled_radio">Enabled</label><br>

        <input type="radio" id="${settings.moduleName}_disabled_radio" name="enabled" value="D">
        <label for="${settings.moduleName}_disabled_radio">Disabled</label><br>

        <p>Url list</p>
        <input type="radio" id="${settings.moduleName}_whitelist_en" name="whitelist" value="E">
        <label for="${settings.moduleName}_whitelist_en">Enabled</label><br>

        <input type="radio" id="${settings.moduleName}_whitelist_dis" name="whitelist" value="D">
        <label for="${settings.moduleName}_whitelist_dis">Disabled</label><br>

        <p>Url list type</p>
        <input type="radio" id="${settings.moduleName}_list_white" name="list_type" value="W">
        <label for="${settings.moduleName}_list_white">Whitelist</label><br>

        <input type="radio" id="${settings.moduleName}_list_black" name="list_type" value="B">
        <label for="${settings.moduleName}_list_black">Blacklist</label><br>

        <label for="${settings.moduleName}_url_list">List:</label>
        <input type="text" id="${settings.moduleName}_url_list" name="url_list"><br>
        `;

        if (settings.enabled)
        {
            document.getElementById(`${settings.moduleName}_enabled_radio`).checked = true;
        }
        else //if (!settings.enabled)
        {
            document.getElementById(`${settings.moduleName}_disabled_radio`).checked = true;
        }

        if (settings.whitelistEnabled)
        {
            document.getElementById(`${settings.moduleName}_whitelist_en`).checked = true;
        }
        else //if (!settings.whitelistEnabled)
        {
            document.getElementById(`${settings.moduleName}_whitelist_dis`).checked = true;
        }

        if (settings.whitelist)
        {
            document.getElementById(`${settings.moduleName}_list_white`).checked = true;
        }
        else //if (!settings.whitelist)
        {

            document.getElementById(`${settings.moduleName}_list_black`).checked = true;
        }

        document.getElementById(`${settings.moduleName}_url_list`).value = settings.urlList;

        for (let option in options)
        {
            let header = "<p>" + option + "</p>";

            let type = options[option].type;

            let id = settings.moduleName + "_" + option + "_" + type;

            let selected;

            if (type === "text")
            {
                document.getElementById("settings_form").innerHTML +=

                `<label for="${id}">${option}: </label>
                <input type="text" id="${id}" name="${option}" value="${settings[option]}"><br>
                `;
            }
            else if (type === "select_exclusive")
            {
                document.getElementById("settings_form").innerHTML +=
                `<p>${header}</p>
                `;

                for (let opt in options[option])
                {
                    if (opt === "type")
                    {
                        continue;
                    }

                    if (options[option][opt] === settings[option])
                    {
                        document.getElementById("settings_form").innerHTML +=

                        `<input type="radio" id="${id}" name="${option}" value=${opt} checked>
                        <label for="${id}">${opt}</label><br>
                        `;
                    }
                    else
                    {
                        document.getElementById("settings_form").innerHTML +=

                        `<input type="radio" id="${id}" name="${option}" value=${opt}>
                        <label for="${id}">${opt}</label><br>
                        `;
                    }

                    console.log(`${document.getElementById(id).checked} : ${opt}`);
                }
            }
            else if (type === "select_inclusive")
            {
                document.getElementById("settings_form").innerHTML +=
                `<p>${header}</p>
                `;

                for (let opt in options[option])
                {
                    if (opt === "type")
                    {
                        continue;
                    }

                    if (options[option][opt] === settings[option])
                    {
                        document.getElementById("settings_form").innerHTML +=

                        `<input type="radio" id="${id}" name="${option}" value=${opt} checked>
                        <label for="${id}">${opt}</label><br>
                        `;
                    }
                    else
                    {
                        document.getElementById("settings_form").innerHTML +=

                        `<input type="radio" id="${id}" name="${option}" value=${opt}>
                        <label for="${id}">${opt}</label><br>
                        `;
                    }

                    console.log(`${document.getElementById(id).checked} : ${opt}`);
                }
            }
        }
    }
}

//document.addEventListener("DOMContentLoaded", )
