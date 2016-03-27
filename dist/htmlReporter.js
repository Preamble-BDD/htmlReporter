"use strict";
var testContainer = "preamble-test-container";
var configOptions;
var createElement = function (tagName) {
    return document.createElement(tagName);
};
var createTextNode = function (text) {
    return document.createTextNode(text);
};
var getElementById = function (id) {
    return document.getElementById(id);
};
var getTestContainer = function () {
    return document.getElementById(testContainer);
};
var getUiTestContainerEl = function () {
    return document.getElementById(configOptions.uiTestContainerId);
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
    };
    HtmlReporter.prototype.reportSummary = function (summaryInfo) {
        var summaryEl = getElementById("preamble-summary");
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
        summaryEl.innerHTML = "<span>" + summaryInfo.name + ": </span> <span style=\"color: white;\">" + summaryInfo.totIts + "</span><b> specs</b>, <span style=\"color: white;\">" + summaryInfo.totFailedIts + "</span><b> failures</b>, <span style=\"color: white;\">" + summaryInfo.totExcIts + "</span><b> excluded</b>";
    };
    return HtmlReporter;
}());
window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
