import Q = require("q");

let testContainer = "preamble-test-container";
let configOptions;

let createElement = (tagName: string): HTMLElement => {
    return document.createElement(tagName);
};

let createTextNode = (text: string): Text => {
    return document.createTextNode(text);
};

let getBody = (): HTMLElement => {
    return document.body;
};

let getElementByTagName = (tagName: string): NodeList => {
    return document.getElementsByTagName(tagName);
};

let getElementById = (id: string): HTMLElement => {
    return document.getElementById(id);
};

let getTestContainer = (): HTMLElement => {
    return document.getElementById(testContainer);
};

let getUiTestContainerEl = (): HTMLElement => {
    return document.getElementById(configOptions.uiTestContainerId);
};

// TODO(js): report apis should use promises!!!!
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
            // TODO(js): show the error in the report
        }
        return false;

    }
    reportBegin(confOpts: { uiTestContainerId: string, name: string }) {
        configOptions = confOpts;
        getBody().style.margin = "0";
        getTestContainer().style.fontFamily = "sans-serif";
    }
    reportSummary(summaryInfo: {
        totDescribes: number, totExcDescribes: number, totIts: number,
        totFailedIts: number, totExcIts: number, name: string, totTime: number
    }) {
        let duration = `${parseInt((summaryInfo.totTime / 1000).toString())}.${summaryInfo.totTime % 1000}`;
        let summaryElId = "preamble-summary";
        let summaryStatsId = "preamble-summary-stats";
        let summaryDurationId = "preamble-summary-duration";
        let summaryEl = getElementById(summaryElId);
        let summaryStatsEl;
        let summaryDurationEl;
        let summaryHtml;
        if (!summaryEl) {
            summaryHtml = `<div id="preamble-summary" style="overflow: hidden; padding: .25em .5em; color: white; background-color: blue;"><span id="preamble-summary-stats"></span><span id="preamble-summary-duration" style="float: right; display: none;"></span></div>`;
            getTestContainer().insertAdjacentHTML("afterbegin", summaryHtml);
            summaryEl = getElementById(summaryElId);
        }
        summaryEl.style.backgroundColor = summaryInfo.totIts && summaryInfo.totFailedIts && "red" || summaryInfo.totIts && "green" || "blue";
        summaryStatsEl = getElementById(summaryStatsId);
        summaryStatsEl.innerHTML = `<span>${summaryInfo.name}: </span> <span style="color: white;">${summaryInfo.totIts}</span><b> specs</b>, <span style="color: white;">${summaryInfo.totFailedIts}</span><b> failures</b>, <span style="color: white;">${summaryInfo.totExcIts}</span><b> excluded</b>`;
        summaryDurationEl = getElementById(summaryDurationId);
        summaryDurationEl.innerHTML = `<span style="font-size: .75em;">completed in ${duration}s </span>`;
        summaryDurationEl.style.display = summaryInfo.totTime && "block" || "none";
    }
}

window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
