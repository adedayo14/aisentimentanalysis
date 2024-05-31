//app/components/PasswordPrompt.js

import React, { useState, useEffect } from 'react';
import './PasswordPrompt.css';

const passwordPrompts = [
  "Please enter a password",
  "I need a password",
  "Your password is required",
  "Access requires a password",
  "Enter password to continue",
  "Password, please",
  "Authentication needed",
  "Secure access: enter password",
  "Password required for entry",
  "Please type your password",
  "Verification needed: password",
  "Enter your secret code",
  "Password input required",
  "Please provide a password",
  "Password necessary for access",
  "Type password to proceed",
  "Password entry required",
  "Enter your access password",
  "Your password is necessary",
  "Please submit your password",
  "Oops, need that password",
  "Don't forget your password",
  "Kindly enter your password",
  "Password check, please",
  "Your magic word, please"
];

const colorPairs = [
  { background: "#C8CFE8", text: "#5F2CA5" },
  { background: "#396146", text: "#EFE4D2" },
  { background: "#B0CFCB", text: "#370CF8" },
  { background: "#345C38", text: "#E9B0AD" },
  { background: "#C0C4D4", text: "#310492" },
  { background: "#D1CFF7", text: "#1D2E73" },
  { background: "#F8B6C6", text: "#1A446B" },
  { background: "#C088C9", text: "#DAF0F1" },
  { background: "#EFE4B5", text: "#F16AF1" },
  { background: "#AB48FC", text: "#F2D3D7" },
  { background: "#BBBFFB", text: "#6219B1" },
  { background: "#BADBF6", text: "#263353" },
  { background: "#1C5E36", text: "#B7D4DE" },
  { background: "#600DE7", text: "#F7EBC9" },
  { background: "#CBCCED", text: "#4F7469" },
  { background: "#7FBCFE", text: "#190FAD" },
  { background: "#830FDC", text: "#9ADBED" },
  { background: "#5B18CE", text: "#7AF6F0" },
  { background: "#5620EA", text: "#E7D0C5" },
  { background: "#0D0598", text: "#E7EDD5" },
  { background: "#8403CA", text: "#8DF8EE" },
  { background: "#30C8DC", text: "#F3E9D7" },
  { background: "#E383DF", text: "#31666B" },
  { background: "#257E54", text: "#D3ECEB" },
  { background: "#EECBCB", text: "#43078D" }
];

const randomColorPair = () => {
  return colorPairs[Math.floor(Math.random() * colorPairs.length)];
};

const PasswordPrompt = ({ onPasswordSubmit }) => {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [password, setPassword] = useState('');
  const [typing, setTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  const [colorPair, setColorPair] = useState(randomColorPair());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDeleting(true);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeout;

    if (typing) {
      if (charIndex < passwordPrompts[currentPromptIndex].length) {
        timeout = setTimeout(() => {
          setCurrentPrompt((prev) => prev + passwordPrompts[currentPromptIndex].charAt(charIndex));
          setCharIndex((prev) => prev + 1);
        }, 100);
      } else {
        setTyping(false);
        timeout = setTimeout(() => {
          setDeleting(true);
        }, 2000);
      }
    } else if (deleting) {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setCurrentPrompt((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        }, 50);
      } else {
        setDeleting(false);
        setColorPair(randomColorPair());
        setCurrentPromptIndex((prev) => (prev + 1) % passwordPrompts.length);
        setTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, typing, deleting]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onPasswordSubmit(password);
  };

  return (
    <div className="password-container" style={{ backgroundColor: colorPair.background }}>
      <div className="typing-container" style={{ color: colorPair.text }}>
        <span className="cursor">{currentPrompt}&nbsp;</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="password-box">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
            placeholder="Enter your password"
          />
          <button type="submit" className="submit-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="arrow-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </form>
      <div className="footer-text">
        Adedayo MVP 2024
      </div>
    </div>
  );
};

export default PasswordPrompt;
