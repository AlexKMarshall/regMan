import React from 'react';
import './loading.css'

// nice spinner for loading pages.
const Loading = () => {
  return (
    <div className="loader-container">
      <span className="loader" role="img" aria-label="loading-notes">🎵</span>
    </div>
  );
}

export default Loading;
