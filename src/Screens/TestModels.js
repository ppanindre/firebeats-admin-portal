// src/TestModels.js
import React, { useState } from 'react';
import { db } from '../App';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import * as XLSX from 'xlsx';

const TestModels = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    try {
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Assuming the first sheet is the one you want to read
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet data to JSON format
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Upload the data to Firestore
        await uploadDataToFirestore(jsonData);

        alert('Data uploaded successfully!');
      };

      fileReader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error handling file:', error);

      alert('Error handling file. Please try again.');
    }
  };
  const uploadDataToFirestore = async ( data) => {
    console.log(data);      
    const userId = "P4S9DTgsnnVto4CH2EZWgg80Um22"

    try {
      // Get today's date as a string (e.g., '2023-11-16')
      let todayDate = new Date().toISOString().split('T')[0];
      todayDate = `${todayDate}-${"apple"}`

      // Construct the path for the 'details' document inside the 'intraday' collection
      const detailsDocumentPath = `user/${userId}/heartRatesec/${todayDate}`;

      // Create a new document called 'details' inside the 'intraday' collection
      const detailsDocRef = await setDoc(doc(db, detailsDocumentPath), { heartRateData: data });

      alert('Data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading data to Firestore:', error);
      alert('Error uploading data to Firestore. Please try again.');
    }
  };
  

  return (
    <div>
      <h2>Test Models</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default TestModels;
