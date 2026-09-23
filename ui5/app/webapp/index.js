// sap.ui.define([

// ],function(){
//     "use strict";

//     alert("UI5 is ready to go!")
// })

//alert("UIS is ready ")


// sap.ui.define([
//     "sap/m/Text",
//     "sap/m/Button",
//     "sap/m/CheckBox",
//     "sap/m/Switch"
// ], function (Text, Button , CheckBox , Switch) {
//     "use strict";

//     new Text({
//         text: "Hello World"
//     }).placeAt("content");

//     new Button({
//         text: "Click Me"
//     }).placeAt("content");

//     new CheckBox({
//       text:"Male"
//     }).placeAt("content");

//     new Switch({
//       state:true,
//       customTextOn:"ON",
//       customTextOff:"OFF"
//     }).placeAt("content");
// });


sap.ui.define(["sap/ui/core/mvc/XMLView"], function (XMLView) {
  "use strict";

  XMLView.create({
    viewName: "ui5.walkthrough.view.App",
    id: "app"
  }).then(function (view) {
    view.placeAt("content");
  });
});