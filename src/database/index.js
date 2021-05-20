const Enmap = require("enmap");

module.exports = {
  settings: new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: "deep",
  }),
  debug: function () {
    return this.settings;
  },
};
