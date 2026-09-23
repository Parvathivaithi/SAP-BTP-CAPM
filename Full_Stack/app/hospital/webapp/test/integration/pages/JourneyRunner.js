sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"hm/hospital/test/integration/pages/hospitalList",
	"hm/hospital/test/integration/pages/hospitalObjectPage",
	"hm/hospital/test/integration/pages/departmentObjectPage"
], function (JourneyRunner, hospitalList, hospitalObjectPage, departmentObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('hm/hospital') + '/test/flp.html#app-preview',
        pages: {
			onThehospitalList: hospitalList,
			onThehospitalObjectPage: hospitalObjectPage,
			onThedepartmentObjectPage: departmentObjectPage
        },
        async: true
    });

    return runner;
});

