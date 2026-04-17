import {Module} from "./module.js";

/* ================
 *  FeatureRemover
 * ================
 * Class which removes unwanted features from the web page.
 */

export class FeatureRemover extends Module
{
    constructor()
    {
        super();

        this.STYLE_IDS = {
            base: "fr-hide-base",
            aggressive: "fr-hide-aggressive",
            ai: "fr-hide-ai-overview"
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

        this.aiCss =
        `
        /* =========================
           GOOGLE AI OVERVIEW
           ========================= */

        [jsname="txosbe"].OZ9ddf.WAUd4,
        .OZ9ddf.WAUd4,
        .s7d4ef,
        [data-container-id="content-placeholder"],
        [data-container-id="model-response-placeholder"],
        [data-subtree="aimc"],
        .scm-c,
        .pOOWX,
        .CKgc1d[data-scope-id="turn"],
        .FkX2oe,
        .pWvJNd,
        .srG4Pb,
        .jKhXsc.notranslate,
        [data-xid="aim-aside-initial-corroboration-container"] {
            display: none !important;
            visibility: hidden !important;
        }

        /* =========================
           BING / COPILOT
           ========================= */

        #b_sydConvCont,
        #b_sydConvMsgCont,
        #b_sydWelcomeTemplate,
        .cib-serp-main,
        .cib-serp,
        #b_results > li.b_ans,
        #b_results .b_ans {
            display: none !important;
            visibility: hidden !important;
        }

        /* =========================
           DUCKDUCKGO AI
           ========================= */

        li.L6fj2A3X2mfJl5kE8caF,
        a[href*="ia=chat"]{
            display: none !important;
            visibility: hidden !important;
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

            aiRemovalEnabled : {
                "type" : "select_exclusive",
                "default" : true,
                "Enabled" : true,
                "Disabled" : false
            }
        };

        this.aiObserver = null;
        this.aiRetryTimer = null;
        this.aiRafId = null;
        this.aiEnabled = false;
    }

    /* =====================
      Lifecycle Hooks
      ===================== */

    async scanPage()
    {
        console.log("Featureremover Scanpage running.");

        if (this.settings.aiRemovalEnabled)
        {
            await this.enableAiRemoval();
        }
        else
        {
            this.disableAiRemoval();
        }

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
        this.disableAiRemoval();
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
       AI Removal
       ===================== */

    async enableAiRemoval()
    {
        this.aiEnabled = true;

        /*
        await this.#injectFromAttr(
            this.aiCss,
            this.STYLE_IDS.ai
        );
        */

        this.#startAiObserver();
        this.#startAiSweep();
        this.#removeAiElements();
    }

    disableAiRemoval()
    {
        this.aiEnabled = false;

        this.#removeStyle(this.STYLE_IDS.ai);

        if (this.aiObserver)
        {
            this.aiObserver.disconnect();
            this.aiObserver = null;
        }

        if (this.aiRetryTimer)
        {
            clearInterval(this.aiRetryTimer);
            this.aiRetryTimer = null;
        }

        if (this.aiRafId)
        {
            cancelAnimationFrame(this.aiRafId);
            this.aiRafId = null;
        }
    }

    /* =====================
      Internals
      ===================== */

    #startAiObserver()
    {
        if (this.aiObserver) return;

        const startObserving = () =>
        {
            if (this.aiObserver) return;

            const target = document.documentElement;
            if (!target) return;

            this.aiObserver = new MutationObserver(() =>
            {
                if (!this.aiEnabled) return;
                this.#removeAiElements();
            });

            this.aiObserver.observe(target, {
                childList: true,
                subtree: true,
                attributes: true
            });

            this.#removeAiElements();
        };

        startObserving();

        document.addEventListener(
            "DOMContentLoaded",
            () =>
            {
                if (this.aiEnabled)
                {
                    this.#removeAiElements();
                }
            },
            { once: true }
        );

        window.addEventListener(
            "load",
            () =>
            {
                if (this.aiEnabled)
                {
                    this.#removeAiElements();
                }
            },
            { once: true }
        );
    }

    #startAiSweep()
    {
        if (this.aiRetryTimer)
        {
            clearInterval(this.aiRetryTimer);
            this.aiRetryTimer = null;
        }

        if (this.aiRafId)
        {
            cancelAnimationFrame(this.aiRafId);
            this.aiRafId = null;
        }

        this.aiRetryTimer = setInterval(() =>
        {
            if (!this.aiEnabled) return;
            this.#removeAiElements();
        }, 250);

        const rafSweep = () =>
        {
            if (!this.aiEnabled)
            {
                this.aiRafId = null;
                return;
            }

            this.#removeAiElements();
            this.aiRafId = requestAnimationFrame(rafSweep);
        };

        this.aiRafId = requestAnimationFrame(rafSweep);
    }

    #removeAiElements()
    {
        //console.log("Entered removeAiElements");

        const removeIfConnected = (el) =>
        {
            if (el && el.isConnected)
            {
                el.remove();
                return true;
            }
            return false;
        };

        const hideIfConnected = (el) =>
        {
            if (!el || !el.isConnected) return false;

            el.style.setProperty("display", "none", "important");
            el.style.setProperty("visibility", "hidden", "important");
            el.style.setProperty("max-height", "0", "important");
            el.style.setProperty("overflow", "hidden", "important");

            return true;
        };

        const getText = (el) =>
        {
            return (el?.innerText || el?.textContent || "").toLowerCase().trim();
        };

        const hasAiText = (el) =>
        {
            const text = getText(el);

            return (
                text.includes("ai overview") ||
                text.includes("an ai overview is not available for this search") ||
                text.includes("can't generate an ai overview right now") ||
                text.includes("dive deeper in ai mode") ||
                text.includes("ai can make mistakes, so double-check responses") ||
                text.includes("overview generated") ||
                text.includes("generative ai")
            );
        };

        const getGoogleRemovalTarget = (el) =>
        {
            if (!el) return null;

            return (
                el.closest('[data-container-id="content-placeholder"]') ||
                el.closest('[data-container-id="model-response-placeholder"]') ||
                el.closest('[data-subtree="aimc"]') ||
                el.closest('.scm-c') ||
                el.closest('.pOOWX') ||
                el.closest('.CKgc1d[data-scope-id="turn"]') ||
                el.closest('.FkX2oe') ||
                el.closest('.pWvJNd') ||
                el.closest('.RJPOee.mNfcNd') ||
                el.closest('.s7d4ef') ||
                el.closest('.OZ9ddf.WAUd4') ||
                el
            );
        };

        /* =========================
           GOOGLE - DIRECT STRUCTURAL TARGETS
           ========================= */

        const googleStructuralSelectors = [
            '[data-container-id="content-placeholder"]',
            '[data-container-id="model-response-placeholder"]',
            '[data-subtree="aimc"]',
            '.scm-c',
            '.pOOWX',
            '.CKgc1d[data-scope-id="turn"]',
            '.FkX2oe',
            '.pWvJNd',
            '.RJPOee.mNfcNd',
            '.s7d4ef',
            '[jsname="txosbe"].OZ9ddf.WAUd4',
            '.OZ9ddf.WAUd4',
            '.srG4Pb',
            '.jKhXsc.notranslate',
            '[data-xid="aim-aside-initial-corroboration-container"]',
            '.h7Tj7e',
            '[class~="YNk70c EjQTId"]'
        ];

        if (window.location.href.includes("google.com"))
        {
            console.log("ENTERED: google.com");

            googleStructuralSelectors.forEach(selector =>
            {
                document.querySelectorAll(selector).forEach(el =>
                {
                    const target = getGoogleRemovalTarget(el);
                    if (!removeIfConnected(target))
                    {
                        hideIfConnected(target);
                    }
                });
            });

            /* =========================
             * GOOGLE - HEADING / TEXT ANCHORED REMOVAL
             * ========================= */

            document.querySelectorAll('div, span, h1, h2, h3, section, article').forEach(el =>
            {
                if (!el || !el.isConnected) return;
                if (!hasAiText(el)) return;

                const target = getGoogleRemovalTarget(el);

                if (!removeIfConnected(target))
                {
                    hideIfConnected(target);
                }
            });

            /* =========================
             * GOOGLE - SPECIAL CASE:
             * VISIBLE "AI Overview" HEADING
             * ========================= */

            document.querySelectorAll('[role="heading"], div, span').forEach(el =>
            {
                if (!el || !el.isConnected) return;

                const text = getText(el);
                if (text !== "ai overview") return;

                const target = getGoogleRemovalTarget(el);

                if (!removeIfConnected(target))
                {
                    hideIfConnected(target);
                }
            });

            /* =========================
             * GOOGLE - SHADOW DOM
             * ========================= */

            document.querySelectorAll('*').forEach(host =>
            {
                if (!host.shadowRoot) return;

                try
                {
                    host.shadowRoot.querySelectorAll('div, span, section, article, h1, h2, h3').forEach(el =>
                    {
                        if (!hasAiText(el)) return;

                        removeIfConnected(host);
                        hideIfConnected(host);
                    });
                }
                catch (e)
                {
                    /* Ignore inaccessible shadow roots */
                }
            });
        }

        /* =========================
           BING COPILOT
           ========================= */

        const bingSelectors = [
            '#b_sydConvCont',
            '#b_sydConvMsgCont',
            '#b_sydWelcomeTemplate',
            '.cib-serp-main',
            '.cib-serp',
            '#b_results > li.b_ans',
            '#b_results .b_ans'
        ];

        if (window.location.href.includes("bing.com"))
        {
            console.log("ENTERED: bing.com");

            bingSelectors.forEach(selector =>
            {
                document.querySelectorAll(selector).forEach(el =>
                {
                    if (!removeIfConnected(el))
                    {
                        hideIfConnected(el);
                    }
                });
            });

            document.querySelectorAll('div, section, aside').forEach(el =>
            {
                if (!el || !el.isConnected) return;

                const text = getText(el);

                if (
                    text.includes("copilot") ||
                    text.includes("ask copilot") ||
                    text.includes("ai-generated") ||
                    text.includes("deep search")
                )
                {
                    const target =
                    el.closest('#b_sydConvCont') ||
                    el.closest('#b_sydConvMsgCont') ||
                    el.closest('.cib-serp-main') ||
                    el.closest('.cib-serp') ||
                    el.closest('#b_results > li.b_ans') ||
                    el.closest('#b_results .b_ans') ||
                    el;

                    if (!removeIfConnected(target))
                    {
                        hideIfConnected(target);
                    }
                }
            });
        }

        /* =========================
           DUCKDUCKGO AI
           ========================= */

        const ddgSelectors = [
            //'[data-testid*="ai"]',
            //'section[data-area*="ai"]',
            'li.L6fj2A3X2mfJl5kE8caF',
            'a[href*="ia=chat"]'
        ];


        if (window.location.href.includes("duckduckgo.com"))
        {
            console.log("ENTERED: duckduckgo.com");

            ddgSelectors.forEach(selector =>
            {
                document.querySelectorAll(selector).forEach(el =>
                {
                    console.log("AI thing found: ", el);

                    if (!removeIfConnected(el))
                    {
                        hideIfConnected(el);
                    }
                });
            });
        }
    }

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
