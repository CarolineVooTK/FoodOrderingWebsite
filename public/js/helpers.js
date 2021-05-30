const { json } = require("express");

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
      let p = "";
      for (let i = 0; i < data.length; i++) {
        p = "";
        p = data[i].price.toString();
        p += p.includes(".") ? (p.indexOf(".") + 2 == p.length ? "0" : "") : ".00";
        menuitem += `<div class="row">
            <h3 class="foodname" style="width:auto;float:left;margin-bottom:8px;">
              &nbsp;${data[i].name}
            </h3>
            <h5 style="width:auto;margin-left:auto;float:right;margin-bottom:8px;">$${p}</h5>
            <p style="clear: both;color:rgb(63, 63, 63);">&nbsp;${data[i].description}</p>
            <img src="${data[i].photo}" width="200px" height="200px">
            <button class="darkButton" onclick="location.href = '/customer/addNewItemInOrder/${data[i]._id}/${vendorid}'">Add to Order</button>
        </div>`;
      }
      return menuitem + `</div>`;
    },
    singleVendorRatingDisplay: (data) => {
      let ratingDisplay = `<div class="rate"><div class="flex rating">`;
      if (data.rating && data.count && data.rating > 0) {
        let rating = Math.round(data.rating * 2) / 2;
        let flr = Math.floor(data.rating);
        let dec = data.rating;
        if (!dec.toString().includes(".")) {
          dec = dec.toString() + ".0";
        } else {
          dec = dec.toString().slice(0, 4);
        }
        let count = data.count;
        let half = false;
        if (rating > 0) {
          ratingDisplay += `<span>${dec}</span>`;
          ratingDisplay += `<i class="fas fa-star"></i>`.repeat(flr);
          if (rating > flr) {
            ratingDisplay += `<i class="fas fa-star-half-alt"></i>`;
            half = true;
          }
          ratingDisplay += half
            ? `<i class="far fa-star"></i>`.repeat(5 - flr - 1)
            : `<i class="far fa-star"></i>`.repeat(5 - flr);
          ratingDisplay += `<span>(${count})</span></div></div>`;
        }
      } else {
        ratingDisplay += `<p>no reviews</p></div></div>`;
      }
      return ratingDisplay;
    },
    vendorList: (data) => {
      let vendors = `<div id="vendorList">`;
      for (let i = 0; i < data.length; i++) {
        if (data[i].active) {
          vendors += `<div class="vendor col">
            <div class="colStart title">
                <div class="flexBetween stretch"
                  <h2 style="text-transform:uppercase;color:#3df2ff;font-weight:bold;font-size:25px;">${
                    data[i].name
                  }</h2>
                  <div id="${
                    data[i]._id
                  }-distance" class="distance" style="color:white;font-size:18px;">
                  </div>
                </div>
                <p>${data[i].textlocation}</p>
                <div class="ratingContainer colMiddle">
                    ${this.helpers.singleVendorRatingDisplay(data[i])}
                </div>
            </div>
            <div class="flex">
                <button class="flexMiddle" onclick="location.href='/vendors/${
                  data[i]._id
                }'" type="button">View Van Menu</button>
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
    popupOrderItems2: (orderitems, vendor_id) => {
      let display = "";
      for (let i = 0; i < orderitems.length; i++) {
        if (JSON.stringify(orderitems[i].vendorid) != JSON.stringify(vendor_id)) {
          continue;
        }
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
      return JSON.stringify(arg1) == JSON.stringify(arg2)
        ? options.fn(this)
        : options.inverse(this);
    },
    vendorMap: (vendors) => {
      let vMap = `
        <div id="mapid"></div>
        <script type="text/javascript">
          L = window.L;
          let map = L.map("mapid", {
            center: [-37.81, 144.96],
            zoom: 13,
          });
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);
          map.zoomControl.setPosition("topright");
          window.map = map;
          map.locate({ setView: true, watch: true, maxZoom: 16 }).on("locationfound", (e) => {
            icon = L.divIcon({
              html: '<img style="height: 60px" src="/images/location.svg"/>',
            });
            L.marker(([e.latitude, e.longitude]), { icon: icon }).addTo(window.map)
            .bindPopup("<div class='popup'>You are here</div>")
            .openPopup();
            
        `;
      for (var k = 0; k < vendors.length; k++) {
        if (vendors[k].active) {
          vMap += `
        from = turf.point([e.latitude, e.longitude]); // should be location of user
        to = turf.point([${vendors[k].location.coordinates}]);
        distance = Math.round(turf.distance(from, to) * 100) / 100;
        updateVendors({distance: distance, vendorId: "${vendors[k]._id}",});
        `;
        }
      }
      return vMap + `}); </script>`;
    },
    minVendorUrl: () => {
      if (window.minVendor) {
        return window.minVendor[1];
      }
      return "6075878024b5d615b324ee1d";
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
