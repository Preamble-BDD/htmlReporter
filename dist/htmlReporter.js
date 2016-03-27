"use strict";
var testContainer = "preamble-test-container";
var configOptions;
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
    HtmlReporter.prototype.createElement = function (tagName) {
        return document.createElement(tagName);
    };
    HtmlReporter.prototype.createTextNode = function (text) {
        return document.createTextNode(text);
    };
    HtmlReporter.prototype.getTestContainer = function () {
        return document.getElementById(testContainer);
    };
    HtmlReporter.prototype.getUiTestContainerEl = function () {
        return document.getElementById(configOptions.uiTestContainerId);
    };
    HtmlReporter.prototype.reportBegin = function (confOpts) {
        configOptions = confOpts;
    };
    HtmlReporter.prototype.reportSummary = function (summaryInfo) {
        var summaryEl;
        var textNode;
        var summary = "<div id=\"summary\">Summary: <b>total specs</b>: <span style=\"color: blue;\">" + summaryInfo.totIts + "</span> <b>total exluded specs</b>: <span style=\"color: blue;\">" + summaryInfo.totExcIts + "</span></div>";
        this.getTestContainer().innerHTML = summary;
    };
    return HtmlReporter;
}());
window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());