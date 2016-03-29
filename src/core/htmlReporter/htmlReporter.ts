import Q = require("q");

let testContainerId = "preamble-test-container";
let summaryContainerId = "preamble-summary";
let summaryStatsId = "preamble-summary-stats";
let summaryDurationId = "preamble-summary-duration";
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
    return getElementById(testContainerId);
};

let getSummaryContainer = (): HTMLElement => {
    return getElementById(summaryContainerId);
};

let getUiTestContainerEl = (): HTMLElement => {
    return getElementById(configOptions.uiTestContainerId);
};

let specId = (id: string): string => {
    return `spec_${id}`;
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
        let summaryElId = summaryContainerId;
        let summaryEl = getElementById(summaryElId);
        let summaryStatsEl;
        let summaryDurationEl;
        let summaryHtml;
        if (!summaryEl) {
            summaryHtml = `<div id="${summaryContainerId}" style="overflow: hidden; padding: .25em .5em; color: white; background-color: blue;"><span id="preamble-summary-stats"></span><span id="preamble-summary-duration" style="float: right; display: none;"></span></div>`;
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
    reportSpec(it: IIt): void {
        let parents: IDescribe[] = [];
        let parent: IDescribe = it.parent;
        let pHtml: string;
        while (parent) {
            parents.unshift(parent);
            parent = parent.parent;
        }
        if (parents.length) {
            parents.forEach((p) => {
                let pEl = getElementById(specId(p.id));
                let pParent: IDescribe;
                if (!pEl) {
                    pHtml = `<ul><li id="${specId(p.id)}">${p.label}</li></ul>`;
                    if (p.parent) {
                        getElementById(specId(p.parent.id)).insertAdjacentHTML("beforeend", pHtml);
                    } else {
                        // getTestContainer().insertAdjacentHTML("afterbegin", pHtml);
                        getTestContainer().insertAdjacentHTML("beforeend", pHtml);
                    }
                }
            });
        }
        // else {
        //     pHtml = `<ul><li id="${specId(it.parent.id)}">${it.parent.label}</li></ul>`;
        //     getSummaryContainer().insertAdjacentHTML("afterend", pHtml);
        // }
    }
}

window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
