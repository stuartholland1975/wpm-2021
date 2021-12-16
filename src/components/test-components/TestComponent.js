/** @format */

import React from 'react';
import { useRendersCount } from 'react-use';
import ExportToExcel from './ExportToExcel';
import WithStyles from './WithStyles';

const TestComponent = () => {
  const rendersCount = useRendersCount();
  console.log(rendersCount)
  return (
    <>
      <h1>
        TEST
      </h1>
      <ExportToExcel />
      <WithStyles />
    </>
  );
};

export default TestComponent;
