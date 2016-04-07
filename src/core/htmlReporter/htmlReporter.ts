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

let id = (item: IIt | IDescribe): string => {
    return `${(<Object>item).hasOwnProperty("expectations") && "spec" || "suite"}_${item.id}`;
};

let cssClass = (item: IIt | IDescribe, isA: string): string => {
    let clazz = isA;
    if (item.excluded) {
        clazz += ` ${isA}-excluded`;
        if (configOptions.hidePassedTests) {
            clazz += ` ${isA}-hidden`;
        }
    } else if (item.passed) {
        clazz += ` ${isA}-passed`;
        if (configOptions.hidePassedTests) {
            clazz += ` ${isA}-hidden`;
        }
    } else {
        clazz += ` ${isA}-failed`;
    }
    return clazz;
};

let wrapWithAnchor = (item: IIt | IDescribe): string => {
    let notExcluded = `<a href="#${id(item)}" onclick="window.location.hash = '#${id(item)}'; window.location.reload();"><span>${item.label}</span></a>`;
    let excluded = `<span>${item.label}</span>`;
    return item.excluded && excluded || notExcluded;
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
            summaryHtml = `<div class="preamble-summary preamble-summary-hidden" id="${summaryContainerId}"><span id="preamble-summary-stats"></span><span class="preamble-summary-duration preamble-summary-duration-hidden" id="preamble-summary-duration"></span></div>`;
            getTestContainer().insertAdjacentHTML("afterbegin", summaryHtml);
            summaryEl = getElementById(summaryElId);
        }
        summaryEl.className = summaryInfo.totIts && summaryInfo.totFailedIts && "preamble-summary preamble-summary-fail" || summaryInfo.totIts && "preamble-summary preamble-summary-pass" || "preamble-summary preamble-summary-pending";
        summaryStatsEl = getElementById(summaryStatsId);
        summaryStatsEl.innerHTML = `<span>${summaryInfo.name}: </span> <span>${summaryInfo.totIts}</span><b> specs</b>, <span>${summaryInfo.totFailedIts}</span><b> failures</b>, <span>${summaryInfo.totExcIts}</span><b> excluded</b>`;
        summaryDurationEl = getElementById(summaryDurationId);
        summaryDurationEl.innerHTML = `<span>completed in ${duration}s </span>`;
        summaryDurationEl.className = summaryInfo.totTime === 0 && "preamble-summary-duration preamble-summary-duration-hidden" || "preamble-summary-duration";
    }
    reportSpec(it: IIt): void {
        let parents: IDescribe[] = [];
        let parent: IDescribe = it.parent;
        let html: string;
        let htmlStackTrace: string[];
        let reasonNumber: number;
        while (parent) {
            parents.unshift(parent);
            parent = parent.parent;
        }
        parents.forEach((p) => {
            let pEl = getElementById(id(p));
            let pParent: IDescribe;
            if (!pEl) {
                html = `<ul class="${cssClass(p, "suite")}"><li id="${id(p)}">${wrapWithAnchor(p)}</li></ul>`;
                if (p.parent) {
                    getElementById(id(p.parent)).insertAdjacentHTML("beforeend", html);
                } else {
                    getTestContainer().insertAdjacentHTML("beforeend", html);
                }
            }
        });
        html = `<ul class="${cssClass(it, "spec")}"><li id="${id(it)}">${wrapWithAnchor(it)}</li></ul>`;
        getElementById(id(it.parent)).insertAdjacentHTML("beforeend", html);
        // show why the spec failed
        if (!it.passed) {
            reasonNumber = 0;
            it.reasons.forEach((reason) => {
                reasonNumber++;
                html = `<ul class="reason"><li id="${id(it)}-reason-${reasonNumber}"><span>${reason.reason}</span></li></ul>`;
                getElementById(id(it)).insertAdjacentHTML("beforeend", html);
                html = `<ul class="reason-stacktrace" id="${id(it)}-reason-stacktrace-${reasonNumber}"></ul>`;
                getElementById(`${id(it)}-reason-${reasonNumber}`).insertAdjacentHTML("beforeend", html);
                reason.stackTrace.forEach((stackTrace) => {
                    html = `<li class="reason-stacktrace-item" id="${id(it)}-reason-stacktrace-item"><span>${stackTrace}</span></li>`;
                    getElementById(`${id(it)}-reason-stacktrace-${reasonNumber}`).insertAdjacentHTML("beforeend", html);
                });
            });
        }
    }
}

window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
