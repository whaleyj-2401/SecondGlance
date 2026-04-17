// Configuration file for Webpack
// Written with the help of the documentation at webpack.js.org

import webpack from "webpack";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

export default {
    entry : [
        "./content_scripts_raw/textScanningModel.js",
        "./content_scripts_raw/module.js",
        "./content_scripts_raw/adBlocker.js",
        "./content_scripts_raw/featureRemover.js",
        "./content_scripts_raw/textScanner.js",
        "./content_scripts_raw/moduleFactory.js",
        "./content_scripts_raw/main.js",
    ],

    output : {
        filename : "contentScriptBundle.js",

    },

    mode : "production",

    externals : {
        browser : true,
    },

    resolve : {

        fallback : {
            "fs" : false,
            "os" : require.resolve("os-browserify/browser"),
            "util" : require.resolve("util"),
        }
    },

    plugins : [
        new webpack.ProvidePlugin({
            process : "process/browser",
        }),
    ],

    target : "web",

};
