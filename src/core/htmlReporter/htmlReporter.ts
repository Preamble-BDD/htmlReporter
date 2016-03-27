import Q = require("q");

let testContainer = "preamble-test-container";
let configOptions;

let createElement = (tagName: string) => {
    return document.createElement(tagName);
};

let createTextNode = (text: string) => {
    return document.createTextNode(text);
};

let getElementById = (id: string) => {
    return document.getElementById(id);
};

let getTestContainer = (): HTMLElement => {
    return document.getElementById(testContainer);
};

let getUiTestContainerEl = (): HTMLElement => {
    return document.getElementById(configOptions.uiTestContainerId);
};

class HtmlReporter implements IReporter {
    onErrorFnPrev;
    summaryInfo;
    constructor() {
        // Save reference to current window.onerror handler
        this.onErrorFnPrev = window.onerror;
        // Assign our own window.onerror handler
        window.onerror = this.onError;
    }
    onError(errorMessage, url, lineno): boolean {
        let ret: boolean = false;
        console.log("Uncaught exception caught...");
        // Call the previous window.onerror handler
        if (this.onErrorFnPrev) {
            ret = this.onErrorFnPrev(errorMessage, url, lineno);
        }
        // Only report the error if uncaught error handling isn't suppressed
        if (ret !== true) {
            // show the error in the report
        }
        return false;

    }
    reportBegin(confOpts: { uiTestContainerId: string, name: string }) {
        configOptions = confOpts;
    }
    reportSummary(summaryInfo: { totDescribes: number, totExcDescribes: number, totIts: number, totFailedIts: number, totExcIts: number, name: string }) {
        let summaryEl = getElementById("preamble-summary");
        if (!summaryEl) {
            summaryEl = createElement("div");
            summaryEl.setAttribute("id", "preamble-summary");
            summaryEl.style.height = "1.5em";
            summaryEl.style.lineHeight = "1.5em";
            summaryEl.style.marginBottom = "auto";
            summaryEl.style.backgroundColor = "blue";
            summaryEl.style.color = "white";
            getTestContainer().insertAdjacentElement("afterbegin", summaryEl);
        }
        summaryEl.innerHTML = `<span>${summaryInfo.name}: </span> <span style="color: white;">${summaryInfo.totIts}</span><b> specs</b>, <span style="color: white;">${summaryInfo.totFailedIts}</span><b> failures</b>, <span style="color: white;">${summaryInfo.totExcIts}</span><b> excluded</b>`;
    }
}

window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
