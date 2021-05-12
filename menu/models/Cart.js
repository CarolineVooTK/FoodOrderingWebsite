module.exports = function Cart(originCart) {
  this.items = originCart.items || {};
  this.totalQuantity = originCart.totalQuantity || 0;
  this.totalPrice = originCart.totalPrice || 0;

  this.add = function (item, id) {
    var storedItem = this.items[id];
    // if the item added is not in the cart, we create a new one
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQuantity++;
    this.totalPrice += storedItem.item.price;

    // the bottom lines can be in the handlebars
    // return message stating that already achieve 3 items stop adding
    if (this.totalQuantity == 3) {
      res.render("Already achive maximum number of items");
      // directing to the checkout page when there are 3 items added
      res.redirect("/checkout");
    }
  };

  // give cart items as an array
  this.generateArray = function () {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
