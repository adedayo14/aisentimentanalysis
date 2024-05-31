import React, { useState, useCallback } from 'react';
import FileUploadModal from './FileUploadModal';

const InputSection = ({ setInputs, inputs }) => {
  const [inputText, setInputText] = useState("");
  const [showInputField, setShowInputField] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleFileUpload = useCallback((results) => {
    const data = hasHeader ? results.data.slice(1) : results.data;
    const newInputs = data.map((row) => row[0]).slice(0, 50 - inputs.length);
    setInputs(prev => [...prev, ...newInputs]);
    setShowModal(false);
  }, [hasHeader, setInputs, inputs.length]);

  const addInput = useCallback(() => {
    if (inputText.trim() !== "") {
      setInputs(prev => {
        const updatedInputs = [...prev, inputText];
        return updatedInputs.slice(0, 50);
      });
      setInputText("");
      setShowInputField(false);
    }
  }, [inputText, setInputs]);

  const removeInput = useCallback((index) => {
    setInputs(prev => prev.filter((_, i) => i !== index));
  }, [setInputs]);

  return (
    <div className="p-4 border rounded-lg shadow-md space-y-2 h-full w-full overflow-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold uppercase">INPUT</h3>
        <button onClick={() => setShowModal(true)} className="text-black flex items-center space-x-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" style={{ color: 'black' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>
          <span>Upload a file</span>
        </button>
      </div>
      {showModal && (
        <FileUploadModal
          onFileUpload={handleFileUpload}
          hasHeader={hasHeader}
          setHasHeader={setHasHeader}
          title="Upload Sentences"
          description="Add your data using a .csv file. The file must have one column: examples."
          closeModal={() => setShowModal(false)}
        />
      )}
      <ul className="space-y-2">
        {inputs.map((input, index) => (
          <li key={index} className="flex justify-between items-center p-2 rounded border border-gray-300">
            <div className="flex items-center space-x-2 text-sm">
              <button onClick={() => removeInput(index)} className="text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <span>{index + 1}.</span>
              <span>{input}</span>
            </div>
          </li>
        ))}
      </ul>
      {showInputField && (
        <div className="flex space-x-4">
          <input
            className="flex-grow p-2 border border-gray-300 rounded-lg text-sm"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your input here..."
            style={{ width: '50%' }}
          />
          <button onClick={addInput} className="bg-black text-white px-4 py-2 rounded text-sm">Add Input</button>
        </div>
      )}
      {!showInputField && (
        <button onClick={() => setShowInputField(true)} className="text-black flex items-center space-x-2 mt-4 text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Add input</span>
        </button>
      )}
    </div>
  );
};

export default InputSection;
