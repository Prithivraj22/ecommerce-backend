const authlist = require("./controller");

module.exports = function (app) {
  app.route("/create").get(authlist.getUsers).post(authlist.createUsers);
  app.route("/login").post(authlist.login);
  app.route("/search").get(authlist.getSearchHistoryList).post(authlist.createSearchHistory);
  app.route("/items").get(authlist.getItems).post(authlist.createItem); 
  app.route("/cart")
    .post(authlist.addToCart);
  app.route('/cart/:user').get(authlist.getCart).post(authlist.removeFromCart);
};

