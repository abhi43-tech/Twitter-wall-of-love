import React from 'react';
import Header from './header';
import TweetGrid from './tweetGrid';
import Footer from './footer';

const Wall = ({ title, logo, tweets, socialLinks }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title={title} logo={logo} />
      <TweetGrid tweets={tweets} />
      <Footer socialLinks={socialLinks} />
    </div>
  );
};

export default Wall;