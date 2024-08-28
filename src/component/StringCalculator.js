import React, { useState } from 'react';
import './StringCalculator.css';

function StringCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const add = (numbers) => {
    // Check if the input is quoted (either single or double quotes)
    const isQuoted = /^["'].*["']$/.test(numbers.trim());
  
    if (!isQuoted) {
      throw new Error('Input must be quoted');
    }
  
    // Remove the surrounding quotes
    numbers = numbers.trim().replace(/^["'](.*)["']$/, '$1');
  
    if (numbers === '') return 0;
  
    let delimiters = [',', '\n']; // Default delimiters
  
    // Check for a custom delimiter
    if (numbers.startsWith('//')) {
      const delimiterEndIndex = numbers.indexOf('\n');
      let customDelimiter = numbers.substring(2, delimiterEndIndex).trim();
  
      // Support delimiters of any length enclosed in square brackets
      if (customDelimiter.startsWith('[') && customDelimiter.endsWith(']')) {
        customDelimiter = customDelimiter.slice(1, -1); // Remove the brackets
      }
  
      // Handle multi-character delimiters
      delimiters = delimiters.concat(customDelimiter.split(/[\[\]]+/).filter(Boolean));
  
      // Remove the delimiter definition part from the string
      numbers = numbers.substring(delimiterEndIndex + 1);
    }
  
    // Create a regex pattern for splitting the string based on the delimiters
    const regex = new RegExp(`[${delimiters.map(del => del.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')).join('')}]`);
    const numberArray = numbers.split(regex).map(num => num.trim());
  
    // Check for non-numeric strings and convert to numbers
    const parsedNumbers = numberArray.map(num => {
      if (num === '' || isNaN(num)) {
        return 0;
      }
      return Number(num);
    });
  
    // Throw an error if there are negative numbers
    const negatives = parsedNumbers.filter(n => n < 0);
    if (negatives.length > 0) {
      throw new Error(`Negative numbers not allowed: ${negatives.join(', ')}`);
    }
  
    // Return the sum of the numbers
    return parsedNumbers.reduce((sum, num) => sum + num, 0);
  };
  
  
  
  const handleCalculate = () => {
    try {
      const sum = add(input);
      setResult(sum);
      setError('');
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  };

  return (
    <div className="calculator-container">
      <h1>String Calculator</h1>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Enter numbers"
      />
      <button onClick={handleCalculate}>Calculate</button>
      {error && <p className="error">{error}</p>}
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}

export default StringCalculator;
