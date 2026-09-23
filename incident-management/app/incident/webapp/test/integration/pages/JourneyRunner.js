sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"im/incident/test/integration/pages/IncidentsList",
	"im/incident/test/integration/pages/IncidentsObjectPage",
	"im/incident/test/integration/pages/Incidents_conversationObjectPage"
], function (JourneyRunner, IncidentsList, IncidentsObjectPage, Incidents_conversationObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('im/incident') + '/test/flp.html#app-preview',
        pages: {
			onTheIncidentsList: IncidentsList,
			onTheIncidentsObjectPage: IncidentsObjectPage,
			onTheIncidents_conversationObjectPage: Incidents_conversationObjectPage
        },
        async: true
    });

    return runner;
});

