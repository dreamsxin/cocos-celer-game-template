"use strict";
let tableTool = require("./table/index");

exports.methods = {
  log() {
    console.log("Hello World");
  },
  openTableToolPanel() {
    Editor.Panel.open("tabletool.table");
  },

  openPolygonToolPanel() {
    Editor.Ipc.sendToAll("start-gen-polygon");
  },

  openTableHelpPanel() {
    Editor.Panel.open("tabletool-help");
  },

  startTranTable(sender, ...args) {
    tableTool.start(args[0][0], args[0][1]);
  },
};
// 当扩展被启动的时候执行
exports.load = function () {
  console.log("table tool loaded.");
};

// 当扩展被关闭的时候执行
exports.unload = function () {
  console.log("table tool unload.");
};
