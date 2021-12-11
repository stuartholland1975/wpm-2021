/** @format */

import React from 'react';
import { useRendersCount } from 'react-use';
import BottomNavTest from './BottomNavTest'
import ExportToExcel from './ExportToExcel';

const TestComponent = () => {
  const rendersCount = useRendersCount();
  console.log(rendersCount)
  return (
    <>
      <h1>
        TEST
      </h1>
      <ExportToExcel />
    </>
  );
};

export default TestComponent;
