// TODO(js): debating removing Q as it doesn't have to be used so far.
import Q = require("q");

let testContainerId = "preamble-test-container";
let summaryContainerId = "preamble-summary";
let summaryStatsId = "preamble-summary-stats";
let summaryDurationId = "preamble-summary-duration";
let configOptions: ConfigOptions;
let filtered: boolean = false;

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
    let loc = window.location;
    let i = loc.href.indexOf("?");
    let url = i && loc.href.substring(0, i) || loc.href;
    url += `?filter=${id(item)}`;
    let notExcluded = `<a href="${url}"><span>${item.label}</span></a>`;
    let excluded = `<span>${item.label}</span>`;
    return item.excluded && excluded || notExcluded;
};

let runAll = (): string => {
    let loc = window.location;
    let i = loc.href.indexOf("?");
    let url = i && loc.href.substring(0, i) || loc.href;
    let ret = "";
    if (filtered) {
        ret = ` - <a class="runall" href="${url}">run all</a>`;
    }
    return ret;
};

let pluralize = (word: string, count: number): string => (count > 1 || !count) && word + "s" || word;

// TODO(js): report apis should use promises!!!!
class HtmlReporter implements Reporter {
    onErrorFnPrev;
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
        filtered = !!window.location.search.length;
        getTestContainer().insertAdjacentHTML("beforeend",
            `<footer>Preamble v${confOpts.version}</footer>`);
    }
    reportSummary(summaryInfo: QueueManagerStats) {
        let duration = `${parseInt((summaryInfo.timeKeeper.totTime / 1000).toString())}.${summaryInfo.timeKeeper.totTime % 1000}`;
        let summaryElId = summaryContainerId;
        let summaryEl = getElementById(summaryElId);
        let summaryStatsEl;
        let summaryDurationEl;
        let summaryHtml;
        if (!summaryEl) {
            summaryHtml = `<div class="preamble-summary preamble-summary-hidden"
                id="${summaryContainerId}"><span id="preamble-summary-stats"></span>
                <span class="preamble-summary-duration preamble-summary-duration-hidden"
                id="preamble-summary-duration"></span></div>`;
            getTestContainer().insertAdjacentHTML("afterbegin", summaryHtml);
            summaryEl = getElementById(summaryElId);
        }
        summaryEl.className = summaryInfo.totIts && summaryInfo.totFailedIts &&
            "preamble-summary preamble-summary-fail" ||
            summaryInfo.totIts &&
            "preamble-summary preamble-summary-pass" ||
            "preamble-summary preamble-summary-pending";
        summaryStatsEl = getElementById(summaryStatsId);
        summaryStatsEl.innerHTML = `<span>${configOptions.name}: </span> <span>${summaryInfo.totIts}</span><b> ${pluralize("spec", summaryInfo.totIts)}</b>, `;
        summaryStatsEl.innerHTML = summaryInfo.hasOwnProperty("totFiltered")
            && summaryStatsEl.innerHTML + `<span>${summaryInfo.totFiltered}</span>
            <b> filtered</b>, ` || summaryStatsEl.innerHTML;
        summaryStatsEl.innerHTML += `<span>${summaryInfo.totFailedIts}</span>
            <b> ${pluralize("failure", summaryInfo.totFailedIts)}</b>, <span>${summaryInfo.totExcIts}</span><b> excluded</b>
            <span><b> ${runAll()}</b></span>`;
        summaryDurationEl = getElementById(summaryDurationId);
        summaryDurationEl.innerHTML = `<span>completed in ${duration}s </span>`;
        summaryDurationEl.className = summaryInfo.timeKeeper.totTime === 0 &&
            "preamble-summary-duration preamble-summary-duration-hidden" ||
            "preamble-summary-duration";
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
        html = `<ul class="${cssClass(it, "spec")}">
            <li id="${id(it)}">${wrapWithAnchor(it)}</li></ul>`;
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
                    html = `<li class="reason-stacktrace-item"
                        id="${id(it)}-reason-stacktrace-item"><span>${stackTrace}</span></li>`;
                    getElementById(`${id(it)}-reason-stacktrace-${reasonNumber}`).insertAdjacentHTML("beforeend", html);
                });
            });
        }
    }
    reportEnd(): void {}
}

window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
