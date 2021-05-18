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
    vendorMenu: (data, vendorid) => {
      let menuitem = `<div class="row row-cols-3">`;
      for (let i = 0; i < data.length; i++) {
        menuitem += `<div class="row">
            <h2 class="foodname" style="width: auto; float: left;">
              &nbsp;${data[i].name}
            </h2>
            <h2 style="width: auto; margin-left: auto; float: right;">${data[i].price}</h2>
            <p style="clear: both;color:rgb(63, 63, 63)">&nbsp;${data[i].description}</p>
            <img src="${data[i].photo}" width="280" height="280">
            <button class="darkButton" onclick="location.href = '/customer/addNewItemInOrder/${data[i]._id}/${vendorid}'">Add to Order</button>
        </div>`;
      }
      return menuitem + `</div>`;
    },
    vendorList: (data) => {
      let vendors = `<div id="vendorList">`;
      for (let i = 0; i < data.length; i++) {
        if (data[i].active) {
          vendors += `<div class="vendor col">
            <div class="colStart title">
                <h2>${data[i].name}</h2>
                <p>${data[i].textlocation}</p>
                <div class="ratingContainer colMiddle">
                    <script type="text/javascript">
                        load_rating('${data[i]._id}');
                    </script>
                    <div id="${data[i]._id}" class="rate"></div>
                </div>
            </div>
            <div class="flex">
                <button class="flexMiddle" onclick="location.href='/vendors/${data[i]._id}'" type="button">View Van Menu</button>
            </div>
        </div>`;
        }
      }
      return vendors + `</div>`;
    },
    priceDisplay: (p) => {
      if (p) {
        p = p.toString();
        p += p.includes(".") ? (p.indexOf(".") + 2 == p.length ? "0" : "") : ".00";
        return p;
      }
      return "";
    },
    popupOrderItems: (orderitems) => {
      let display = "";
      for (let i = 0; i < orderitems.length; i++) {
        let p = orderitems[i].price;
        p = p.toString();
        p += p.includes(".") ? (p.indexOf(".") + 2 == p.length ? "0" : "") : ".00";
        display += `
          <div class="orderItem popupItem colTop">
              <div class="flexBetween stretch">
                  <div class="flex">
                      <span class="badge">${orderitems[i].quantity} x </span>
                      <p>${orderitems[i].name}</p>
                  </div>
                  <div class="flex">
                      <p>$${p}</p>
                  </div>
              </div>
          </div>`;
      }
      return display;
    },
    checkUser: function (isVendor, type_of_user, options) {
      if (isVendor == true) {
        return options.fn(this);
      } else if (type_of_user == "vendor") {
        return options.fn(this);
      }

      return options.inverse(this);
    },

    ifEquals: function (arg1, arg2, options) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
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