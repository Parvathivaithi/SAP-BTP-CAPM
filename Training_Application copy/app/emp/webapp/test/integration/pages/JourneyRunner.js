sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"ea/emp/test/integration/pages/employeeList",
	"ea/emp/test/integration/pages/employeeObjectPage",
	"ea/emp/test/integration/pages/EnrollmentsObjectPage"
], function (JourneyRunner, employeeList, employeeObjectPage, EnrollmentsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('ea/emp') + '/test/flp.html#app-preview',
        pages: {
			onTheemployeeList: employeeList,
			onTheemployeeObjectPage: employeeObjectPage,
			onTheEnrollmentsObjectPage: EnrollmentsObjectPage
        },
        async: true
    });

    return runner;
});

