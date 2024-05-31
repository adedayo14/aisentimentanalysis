//app/components/FileUpload.js

import React from 'react';
import { useCSVReader } from 'react-papaparse';

const FileUpload = ({ onFileUpload, hasHeader, setHasHeader, title }) => {
  const { CSVReader } = useCSVReader();

  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-semibold uppercase">{title}</h3>
      <div className="flex items-center space-x-4">
        <CSVReader onUploadAccepted={onFileUpload}>
          {({ getRootProps, ProgressBar }) => (
            <div className="flex items-center space-x-2">
              <button {...getRootProps()} className="flex items-center space-x-1 text-black-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" style={{ color: 'black' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>
                <span>Upload a file</span>
              </button>
              <ProgressBar className="mt-2" />
            </div>
          )}
        </CSVReader>
        <div className="flex items-center space-x-2">
          <label htmlFor="header-toggle" className="text-sm">File contains a header row</label>
          <input
            type="checkbox"
            id="header-toggle"
            className="checkbox-black"
            checked={hasHeader}
            onChange={() => setHasHeader(!hasHeader)}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(FileUpload);