/** @format */

import { gql, useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import PeriodsGrid from '../grids/PeriodsGrid';

const GET_ALL_PERIODS = gql`
	query GetAllPeriods {
		periodWithValues(orderBy: PERIOD_NUMBER_ASC) {
			nodes {
				current
				id
				periodNumber
				week
				weekEndingDate
				weekCommencingDate
				worksValueClosed
				worksValueCurrent
				year
				closed
			}
		}
	}
`;

const Periods = () => {
	const { data, loading } = useQuery(GET_ALL_PERIODS, {
		fetchPolicy: 'cache-and-network',
	});

	const gridData =
		data &&
		data.periodWithValues.nodes.map((item) => ({
			...item,
			worksValue: item.closed ? item.worksValueClosed : item.worksValueCurrent,
		}));

	if (loading) return <CircularProgress />;

	return (
		<div>
			<PeriodsGrid data={gridData} />
		</div>
	);
};

export default Periods;
