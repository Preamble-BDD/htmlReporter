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
    reportSummary(summaryInfo: { totDescribes: number, totExcDescribes: number, totIts: number, totExcIts: number }) {
        let summaryEl: HTMLElement;
        let textNode;
        let summary = `<div id="summary">Summary: <b>total specs</b>: <span style="color: blue;">${summaryInfo.totIts}</span> <b>total exluded specs</b>: <span style="color: blue;">${summaryInfo.totExcIts}</span></div>`;
        // summaryEl = this.createElement("div");
        // textNode = this.createTextNode(`Summary: total specs: ${summaryInfo.totIts} total exluded specs: ${summaryInfo.totExcIts}`);
        // summaryEl.appendChild(textNode);
        this.getTestContainer().innerHTML = summary;
    }
}

window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
