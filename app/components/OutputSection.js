import React from 'react';

const OutputSection = ({ output, errorMessage }) => {
  return (
    <div className="output-section-content p-4 rounded-lg shadow-md overflow-y-auto bg-gray-800 text-white">
      <h2 className="text-sm font-semibold uppercase mb-4">Output</h2>
      {errorMessage ? (
        <p className="text-red-500 text-base">{errorMessage}</p>
      ) : (
        <table className="w-full table-auto rounded-lg h-full text-white">
          <thead>
            <tr className="bg-gray-800 rounded-lg">
              <th className="px-4 py-2 text-left bg-gray-800 font-normal">Value</th>
              <th className="px-4 py-2 text-left bg-gray-800 font-normal">Confidence Level</th>
            </tr>
          </thead>
          <tbody>
            {output.map((result, index) => {
              const confidence =
                result.confidences && result.confidences.length > 0
                  ? Math.round(result.confidences[0] * 100)
                  : '0';

              return (
                <tr key={index} className="bg-gray-800 rounded-lg my-2 text-sm">
                  <td className="px-4 py-2 border-t border-gray-700 text-base font-normal">{index + 1}. {result.text}</td>
                  <td className="px-4 py-2 border-t border-gray-700 text-base font-normal flex items-center space-x-2">
                    <div className="flex-grow bg-gray-600 rounded-full h-6 relative">
                      <div
                        className={`h-6 rounded-full absolute top-0 left-0 ${result.prediction === 'positive' ? 'bg-purple-500' : result.prediction === 'negative' ? 'bg-red-500' : 'bg-gray-500'}`}
                        style={{ width: `${confidence}%` }}
                      ></div>
                      <div className="relative z-10 flex justify-between items-center h-6 w-full px-2 text-xs text-white">
                        <span className="text-base font-normal">{result.prediction}</span>
                        <span className="text-base font-normal">{confidence}%</span>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OutputSection;
