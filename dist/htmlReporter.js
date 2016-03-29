"use strict";
var testContainerId = "preamble-test-container";
var summaryContainerId = "preamble-summary";
var summaryStatsId = "preamble-summary-stats";
var summaryDurationId = "preamble-summary-duration";
var configOptions;
var createElement = function (tagName) {
    return document.createElement(tagName);
};
var createTextNode = function (text) {
    return document.createTextNode(text);
};
var getBody = function () {
    return document.body;
};
var getElementByTagName = function (tagName) {
    return document.getElementsByTagName(tagName);
};
var getElementById = function (id) {
    return document.getElementById(id);
};
var getTestContainer = function () {
    return getElementById(testContainerId);
};
var getSummaryContainer = function () {
    return getElementById(summaryContainerId);
};
var getUiTestContainerEl = function () {
    return getElementById(configOptions.uiTestContainerId);
};
var specId = function (id) {
    return "spec_" + id;
};
var HtmlReporter = (function () {
    function HtmlReporter() {
        this.onErrorFnPrev = window.onerror;
        window.onerror = this.onError;
    }
    HtmlReporter.prototype.onError = function (errorMessage, url, lineno) {
        var ret = false;
        console.log("Uncaught exception caught...");
        if (this.onErrorFnPrev) {
            ret = this.onErrorFnPrev(errorMessage, url, lineno);
        }
        if (ret !== true) {
        }
        return false;
    };
    HtmlReporter.prototype.reportBegin = function (confOpts) {
        configOptions = confOpts;
        getBody().style.margin = "0";
        getTestContainer().style.fontFamily = "sans-serif";
    };
    HtmlReporter.prototype.reportSummary = function (summaryInfo) {
        var duration = parseInt((summaryInfo.totTime / 1000).toString()) + "." + summaryInfo.totTime % 1000;
        var summaryElId = summaryContainerId;
        var summaryEl = getElementById(summaryElId);
        var summaryStatsEl;
        var summaryDurationEl;
        var summaryHtml;
        if (!summaryEl) {
            summaryHtml = "<div id=\"" + summaryContainerId + "\" style=\"overflow: hidden; padding: .25em .5em; color: white; background-color: blue;\"><span id=\"preamble-summary-stats\"></span><span id=\"preamble-summary-duration\" style=\"float: right; display: none;\"></span></div>";
            getTestContainer().insertAdjacentHTML("afterbegin", summaryHtml);
            summaryEl = getElementById(summaryElId);
        }
        summaryEl.style.backgroundColor = summaryInfo.totIts && summaryInfo.totFailedIts && "red" || summaryInfo.totIts && "green" || "blue";
        summaryStatsEl = getElementById(summaryStatsId);
        summaryStatsEl.innerHTML = "<span>" + summaryInfo.name + ": </span> <span style=\"color: white;\">" + summaryInfo.totIts + "</span><b> specs</b>, <span style=\"color: white;\">" + summaryInfo.totFailedIts + "</span><b> failures</b>, <span style=\"color: white;\">" + summaryInfo.totExcIts + "</span><b> excluded</b>";
        summaryDurationEl = getElementById(summaryDurationId);
        summaryDurationEl.innerHTML = "<span style=\"font-size: .75em;\">completed in " + duration + "s </span>";
        summaryDurationEl.style.display = summaryInfo.totTime && "block" || "none";
    };
    HtmlReporter.prototype.reportSpec = function (it) {
        var parents = [];
        var parent = it.parent;
        var pHtml;
        while (parent) {
            parents.unshift(parent);
            parent = parent.parent;
        }
        if (parents.length) {
            parents.forEach(function (p) {
                var pEl = getElementById(specId(p.id));
                var pParent;
                if (!pEl) {
                    pHtml = "<ul><li id=\"" + specId(p.id) + "\">" + p.label + "</li></ul>";
                    if (p.parent) {
                        getElementById(specId(p.parent.id)).insertAdjacentHTML("beforeend", pHtml);
                    }
                    else {
                        getTestContainer().insertAdjacentHTML("beforeend", pHtml);
                    }
                }
            });
        }
    };
    return HtmlReporter;
}());
window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
