sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"ta/training/test/integration/pages/EnrollmentsList",
	"ta/training/test/integration/pages/EnrollmentsObjectPage",
	"ta/training/test/integration/pages/traineeAssObjectPage"
], function (JourneyRunner, EnrollmentsList, EnrollmentsObjectPage, traineeAssObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('ta/training') + '/test/flp.html#app-preview',
        pages: {
			onTheEnrollmentsList: EnrollmentsList,
			onTheEnrollmentsObjectPage: EnrollmentsObjectPage,
			onThetraineeAssObjectPage: traineeAssObjectPage
        },
        async: true
    });

    return runner;
});

