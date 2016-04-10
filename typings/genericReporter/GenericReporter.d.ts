/**
 * Generic type definitions for a generic reporter implementations.
 */

declare interface ConfigOptions {
    version: string;
    name: string;
    uiTestContainerId: string;
    hidePassedTests: boolean;
}

declare interface TimeKeeper {
    startTime: number;
    endTime: number;
    totTime: number;
}

declare interface QueueManagerStats {
    totDescribes: number;
    totExcDescribes: number;
    totIts: number;
    totExcIts: number;
    totFailedIts: number;
    timeKeeper: TimeKeeper;
}

declare interface INote {
    it: IIt;
    apiName: string;
    expectedValue: any;
    matcherValue: any;
    result: boolean;
    exception?: Error;
}

declare interface Reason {
    reason: string;
    stackTrace: string[];
}


// /* Describes an It object */
declare interface IIt {
    parent: IDescribe;
    id: string;
    label: string;
    excluded: boolean;
    // scope: {};
    // callback: () => void;
    // timeoutInterval: number;
    expectations: INote[];
    passed: boolean;
    reasons: Reason[];
    callStack: string[];
}

// /* Describes a BeforeEach and AfterEach object */
// declare interface IPrePostTest {
//     id: string;
//     label: string;
//     scope: {};
//     callback: (done: () => void) => void;
// }

/* Describes a Describe object */
declare interface IDescribe {
    id: string;
    label: string;
    excluded: boolean;
    // context: {};
    // callback: () => void;
    // beforeEach: BeforeEach;
    // afterEach: AfterEach;
    parent: IDescribe;
    passed: boolean;
}

// /* Describes a type that can be either a BeforeEach or an AfterEach object */
// // declare type mix = IDescribe | IPrePostTest | IIt;
//
// /* Describes the summary information passed to implementation */
// declare interface ISummaryInfo {
//     totalPassedSpecs: number;
//     totalFailedSpecs: number;
//     totalExcludedSpecs: number; // via xit
// }
//
// /* Describe the reporting data passed to implementation */
// declare interface IReportData {
//     testSuiteTitle: string; // default or user configured test suite title
//     preambleVersion: string; // major.minor.point, e.g. v4.0.5
//     completedTime: number; // time to complete all suites in miliseconds
//     summaryInfo?: ISummaryInfo; // summary information
//     spec?: IDescribe; // parent Describe object
// }
//
/* Describes the interface that every Reporter must implement */
declare interface IReporter {
    reportSpec: (it: IIt) => void;
    reportBegin: (configOptions: { uiTestContainerId: string, name: string, hidePassedTests: boolean }) => void;
    onErrorFnPrev: (errMessage: string, url: string, lineno: string) => boolean;
    onError: (errMessage: string, url: string, lineno: string) => boolean;
}
//
// /**
//  * Implementation specific declarations
//  * Needs to be separated out into its own d.ts file.
//  */
//
/* Describe Reporter's constructor */
declare function HtmlReporter(): IReporter;
//
// declare function describe(label: string, callback: () => void);
