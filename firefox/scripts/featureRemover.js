/* ================
 *  FeatureRemover
 * ================
 * Class which removes unwanted features from the web page.
 */
class FeatureRemover extends Module {
  constructor() {
    super("feature-remover");

    this.STYLE_IDS = {
      base: "fr-hide-base",
      aggressive: "fr-hide-aggressive"
    };

    this.baseCssPath = "content/feature-remover.css";
    this.aggressiveCssPath = "content/aggressive-features.css";
  }

  /* =====================
     Lifecycle Hooks
     ===================== */

  async enable() {
    const stored = await browser.storage.local.get(this.id);

    const settings = stored[this.id];

    if (!settings) return;

    // Base mode
    if (settings.baseEnabled) {
      await this.enableBaseMode();
    } else {
      this.disableBaseMode();
    }

    // Aggressive mode
    if (settings.aggressiveEnabled) {
      await this.enableAggressiveMode();
    } else {
      this.disableAggressiveMode();
    }
  }

  disable() {
    this.disableBaseMode();
    this.disableAggressiveMode();
  }

  /* =====================
     Feature Modes
     ===================== */

  async enableBaseMode() {
    await this.#injectFromFile(
      this.baseCssPath,
      this.STYLE_IDS.base
    );
  }

  disableBaseMode() {
    this.#removeStyle(this.STYLE_IDS.base);
  }

  async enableAggressiveMode() {
    await this.#injectFromFile(
      this.aggressiveCssPath,
      this.STYLE_IDS.aggressive
    );
  }

  disableAggressiveMode() {
    this.#removeStyle(this.STYLE_IDS.aggressive);
  }

  /* =====================
     Internals
     ===================== */

  async #injectFromFile(path, styleId) {
    if (document.getElementById(styleId)) return;

    try {
      const url = browser.runtime.getURL(path);
      const res = await fetch(url);
      const css = await res.text();

      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = css;

      document.documentElement.appendChild(style);
    } catch (e) {
      console.error("FeatureRemover CSS injection failed:", e);
    }
  }

  #removeStyle(styleId) {
    const el = document.getElementById(styleId);
    if (el) el.remove();
  }
}
