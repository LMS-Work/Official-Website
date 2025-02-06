import React from 'react';

const Skeleton: React.FC = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-header">
        <div className="skeleton-logo"></div>
        <div className="skeleton-nav"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-buttons"></div>
      </div>
    </div>
  );
};

export default Skeleton; 