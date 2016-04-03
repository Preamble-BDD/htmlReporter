import Q = require("q");

let testContainerId = "preamble-test-container";
let summaryContainerId = "preamble-summary";
let summaryStatsId = "preamble-summary-stats";
let summaryDurationId = "preamble-summary-duration";
let configOptions: ConfigOptions;

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

let id = (id: string): string => {
    return `spec_${id}`;
};

let color = (item: IIt | IDescribe): string => {
    if (item.excluded) {
        return "brown";
    }
    if (item.passed) {
        return "auto";
    }
    return "red";
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
    reportBegin(confOpts: ConfigOptions) {
        configOptions = confOpts;
        getBody().style.margin = "52px 0 0 0"; // margin-top is set to 2 x height of summary container
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
            summaryHtml = `<div id="${summaryContainerId}" style="box-sizing: border-box; position: fixed; top: 0; width: 100%; overflow: hidden; padding: .25em .5em; color: white; background-color: blue;"><span id="preamble-summary-stats"></span><span id="preamble-summary-duration" style="float: right; display: none;"></span></div>`;
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
        let html: string;
        let htmlStackTrace: string[];
        while (parent) {
            parents.unshift(parent);
            parent = parent.parent;
        }
        if (parents.length) {
            parents.forEach((p) => {
                let pEl = getElementById(id(p.id));
                let pParent: IDescribe;
                if (!pEl) {
                    if (it.passed && configOptions.hidePassedTests) {
                        html = `<ul style="display: none;"><li id="${id(p.id)}"><span style="color: ${color(p)}">${p.label}</span></li></ul>`;
                    } else {
                        html = `<ul><li id="${id(p.id)}"><span style="color: ${color(p)}">${p.label}</span></li></ul>`;
                    }
                    if (p.parent) {
                        getElementById(id(p.parent.id)).insertAdjacentHTML("beforeend", html);
                    } else {
                        // getTestContainer().insertAdjacentHTML("afterbegin", html);
                        getTestContainer().insertAdjacentHTML("beforeend", html);
                    }
                }
            });
            if (it.passed && configOptions.hidePassedTests) {
                html = `<ul style="display: none;"><li id="${id(it.id)}"><span style="color: ${color(it)}">${it.label}</span></li></ul>`;
            } else {
                html = `<ul><li id="${id(it.id)}"><span style="color: ${color(it)}">${it.label}</span></li></ul>`;
            }
            getElementById(id(it.parent.id)).insertAdjacentHTML("beforeend", html);
            // show why the spec failed
            if (!it.passed) {
                it.reasons.forEach((reason) => {
                    html = `<ul><li id="${id(it.id)}-reason"><span style="color: ${color(it)}">${reason.reason}</span></li></ul>`;
                    getElementById(id(it.id)).insertAdjacentHTML("beforeend", html);
                    html = `<ul id="${id(it.id)}-reason-stack-trace"></ul>`;
                    getElementById(`${id(it.id)}-reason`).insertAdjacentHTML("beforeend", html);
                    reason.stackTrace.forEach((stackTrace) => {
                        html = `<li id="${id(it.id)}-reason-stack-trace-item"><span style="color: ${color(it)}">${stackTrace}</span></li>`;
                        getElementById(`${id(it.id)}-reason-stack-trace`).insertAdjacentHTML("beforeend", html);
                    });
                });
            }
        }
    }
}

window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
