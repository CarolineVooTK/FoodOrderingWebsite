const myapi = require("../../routes/api");

let register = (Handlebars) => {
  let helpers = {};

  if (
    Handlebars &&
    (typeof Handlebars.registerHelper === "function" ||
      typeof Handlebars.registerHelper === "AsyncFunction")
  ) {
    for (let prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    return helpers;
  }
};

module.exports.register = register;
module.exports.helpers = register(null);
