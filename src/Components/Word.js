import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';

const App = () => {
  const [wordCounts, setWordCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWordCounts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://www.terriblytinytales.com/test.txt'
      );
      const text = response.data;
      const wordArray = text.match(/\b\w+\b/g) || [];
      const wordMap = wordArray.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
      const sortedWords = Object.entries(wordMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
      setWordCounts(sortedWords);
    } catch (error) {
      console.error('Error fetching word counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const csvData = wordCounts.map(([word, count]) => ({
      Word: word,
      Count: count,
    }));
    return csvData;
  };

  return (
    <div>
      <button onClick={fetchWordCounts} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
      {wordCounts.length > 0 && (
        <div>
          <Bar
            data={{
              labels: wordCounts.map(([word]) => word),
              datasets: [
                {
                  label: 'Word Frequency',
                  data: wordCounts.map(([, count]) => count),
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  stepSize: 1,
                },
              },
            }}
          />
          <CSVLink data={exportData()} filename="word_frequency.csv">
            Export
          </CSVLink>
        </div>
      )}
    </div>
  );
};

export default App;
