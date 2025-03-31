class Orders {
  constructor() {
    this._orderId = null;
  }

  // get orderId
  get orderId() {
    return this._orderId;
  }

  //set orderId
  set orderId(value) {
    if (!value) {
      throw new Error("Order id cannot be empty");
    }

    this._orderId = value;
  }
}


module.exports = Orders