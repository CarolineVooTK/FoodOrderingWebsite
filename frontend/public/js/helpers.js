const myapi = require("../../routes/api");

let register = (Handlebars) => {
  let helpers = {
    listfood: function (data) {
      var ret = "<ul>";

      for (var i = 0, j = data.length; i < j; i++) {
        ret = ret + "<li>";
        "<img src =" +
          data[i].photo +
          "</a>" +
          "<a>" +
          data[i].name +
          "</a>" +
          "<a>" +
          data[i].price +
          "</a>" +
          "<a>" +
          data[i].description +
          "</a>";
      }
      return ret + "</ul>";
    },
    vendorMenu: (data) => {
      let menuitem = `<div class="row row-cols-3">`;
      for (let i = 0; i < data.length; i++) {
        menuitem += `<div class="row">
            <h2 class="foodname" style="width: auto; float: left;">
                <a href="/menu/${data[i]._id}">
                    &nbsp;${data[i].name}
                </a>
            </h2>
            <h2 style="width: auto; margin-left: auto; float: right;">${data[i].price}</h2>
            <p style="clear: both;color:rgb(63, 63, 63)">&nbsp;${data[i].description}</p>
            <img src="${data[i].photo}" width="280" height="280">
            <button class="darkButton" onclick="location.href = '/orders/addNewItemInOrder/${data[i]._id}'">Add to Order</button>
        </div>`;
      }
      return menuitem + `</div>`;
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
