/** @format */

import React from 'react';
import { useRendersCount } from 'react-use';
import BottomNavTest from './BottomNavTest'

const TestComponent = () => {
  const rendersCount = useRendersCount();
  console.log(rendersCount)
  return (
    <>
      <h1>
        TEST
      </h1>
      <BottomNavTest />
    </>
  );
};

export default TestComponent;
