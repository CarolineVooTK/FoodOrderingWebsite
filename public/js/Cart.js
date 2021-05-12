function Cart(originCart) {
  this.items = originCart.items || {};
  this.totalQuantity = originCart.totalQuantity || 0;
  this.totalPrice = originCart.totalPrice || 0;

  this.add = function (item, id, price) {
    var storedItem = this.items[id];
    // if the item added is not in the cart, we create a new one
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, quantity: 0, price: price };
    }
    storedItem.quantity++;
    storedItem.price = storedItem.price * storedItem.quantity;
    this.totalQuantity++;
    this.totalPrice += storedItem.price;
  };

  // give cart items as an array
  this.generateArray = function () {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
}

module.exports = Cart;
