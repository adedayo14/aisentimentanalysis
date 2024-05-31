import React, { useState, useCallback, useEffect } from 'react';
import FileUploadModal from './FileUploadModal';
import TrainingProgress from './TrainingProgress';

const UploadSection = ({ setExamples, examples, onTrainingCompleted }) => {
  const [inputText, setInputText] = useState("");
  const [showInputField, setShowInputField] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [showStartButton, setShowStartButton] = useState(true);

  const handleFileUpload = useCallback((results) => {
    const data = hasHeader ? results.data.slice(1) : results.data;
    const newExamples = data.map((row) => ({
      text: row[0],
      label: row[1],
    })).slice(0, 15 - examples.length);
    setExamples(prev => [...prev, ...newExamples]);
    setShowModal(false);
    setError(""); // Clear any existing error messages
    setShowStartButton(true); // Show start button if new file is uploaded
  }, [hasHeader, setExamples, examples.length]);

  const startTraining = useCallback(() => {
    setIsTraining(true);
    setTrainingProgress(0);
    setShowStartButton(false); // Hide start button when training starts

    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsTraining(false);
            onTrainingCompleted(); // Notify that training is complete
          }, 3000); // Hide after 3 seconds
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 300);
  }, [onTrainingCompleted]);

  const addExample = useCallback((label) => {
    if (inputText.trim() !== "" && examples.length < 15) {
      setExamples(prev => {
        const updatedExamples = [...prev, { text: inputText, label }];
        return updatedExamples.slice(0, 15);
      });
      setInputText("");
      setShowInputField(false);
      setError(""); // Clear any existing error messages
      setShowStartButton(true); // Show start button if new example is added manually
    }
  }, [inputText, setExamples, examples.length]);

  const removeExample = useCallback((index) => {
    setExamples(prev => prev.filter((_, i) => i !== index));
  }, [setExamples]);

  const getColorDot = useCallback((label) => {
    switch (label) {
      case 'positive':
        return 'bg-purple-500';
      case 'negative':
        return 'bg-red-500';
      case 'neutral':
        return 'bg-gray-500';
      default:
        return 'bg-gray-200';
    }
  }, []);

  const validateExamples = () => {
    const counts = {
      positive: examples.filter(ex => ex.label === 'positive').length,
      negative: examples.filter(ex => ex.label === 'negative').length,
      neutral: examples.filter(ex => ex.label === 'neutral').length,
    };

    if (counts.positive < 2 || counts.negative < 2 || counts.neutral < 2) {
      setError("Please add at least 2 examples for each sentiment category.");
      return false;
    }
    return true;
  };

  const handleStartTraining = () => {
    if (validateExamples()) {
      startTraining();
    }
  };

  useEffect(() => {
    if (isTraining) {
      setShowStartButton(false);
    }
  }, [isTraining]);

  return (
    <div className="p-4 border rounded-lg shadow-md space-y-2 h-full w-full overflow-auto relative">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold uppercase">TRAINING EXAMPLES</h3>
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
          title="Upload Labelled Examples"
          description="Add your data using a .csv file. The file must have two columns: examples and sentiment and at least 2 examples per sentiment. Maximum 15 examples in total."
          closeModal={() => setShowModal(false)}
        />
      )}
      {isTraining ? (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-2 z-10">
          <TrainingProgress isTraining={isTraining} trainingProgress={trainingProgress} />
        </div>
      ) : (
        showStartButton && (
          <button
            onClick={handleStartTraining}
            className="bg-black text-white px-4 py-2 rounded text-sm absolute left-1/2 transform -translate-x-1/2 top-2 z-10"
          >
            Start Training
          </button>
        )
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className={`p-4 ${isTraining ? 'blur-sm' : ''}`}>
        <table className="w-full table-auto rounded-lg">
          <thead>
            <tr className="bg-gray-100 rounded-lg">
              <th className="px-4 py-2 text-left text-sm w-2/5">Example</th>
              <th className="px-4 py-2 text-center text-sm w-1/5">Positive</th>
              <th className="px-4 py-2 text-center text-sm w-1/5">Negative</th>
              <th className="px-4 py-2 text-center text-sm w-1/5">Neutral</th>
            </tr>
          </thead>
          <tbody>
            {examples.map((example, index) => (
              <tr key={index} className="bg-white rounded-lg">
                <td className="px-4 py-2 border-t flex items-center space-x-2 text-sm">
                  <button onClick={() => removeExample(index)} className="text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  <span>{index + 1}.</span>
                  <span className={`dot ${getColorDot(example.label)}`}></span>
                  <span>{example.text}</span>
                </td>
                <td className="px-4 py-2 border-t text-center align-middle w-1/5">
                  <button
                    onClick={() => setExamples(prev => prev.map((ex, i) => i === index ? { ...ex, label: 'positive' } : ex))}
                    className={`rounded-full flex items-center justify-center ${
                      example.label === 'positive' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                    style={{ width: '150px', height: '20px', margin: '0 auto' }}
                  >
                  </button>
                </td>
                <td className="px-4 py-2 border-t text-center align-middle w-1/5">
                  <button
                    onClick={() => setExamples(prev => prev.map((ex, i) => i === index ? { ...ex, label: 'negative' } : ex))}
                    className={`rounded-full flex items-center justify-center ${
                      example.label === 'negative' ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                    style={{ width: '150px', height: '20px', margin: '0 auto' }}
                  >
                  </button>
                </td>
                <td className="px-4 py-2 border-t text-center align-middle w-1/5">
                  <button
                    onClick={() => setExamples(prev => prev.map((ex, i) => i === index ? { ...ex, label: 'neutral' } : ex))}
                    className={`rounded-full flex items-center justify-center ${
                      example.label === 'neutral' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                    style={{ width: '150px', height: '20px', margin: '0 auto' }}
                  >
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showInputField && (
          <div className="flex space-x-4">
            <input
              className="flex-grow p-2 border border-gray-300 rounded-lg text-sm"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your input here..."
              style={{ width: '50%' }}
            />
            <div className="flex space-x-2">
              <button onClick={() => addExample('positive')} className="bg-purple-500 text-white px-4 py-2 rounded text-sm">Add Positive</button>
              <button onClick={() => addExample('negative')} className="bg-red-500 text-white px-4 py-2 rounded text-sm">Add Negative</button>
              <button onClick={() => addExample('neutral')} className="bg-gray-500 text-white px-4 py-2 rounded text-sm">Add Neutral</button>
            </div>
          </div>
        )}
        {!showInputField && (
          <button onClick={() => setShowInputField(true)} className="text-black flex items-center space-x-2 mt-4 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Add training example</span>
          </button>
        )}
        <p className="text-sm text-gray-500">Add at least 2 examples for each sentiment category (positive, negative, neutral). Maximum 15 examples in total.</p>
      </div>
    </div>
  );
};

export default UploadSection;
