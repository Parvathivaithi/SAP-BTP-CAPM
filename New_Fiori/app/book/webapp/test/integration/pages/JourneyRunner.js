sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"bs/book/test/integration/pages/customersList",
	"bs/book/test/integration/pages/customersObjectPage",
	"bs/book/test/integration/pages/ordersObjectPage"
], function (JourneyRunner, customersList, customersObjectPage, ordersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('bs/book') + '/test/flp.html#app-preview',
        pages: {
			onThecustomersList: customersList,
			onThecustomersObjectPage: customersObjectPage,
			onTheordersObjectPage: ordersObjectPage
        },
        async: true
    });

    return runner;
});

