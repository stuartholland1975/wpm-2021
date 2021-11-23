/** @format */

import React from 'react';
import NavigationButton from '../ui-components/buttons/NavigationButton';
import CreateButton from '../ui-components/buttons/CreateButton';
import EditButton from '../ui-components/buttons/EditButton';
import DeleteButton from '../ui-components/buttons/DeleteButton';
import ToggleButton from '../ui-components/buttons/ToggleButton';
import MuiConfirmAlert from '../ui-components/modals/MuiConfirmAlert';
import { useRendersCount } from 'react-use';

const TestComponent = () => {
	const rendersCount = useRendersCount();
	console.log(rendersCount);
	return (
		<div>
			<MuiConfirmAlert />
			<hr />
			<span>Renders count: {rendersCount}</span>
		</div>
	);
};

export default TestComponent;
