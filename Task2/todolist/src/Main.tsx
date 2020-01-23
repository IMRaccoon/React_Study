import React from 'react';
import './Main.css';
import TableHeader from './components/TodoHeader/TodoHeader';

const Main: React.FC = () => {
  return (
    <div className="table">
      <TableHeader />
    </div>
  );
};

export default Main;
