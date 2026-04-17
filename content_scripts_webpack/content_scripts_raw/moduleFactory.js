import {AdBlocker} from "./adBlocker.js";
import {FeatureRemover} from "./featureRemover.js";
import {TextScanner} from "./textScanner.js";

/* ===============
 *  ModuleFactory
 * ===============
 * Objects of this class are responsible for instantiating subclasses of the
 * "Module" class. Does this by mapping numbers to each subclass.
 * Code by James Whaley
 */

export class ModuleFactory
{
    constructor()
    {
        // Attribute which represents total module count.
        // Must be increased if new modules are added.
        this.maxModules = 3;
    }

    getMaxModules()
    {
        return this.maxModules;
    }

    // createModule
    // Function which takes a number and produces the corresponding module.
    // Returns null if invalid number is given.
    createModule(moduleNo)
    {
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
        let module;

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

        return module.getOptions();
    }

    getModuleNo(moduleName)
    {
        switch(moduleName)
        {
            case "Ad Blocker":
                return 0;
                break;
            case "Feature Remover":
                return 1;
                break;
            case "Text Scanner":
                return 2;
                break;
            default:
                return null;
                break;
        }
    }

    getModuleName(moduleNo)
    {
        let module;
        let name;

        switch(moduleNo)
        {
            case 0:
                module = new AdBlocker();
                name = module.getOptions().moduleName;
                break;
            case 1:
                module = new FeatureRemover();
                name = module.getOptions().moduleName;
                break;
            case 2:
                module = new TextScanner();
                name = module.getOptions().moduleName;
                break;
            default:
                return null;
                break;


        }

        return name;
    }
}
