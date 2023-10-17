import React from "react";
import Products from "./components/products";

import Order from "./components/updatedOrders";

const App = () => {
  return (
    <div>
      <Order />
      <br />
      <br />
      <div className="text-center">
        <h1>products</h1> <Products />
      </div>
    </div>
  );
};

export default App;
