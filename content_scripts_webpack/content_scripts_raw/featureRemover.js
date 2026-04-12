import {Module} from "./module.js";

/* ================
 *  FeatureRemover
 * ================
 * Class which removes unwanted features from the web page.
 * Code by Andrew Detering
 */

export class FeatureRemover extends Module
{
    constructor()
    {
        super();

        this.STYLE_IDS = {
            base: "fr-hide-base",
            aggressive: "fr-hide-aggressive"
        };

        this.baseCssPath = "content/feature-remover.css";
        this.aggressiveCssPath = "content/aggressive-features.css";

        this.baseCss =

        `
        /* Removes Features by targeting the companies that provide the service */
        iframe[src*="intercom"],
        #intercom-container,
        .intercom-lightweight-app,
        .intercom-launcher {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }


        iframe[src*="drift"],
        #drift-widget,
        .drift-frame-controller {
            display: none !important;
        }


        iframe[src*="zendesk"],
        iframe[src*="zdassets"],
        .zEWidget-launcher {
            display: none !important;
        }


        iframe[src*="tawk.to"] {
            display: none !important;
        }


        iframe[src*="crisp.chat"],
        .crisp-client {
            display: none !important;
        }


        iframe[src*="hubspot"],
        .hs-chat-widget {
            display: none !important;
        }


        iframe[src*="facebook.com/plugins/customerchat"] {
            display: none !important;
        }
        `;

        this.aggressiveCss =

        `
        /* Targets generic naming patterns */
        [class*="chat" i],
        [id*="chat" i],
        [class*="assistant" i],
        [id*="assistant" i],
        [class*="support" i],
        [id*="support" i],
        [class*="widget" i],
        [id*="widget" i] {
            display: none !important;
        }

        /* Targets floating action buttons */
        button[aria-label*="chat" i],
        button[aria-label*="help" i],
        button[aria-label*="support" i] {
            display: none !important;
        }

        /* Targets fixed bottom-right overlays */
        div[style*="position: fixed"][style*="bottom"][style*="right"] {
            display: none !important;
        }
        `;

        this.options = {
            moduleName : "Feature Remover",

            aggressiveEnabled : {
              "type" : "select_exclusive",
              "default" : true,
              "Aggressive Mode" : true,
              "Base Mode" : false
            }
        };
    }

    /* =====================
      Lifecycle Hooks
      ===================== */

    async scanPage()
    {
        console.log("Featureremover Scanpage running.");

        /*
        const stored = await browser.storage.local.get(this.id);

        const settings = stored[this.id];

        if (!settings) return;

        // Base mode
        if (settings.baseEnabled) {
          await this.enableBaseMode();
        } else {
          this.disableBaseMode();
        }
        */

        // Aggressive mode
        if (this.settings.aggressiveEnabled)
        {
            await this.enableAggressiveMode();
            this.disableBaseMode();
        }
        else
        {
            await this.enableBaseMode();
            this.disableAggressiveMode();
        }
    }

    disable()
    {
        this.disableBaseMode();
        this.disableAggressiveMode();
    }

    /* =====================
      Feature Modes
      ===================== */

    async enableBaseMode()
    {
        await this.#injectFromAttr(
            this.baseCss,
            this.STYLE_IDS.base
        );
    }

    disableBaseMode()
    {
        this.#removeStyle(this.STYLE_IDS.base);
    }

    async enableAggressiveMode()
    {
        await this.#injectFromAttr(
            this.aggressiveCss,
            this.STYLE_IDS.aggressive
        );
    }

    disableAggressiveMode()
    {
        this.#removeStyle(this.STYLE_IDS.aggressive);
    }

    /* =====================
      Internals
      ===================== */

    async #injectFromFile(path, styleId)
    {
        if (document.getElementById(styleId)) return;

        try
        {
            const url = browser.runtime.getURL(path);
            const res = await fetch(url);
            const css = await res.text();

            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = css;

            document.documentElement.appendChild(style);
        }
        catch (e)
        {
            console.error("FeatureRemover CSS injection failed:", e);
        }
    }

    async #injectFromAttr(css, styleId)
    {
        if (document.getElementById(styleId)) return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = css;

        document.documentElement.appendChild(style);
    }

    #removeStyle(styleId)
    {
        const el = document.getElementById(styleId);
        if (el) el.remove();
    }
}
