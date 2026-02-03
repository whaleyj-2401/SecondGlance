// TODO: Iterate through the numbers in the ModuleFactory class. Instantate
//       each object, run its function, check the result, and destroy it.

test = new TestModule();

let settings =
{
    moduleName : "testModule",
    enabled : true,
    whitelistEnabled : true,
    whitelist : true,
    urlList : ["www.google.com", "www.duckduckgo.com"],

    testThingOne : true,
    testThingTwo : 2
}

test.setSettings(settings);

test.scanPage();
