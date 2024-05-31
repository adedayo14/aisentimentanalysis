//app/components/Training Progress.js

import React, { useState, useEffect } from 'react';

const TrainingProgress = ({ isTraining, trainingProgress }) => {
  if (!isTraining) return null;

  return (
    <div className="flex justify-center items-center">
      <div className="p-4 bg-white rounded-lg shadow-lg" style={{ background: 'linear-gradient(to right, #c1c8e4, #e0c3fc)' }}>
        Training Model: {Math.min(100, Math.round(trainingProgress))}%
      </div>
    </div>
  );
};

export default React.memo(TrainingProgress);
