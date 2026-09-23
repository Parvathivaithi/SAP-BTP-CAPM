sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"dealer/test/integration/pages/vehiclesList",
	"dealer/test/integration/pages/vehiclesObjectPage"
], function (JourneyRunner, vehiclesList, vehiclesObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('dealer') + '/test/flp.html#app-preview',
        pages: {
			onThevehiclesList: vehiclesList,
			onThevehiclesObjectPage: vehiclesObjectPage
        },
        async: true
    });

    return runner;
});

