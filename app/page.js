'use client';

import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import ControlPanel from './components/ControlPanel';
import PasswordPrompt from './components/PasswordPrompt';

const Home = () => {
  const [examples, setExamples] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [output, setOutput] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false); // New state for training

  const classifyInputs = async () => {
    if (!isTrainingCompleted) {
      setErrorMessage("Please click 'Start Training' before running the classification.");
      return;
    }

    if (examples.length < 6) {
      alert('Please add a minimum of 8 training examples. For improved results, consider 50 examples, depending on data size and importance. - Adedayo');
      return;
    }

    if (inputs.length === 0) {
      setErrorMessage("Please enter at least one sentence to classify.");
      return;
    }

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: inputs.slice(0, 50), examples }),
      });

      if (res.ok) {
        const data = await res.json();
        setOutput(data);
        setErrorMessage(""); // Clear any existing error messages
      } else {
        const errorData = await res.json();
      }
    } catch (error) {
      setErrorMessage("An error occurred while classifying the inputs.");
    }
  };

  const clearData = () => {
    setExamples([]);
    setInputs([]);
    setOutput([]);
    setErrorMessage(""); // Clear any existing error messages
    setIsTrainingCompleted(false); // Reset training state
  };

  const exportData = (format) => {
    if (output.length === 0) {
      setErrorMessage("No data available to export.");
      return;
    }

    let dataStr;
    let dataUri;

    if (format === 'json') {
      dataStr = JSON.stringify(output);
      dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    } else if (format === 'csv') {
      const csvRows = [
        ['Value', 'Sentiment', 'Confidence Level'],
        ...output.map(result => [
          result.text,
          result.prediction,
          result.confidences && result.confidences.length > 0 ? Math.round(result.confidences[0] * 100) : '0'
        ])
      ];

      dataStr = csvRows.map(e => e.join(',')).join('\n');
      dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(dataStr);
    }

    const exportFileDefaultName = `data.${format}`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handlePasswordSubmit = (password) => {
    if (password === process.env.NEXT_PUBLIC_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Oops, seems the password is wrong. Please try again.');
    }
  };

  const handleTrainingCompleted = () => {
    setIsTrainingCompleted(true);
  };

  if (!isAuthenticated) {
    return <PasswordPrompt onPasswordSubmit={handlePasswordSubmit} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-2 h-full">
      <div className="title-section">
        <h1 className="text-2xl font-semibold text-center mb-2 animate-underline">SENTIMENT ANALYSIS</h1>
      </div>
      <div className="upload-section section">
        <UploadSection setExamples={setExamples} examples={examples} onTrainingCompleted={handleTrainingCompleted} />
      </div>
      <div className="input-section section">
        <InputSection setInputs={setInputs} inputs={inputs} />
      </div>
      <div className="output-control-container section">
        <div className="output-section-content">
          <OutputSection output={output} errorMessage={errorMessage} />
        </div>
        <div className="control-panel-section">
          <ControlPanel classifyInputs={classifyInputs} clearData={clearData} exportData={exportData} />
        </div>
      </div>
    </div>
  );
};

export default Home;
