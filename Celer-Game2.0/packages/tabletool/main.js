"use strict";
let tableTool = require("./table/index");
module.exports = {
  load() {},

  unload() {},

  messages: {
    openTableToolPanel() {
      Editor.Panel.open("tabletool-table");
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
  },
};
