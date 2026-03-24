/* ================
 *  FeatureRemover
 * ================
 * Class which removes unwanted features from the web page.
 */

class FeatureRemover extends Module
{
    constructor()
    {
        super();

        this.STYLE_IDS = {
            base: "fr-hide-base",
            aggressive: "fr-hide-aggressive",

            /* AI Overview style */
            ai: "fr-hide-ai-overview"
        };

        this.baseCssPath = "content/feature-remover.css";
        this.aggressiveCssPath = "content/aggressive-features.css";

        this.baseCss =

`
        /* Removes Features by targeting providers */
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

        /* Floating buttons */
        button[aria-label*="chat" i],
        button[aria-label*="help" i],
        button[aria-label*="support" i] {
            display: none !important;
        }

        /* Fixed overlays */
        div[style*="position: fixed"][style*="bottom"][style*="right"] {
            display: none !important;
        }
`;

        /* =====================
           AI Overview CSS
           ===================== */

        this.aiOverviewCss =

`
        /* =====================
           Google AI Overview Parent Block
           ===================== */

        /* Remove entire AI result container */

        #search div.bzXtMb.M8OgIe.dRpWwb {
            display: none !important;
        }

        /* Inner AI container */

        #search div[jscontroller="AkrxPe"],
        #search div[data-trnct="true"] {
            display: none !important;
        }

        /* Bing Copilot */

        #b_sydConvCont,
        #b_sydSmplConv {
            display: none !important;
        }

        /* DuckDuckGo AI */

        div[data-testid*="ai" i] {
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
            },

            /* Independent AI Toggle */

            aiOverviewEnabled : {
                "type" : "checkbox",
                "default" : true,
                "AI Overview Removal" : true
            }
        };
    }

    /* =====================
      Lifecycle Hooks
      ===================== */

    async scanPage()
    {
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

        /* AI Overview Mode */

        if (this.settings.aiOverviewEnabled)
        {
            await this.enableAiOverviewMode();
        }
        else
        {
            this.disableAiOverviewMode();
        }
    }

    disable()
    {
        this.disableBaseMode();
        this.disableAggressiveMode();
        this.disableAiOverviewMode();
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
       AI Overview Mode
       ===================== */

    async enableAiOverviewMode()
    {
        if (!this.#isSearchEngine()) return;

        await this.#injectFromAttr(
            this.aiOverviewCss,
            this.STYLE_IDS.ai
        );

        this.#startAiObserver();
    }

    disableAiOverviewMode()
    {
        this.#removeStyle(this.STYLE_IDS.ai);

        if (this.aiObserver)
        {
            this.aiObserver.disconnect();
            this.aiObserver = null;
        }
    }

    /* =====================
      Search Engine Detection
      ===================== */

    #isSearchEngine()
    {
        const host = location.hostname;

        return host.includes("google.")
            || host.includes("bing.")
            || host.includes("duckduckgo.");
    }

    /* =====================
      AI Removal Observer
      ===================== */

    #startAiObserver()
    {
        if (this.aiObserver) return;

        const selectors = [

            /* Google AI parent container */

            '#search div.bzXtMb.M8OgIe.dRpWwb',

            /* Google AI inner containers */

            '#search div[jscontroller="AkrxPe"]',
            '#search div[data-trnct="true"]',

            /* Bing */

            '#b_sydConvCont',
            '#b_sydSmplConv',

            /* DuckDuckGo */

            'div[data-testid*="ai"]'
        ];

        const removeAiElements = () =>
        {
            selectors.forEach(sel =>
            {
                document.querySelectorAll(sel)
                .forEach(el =>
                {
                    /* Remove full AI block */

                    const resultBlock =
                        el.closest('.bzXtMb.M8OgIe.dRpWwb');

                    if (resultBlock)
                    {
                        resultBlock.remove();
                    }
                    else
                    {
                        el.remove();
                    }
                });
            });
        };

        this.aiObserver =
            new MutationObserver(() =>
        {
            removeAiElements();
        });

        this.aiObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        removeAiElements();
    }

    /* =====================
      Internals
      ===================== */

    async #injectFromAttr(css, styleId)
    {
        if (document.getElementById(styleId)) return;

        const style =
            document.createElement("style");

        style.id = styleId;
        style.textContent = css;

        document.documentElement
            .appendChild(style);
    }

    #removeStyle(styleId)
    {
        const el =
            document.getElementById(styleId);

        if (el) el.remove();
    }
}