export const $ = (selector) => {
    const el = document.querySelector(selector);
    if (!el) {
        throw new Error(`Element not found: ${selector}`);
    }
    return el;
};
