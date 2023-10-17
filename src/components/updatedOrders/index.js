import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const generateAndDownloadExcel = () => {
  const data = {
    payment_method: "bacs",
    payment_method_title: "Direct Bank Transfer",
    set_paid: true,
    billing: {
      first_name: "John",
      last_name: "Doe",
      address_1: "969 Market",
      address_2: "",
      city: "San Francisco",
      state: "CA",
      postcode: "94103",
      country: "US",
      email: "john.doe@example.com",
      phone: "(555) 555-5555",
    },
    shipping: {
      first_name: "John",
      last_name: "Doe",
      address_1: "969 Market",
      address_2: "",
      city: "San Francisco",
      state: "CA",
      postcode: "94103",
      country: "US",
    },
    line_items: [
      {
        product_id: 93,
        variation_id: " ",
        quantity: 2,
      },
      {
        product_id: 22,
        variation_id: 23,
        quantity: 1,
      },
    ],
    shipping_lines: [
      {
        method_id: "flat_rate",
        method_title: "Flat Rate",
        total: "10.00",
      },
    ],
  };

  const flattenData = {
    paymentMethod: data.payment_method,
    paymentMethod_title: data.payment_method_title,
    setPaid: data.set_paid,
    billingFirstName: data.billing.first_name,
    billingLastName: data.billing.last_name,
    billingAddressLineOne: data.billing.address_1,
    billingAddressLineTwo: data.billing.address_2,
    billingCity: data.billing.city,
    billingState: data.billing.state,
    billingPostcode: data.billing.postcode,
    billingCountry: data.billing.country,
    shippingFirstName: data.shipping.first_name,
    shippingLastName: data.shipping.last_name,
    shippingAddressLineOne: data.shipping.address_1,
    shippingAddressLineTwo: data.shipping.address_2,
    shippingCity: data.shipping.city,
    shippingState: data.shipping.state,
    shippingPostcode: data.shipping.postcode,
    shippingCountry: data.shipping.country,
    lineItemProductId: data.line_items.map((each) => each.product_id).join(","),
    lineItemQuantity: data.line_items.map((each) => each.quantity).join(","),
    lineItemVariationId: data.line_items
      .map((each) => each.variation_id)
      .join(","),
    shippingLinesMethodId: data.shipping_lines
      .map((each) => each.method_id)
      .join(","),
    shippingLinesTitle: data.shipping_lines
      .map((each) => each.method_title)
      .join(","),
    shippingLinesTotal: data.shipping_lines.map((each) => each.total).join(","),
  };

  const dataArray = [flattenData];
  console.log(dataArray, "ddddd");
  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(dataArray);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "OrdersData");

  // Generate the Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "productData.xlsx");
};

function importExcelFile(event) {
  const file = event.target.files[0];

  if (!file) {
    alert("Please select an Excel file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Assuming that the first sheet contains the data
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the Excel sheet back into an array of objects
    const dataArray = XLSX.utils.sheet_to_json(sheet);

    // Process the data to recreate the original nested object structure
    const reconstructedData = dataArray.map((row) => {
      const lineItems = row.lineItemProductId
        .split(",")
        .map((product_id, index) => ({
          product_id,
          quantity: row.lineItemQuantity.split(",")[index],
          variation_id: row.lineItemVariationId.split(",")[index],
        }));

      const shippingLines = row.shippingLinesMethodId
        .split(",")
        .map((method_id, index) => ({
          method_id,
          method_title: row.shippingLinesTitle.split(",")[index],
          total: row.shippingLinesTotal.split(",")[index],
        }));

      return {
        payment_method: row.paymentMethod,
        payment_method_title: row.paymentMethod_title,
        set_paid: row.setPaid === "true", // Convert to boolean
        billing: {
          first_name: row.billingFirstName,
          last_name: row.billingLastName,
          address_1: row.billingAddressLineOne,
          address_2: row.billingAddressLineTwo,
          city: row.billingCity,
          state: row.billingState,
          postcode: row.billingPostcode,
          country: row.billingCountry,
        },
        shipping: {
          first_name: row.shippingFirstName,
          last_name: row.shippingLastName,
          address_1: row.shippingAddressLineOne,
          address_2: row.shippingAddressLineTwo,
          city: row.shippingCity,
          state: row.shippingState,
          postcode: row.shippingPostcode,
          country: row.shippingCountry,
        },
        line_items: lineItems,
        shipping_lines: shippingLines,
      };
    });

    // You can use `reconstructedData` as needed
    console.log(reconstructedData);
  };

  reader.readAsArrayBuffer(file);
}

const Order = () => {
  return (
    <div className="text-center">
      <h1>orders</h1>
      <br />
      <div>
        <button onClick={generateAndDownloadExcel}>Download Excel</button>
        <br />
        <br />
        <br />
        {/* ... */}
        <input type="file" accept=".xlsx" onChange={importExcelFile} />
        {/* {data && <p>{JSON.stringify(data)}</p>} */}
      </div>
    </div>
  );
};

export default Order;
