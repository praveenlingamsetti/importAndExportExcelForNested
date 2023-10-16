import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function generateAndDownloadExcel() {
  const data = {
    name: "Premium Quality",
    type: "simple",
    regular_price: "21.99",
    description:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
    short_description:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    categories: [
      {
        id: 9,
      },
      {
        id: 14,
      },
    ],
    images: [
      {
        src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_front.jpg",
      },
      {
        src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/stores/2013/06/T_2_back.jpg",
      },
    ],
  };

  // Flatten the nested object
  const flattenData = {
    name: data.name,
    type: data.type,
    regular_price: data.regular_price,
    description: data.description,
    short_description: data.short_description,
    category_ids: data.categories.map((category) => category.id).join(", "),
    image_src: data.images.map((image) => image.src).join(", "),
  };

  // Convert the flattened data to an array of objects
  const dataArray = [flattenData];

  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(dataArray);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ProductData");

  // Generate the Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "productData.xlsx");
}

function App() {
  const [data, setData] = useState([]);

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
      const reconstructedData = dataArray.map((row) => ({
        name: row.name,
        type: row.type,
        regular_price: row.regular_price,
        description: row.description,
        short_description: row.short_description,
        categories: row.category_ids
          .split(", ")
          .map(Number)
          .map((id) => ({ id })),
        images: row.image_src.split(",").map((src) => ({ src })),
      }));
      setData(reconstructedData);
      console.log(reconstructedData); // You can set this data in your state or use it as needed
    };

    reader.readAsArrayBuffer(file);
  }

  return (
    <div>
      <button onClick={generateAndDownloadExcel}>Download Excel</button>
      <br />
      <br />
      <div>
        <input type="file" accept=".xlsx" onChange={importExcelFile} />
      </div>
      {data && <p>{JSON.stringify(data)}</p>}
    </div>
  );
}

export default App;
