sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"fa/fiori/test/integration/pages/customersList",
	"fa/fiori/test/integration/pages/customersObjectPage"
], function (JourneyRunner, customersList, customersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('fa/fiori') + '/test/flp.html#app-preview',
        pages: {
			onThecustomersList: customersList,
			onThecustomersObjectPage: customersObjectPage
        },
        async: true
    });

    return runner;
});

