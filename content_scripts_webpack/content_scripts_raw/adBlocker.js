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

// This file contains the AdBlocker class, which is used to remove or hide
// elements flagged as advertisements from web pages.
// Code by Kelowna Ngoyi

import {Module} from "./module.js";

/* ===========
 *  AdBlocker
 * ===========
 * Module which hides advertisements in a web page.
 */
export class AdBlocker extends Module
{
    constructor()
    {
        super();
        
        this.options =
        {
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
        }
    }

    scanPage()
    {
        if (this._running) return;
        this._running = true;

        // Make sure settings are enabled and valid
        if (!this.settings || !this.settings.enabled) {
            this._running = false;
            return;
        }

        const blockEverything = this.settings.blockAll;
        // Popup ads
        if (blockEverything || this.settings.blockPopups) {
            const popupSelectors = [
                "iframe[src*='popup']",
                "img[src*='popup']",
                "div[class*='popup']",
                "div[class*='modal']",
                "div[class*='overlay']",
                "div[class*='dialog']",
                "div[role='dialog']",
                "[aria-modal='true']",
                "div[class*='subscribe']",
                "div[class*='newsletter']"
            ]

            popupSelectors.forEach((selector) => {
                document.querySelectorAll(selector).forEach(element => {
                    this.hideElement(element);
                });
            });
        }

        //Banner ads
        if (blockEverything || this.settings.blockBanners) {
            const bannerSelectors = [
                // Define a list of common ad related selectors
                // Might miss some ads, but should catch most
                "iframe[src*='ads']",
                "iframe[src*='doubleclick']",
                "iframe[src*='googlesyndication']",
                "iframe[src*='adservice']",
                "[class*='ad-']",
                "[class*='ads']",
                "[class*='advert']",
                "[class*='sponsor']",
                "img[src*='ads']",
                "img[src*='doubleclick']",
                "img[src*='googlesyndication']",
                "img[src*='simgad']",
                "img[src*='adservice']",
                "[data-ad]",
                "section[class*='sponsor']",
            ];
            
            // Iterate through each selector and hide matching elements
            bannerSelectors.forEach((selector) => {
                document.querySelectorAll(selector).forEach(element => {
                    this.hideElement(element);
                });
            });
        }
        
        // Mutation Observer to detect dynamically loaded ads
        if (!this._observer) {
            this._observer = new MutationObserver(() => {
                this.scanPage();
            });

            this._observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        this._running = false;
    }

    hideElement(element)
    {
        element.style.display = "none";

        // Highlight ads for testing purposes
        /*
        if (element.dataset.secondGlanceBlocked) return;

        element.dataset.secondGlanceBlocked = "true";

        element.style.outline = "4px solid red";
        element.style.backgroundColor= "rgba(255, 0, 0, 0.2)";
        */
    }
}
