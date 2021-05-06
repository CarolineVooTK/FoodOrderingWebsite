const myapi = require("../../routes/api");

let register = (Handlebars) => {
  let helpers = {
    listfood : function (data){
      var ret = "<ul>";

      for (var i = 0, j = data.length; i < j; i ++){
        ret = ret + "<li>"
        "<img src ="+ data[i].photo +"</a>"
        +"<a>"+ data[i].name +"</a>"
        +"<a>"+ data[i].price + "</a>"
        +"<a>"+ data[i].description + "</a>"
      }
      return ret + "</ul>"
    },
  };

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
