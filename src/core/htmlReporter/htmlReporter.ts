import Q = require("q");

let testContainer = "preamble-test-container";
let configOptions;

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
    createElement(tagName: string) {
        return document.createElement(tagName);
    }
    createTextNode(text: string) {
        return document.createTextNode(text);
    }
    getTestContainer(): HTMLElement {
        return document.getElementById(testContainer);
    }
    getUiTestContainerEl(): HTMLElement {
        return document.getElementById(configOptions.uiTestContainerId);
    }
    reportBegin(confOpts: { uiTestContainerId: string, name: string }) {
        configOptions = confOpts;
    }
    reportSummary(summaryInfo: { totDescribes: number, totExcDescribes: number, totIts: number, totFailedIts: number, totExcIts: number, name: string }) {
        let summary = `<div id="summary">
        <span>${summaryInfo.name}: </span>
        <span style="color: blue;">${summaryInfo.totIts}</span><b> specs</b>,
        <span style="color: blue;">${summaryInfo.totFailedIts}</span><b> failures</b>,
        <span style="color: blue;">${summaryInfo.totExcIts}</span><b> excluded</b>`;
        this.getTestContainer().innerHTML = summary;
    }
}

window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
