import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

function generateAndDownloadOrderExcel(data) {
  const flattenData = {
    payment_method: data.payment_method,
    payment_method_title: data.payment_method_title,
    set_paid: data.set_paid,
    billing_first_name: data.billing.first_name,
    billing_last_name: data.billing.last_name,
    billing_address_1: data.billing.address_1,
    billing_address_2: data.billing.address_2,
    billing_city: data.billing.city,
    billing_state: data.billing.state,
    billing_postcode: data.billing.postcode,
    billing_country: data.billing.country,
    billing_email: data.billing.email,
    billing_phone: data.billing.phone,
    shipping_first_name: data.shipping.first_name,
    shipping_last_name: data.shipping.last_name,
    shipping_address_1: data.shipping.address_1,
    shipping_address_2: data.shipping.address_2,
    shipping_city: data.shipping.city,
    shipping_state: data.shipping.state,
    shipping_postcode: data.shipping.postcode,
    shipping_country: data.shipping.country,
  };

  const dataArray = [flattenData];
  const ws = XLSX.utils.json_to_sheet(dataArray);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "OrderData");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "orderData.xlsx");
}

function importOrderData(file) {
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
    const reconstructedData = dataArray.map((row) => ({
      payment_method: row.payment_method,
      payment_method_title: row.payment_method_title,
      set_paid: row.set_paid,
      billing: {
        first_name: row.billing_first_name,
        last_name: row.billing_last_name,
        address_1: row.billing_address_1,
        address_2: row.billing_address_2,
        city: row.billing_city,
        state: row.billing_state,
        postcode: row.billing_postcode,
        country: row.billing_country,
        email: row.billing_email,
        phone: row.billing_phone,
      },
      shipping: {
        first_name: row.shipping_first_name,
        last_name: row.shipping_last_name,
        address_1: row.shipping_address_1,
        address_2: row.shipping_address_2,
        city: row.shipping_city,
        state: row.shipping_state,
        postcode: row.shipping_postcode,
        country: row.shipping_country,
      },
    }));

    // Use the reconstructed data as needed
    console.log(reconstructedData);
  };

  reader.readAsArrayBuffer(file);
}

function importExcelFile(event) {
  const file = event.target.files[0];

  if (!file) {
    alert("Please select an Excel file.");
    return;
  }

  importOrderData(file);
}

function OrderComponent() {
  return (
    <div>
      {/* Display your order data here */}
      <button onClick={() => generateAndDownloadOrderExcel(data)}>
        Download Excel
      </button>
      <br />
      <br />
      <div>
        {/* ... */}
        <input type="file" accept=".xlsx" onChange={importExcelFile} />
        {/* {data && <p>{JSON.stringify(data)}</p>} */}
      </div>
    </div>
  );
}

export default OrderComponent;
