/* ===============
 *  ModuleFactory
 * ===============
 * Objects of this class are responsible for instantiating subclasses of the
 * "Module" class. Does this by mapping numbers to each subclass.
 */
class ModuleFactory
{
    constructor()
    {
        // Attribute which represents total module count.
        // Must be increased if new modules are added.
        this.maxModules = 3;
    }

    // createModule
    // Function which takes a number and produces the corresponding module.
    // Returns null if invalid number is given.
    createModule(moduleNo)
    {
        // Switch decides the module to instantiate based on given number.
        // TODO: Add logic for reading the settings
        switch(moduleNo)
        {
            case 0:
                return new AdBlocker();
                break;
            case 1:
                return new FeatureRemover();
                break;
            case 2:
                return new TextScanner();
                break;
            default:
                return null;
                break;
        }
    }

    getModuleOptions(moduleNo)
    {
        var module;

        switch(moduleNo)
        {
            case 0:
                module = new AdBlocker();
                break;
            case 1:
                module = new FeatureRemover();
                break;
            case 2:
                module = new TextScanner();
                break;
            default:
                return null;
                break;
        }

        return module.options;
    }

    static getModuleNo(moduleName)
    {
        switch(moduleName)
        {
            case "AdBlocker":
                return 0;
                break;
            case "FeatureRemover":
                return 1;
                break;
            case "TextScanner":
                return 2;
                break;
            default:
                return null;
                break;
        }
    }
}
