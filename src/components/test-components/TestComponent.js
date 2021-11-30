/** @format */

import React from 'react';
import { useRendersCount } from 'react-use';

const TestComponent = () => {
  const rendersCount = useRendersCount();
  console.log(rendersCount);
  return (
    <h1>
      TEST
    </h1>
  );
};

export default TestComponent;
