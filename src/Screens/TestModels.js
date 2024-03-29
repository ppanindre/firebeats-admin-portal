// src/TestModels.js
import React, { useState } from "react";
import { db } from "../App";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import * as XLSX from "xlsx";

const TestModels = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary", cellDates: true });

        // Assuming the first sheet is the one you want to read
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet data to JSON format
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          raw: false,
          dateNF: "hh:mm:ss", // Date format for timestamp columns
          cellDates: true,
          rawNumbers: true,
        });
        // Upload the data to Firestore
        const numericData = jsonData.map((row) => ({
          time: row.time,
          value: parseInt(row.value, 10), // Convert 'value' to an integer
        }));

        // Upload the data to Firestore
        await uploadDataToFirestore(numericData, "heartRatesec");
        // await uploadDataToFirestore(jsonData);

        alert("Data uploaded successfully!");
      };

      fileReader.readAsBinaryString(file);
    } catch (error) {
      console.error("Error handling file:", error);

      alert("Error handling file. Please try again.");
    }
  };

  const handleUploadSleep = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary", cellDates: true });

        // Assuming the first sheet is the one you want to read
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet data to JSON format
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          raw: false,
          dateNF: "hh:mm:ss", // Date format for timestamp columns
          cellDates: true,
          rawNumbers: true,
        });
        // Upload the data to Firestore
        const numericData = jsonData.map((row) => ({
          duration: parseInt(row.duration, 10),
          sleepType: parseInt(row.sleepType, 10), // Convert 'value' to an integer
          time: row.time,
        }));

        // Upload the data to Firestore
        await uploadDataToFirestore(numericData, "sleep");
        // await uploadDataToFirestore(jsonData);

        alert("Data uploaded successfully!");
      };

      fileReader.readAsBinaryString(file);
    } catch (error) {
      console.error("Error handling file:", error);

      alert("Error handling file. Please try again.");
    }
  };
  const uploadDataToFirestore = async (data, type) => {
    console.log(data);
    const userId = "pbk9PftEdVVbpc10ymEeR6wgXao2";

    try {
      // Get today's date as a string (e.g., '2023-11-16')
      let todayDate = new Date().toISOString().split("T")[0];
      todayDate = `${todayDate}-${"apple"}`;

      // Construct the path for the 'details' document inside the 'intraday' collection
      const detailsDocumentPath = `user/${userId}/heartRate/${todayDate}/intraday/details`;
      const detailsDocumentPathForSleep = `user/${userId}/sleep/${todayDate}`;

      // Create a new document called 'details' inside the 'intraday' collection

      if (type === "sleep") {
        const detailsDocRef = await setDoc(doc(db, detailsDocumentPathForSleep), {
          details: data,
        });
      } else if (type === "heartRatesec") {
        const detailsDocRef = await setDoc(doc(db, detailsDocumentPath), {
          heartRateData: data,
        });
      }


      alert("Data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading data to Firestore:", error);
      alert("Error uploading data to Firestore. Please try again.");
    }
  };

  return (
    <div>
      <h2>Test Models</h2>
      <h2>Heart Rates</h2>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <h2>Sleep Data</h2>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUploadSleep}>Upload</button>
    </div>


  );
};

export default TestModels;
