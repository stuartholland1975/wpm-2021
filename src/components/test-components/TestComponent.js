/** @format */

import React from 'react';
import MuiConfirmAlert from '../ui-components/modals/MuiConfirmAlert';
import {useRendersCount} from 'react-use';

const TestComponent = () => {
  const rendersCount = useRendersCount();
  console.log(rendersCount);
  return (
    <div>
      <MuiConfirmAlert/>
      <hr/>
      <span>Renders count: {rendersCount}</span>
    </div>
  );
};

export default TestComponent;
