import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default Card;