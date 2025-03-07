import React, { useState } from 'react';
import { shuffle } from 'lodash';
import TweetCard from './tweetCard';

const TweetGrid = ({ tweets }) => {
  const [displayTweets, setDisplayTweets] = useState(tweets);

  const handleRandomize = () => {
    setDisplayTweets(shuffle([...displayTweets]));
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRandomize}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Randomize Tweets
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default TweetGrid;