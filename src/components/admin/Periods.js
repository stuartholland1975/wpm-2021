/** @format */
import React from 'react';
import {gql, useQuery, useReactiveVar, useMutation} from '@apollo/client';
import {CircularProgress, Box} from '@mui/material';
import {gridSelectionsVar} from '../../cache';
import PeriodsGrid from '../grids/PeriodsGrid';
import ActionButton from '../ui-components/buttons/ActionButton';
import CreateButton from '../ui-components/buttons/CreateButton';
import DeleteButton from '../ui-components/buttons/DeleteButton';
import EditButton from '../ui-components/buttons/EditButton';
import {confirmAlert} from 'react-confirm-alert';

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

const RUN_PERIOD_INCREMENT = gql`
	mutation RunPeriodIncrement($id: Int!) {
		updatePeriod(input: { patch: { current: false }, id: $id }) {
			period {
				id
			}
		}
	}
`;

function Item(props) {
  const {sx, ...other} = props;
  return (
    <Box
      sx={{
        pt: 1,
        pb: 1,
        mt: 1,
        mb: 1,
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    />
  );
}

const PeriodAdminButtons = ({currentPeriod, refetch}) => {
  const selectedPeriod = useReactiveVar(gridSelectionsVar).selectedPeriod;

  const [incrementPeriod] = useMutation(RUN_PERIOD_INCREMENT, {
    onCompleted: () => refetch(),
  });

  const handlePeriodIncrement = () => {
    confirmAlert({
      title: 'Confirm Period Increment!',
      message: 'Are You Sure?',
      buttons: [
        {
          label: 'SUBMIT',
          onClick: () =>
            incrementPeriod({
              variables: {id: currentPeriod[0].id},
            })
        },
        {
          label: 'CANCEL',
          //onClick: () => alert('Click No'),
        },
      ],
    });

  };

  return (
    <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2}}>
      <Item>
        <ActionButton
          label='run period increment'
          onClick={handlePeriodIncrement}
        />
      </Item>
      <Item>
        <CreateButton
          label='create period'
          disabled={selectedPeriod !== false}
        />
      </Item>
      <Item>
        <EditButton label='edit period' disabled={selectedPeriod === false}/>
      </Item>
      <Item>
        <DeleteButton
          label='delete period'
          disabled={selectedPeriod === false}
        />
      </Item>
    </Box>
  );
};

const Periods = () => {
  const [currentPeriod, setCurrentPeriod] = React.useState();
  const {data, loading, refetch} = useQuery(GET_ALL_PERIODS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) =>
      setCurrentPeriod(
        data.periodWithValues.nodes.filter((obj) => obj.current)
      ),
  });

  const gridData =
    data &&
    data.periodWithValues.nodes.map((item) => ({
      ...item,
      worksValue: item.closed ? item.worksValueClosed : item.worksValueCurrent,
    }));

  if (loading) return <CircularProgress/>;

  return (
    <div>
      <PeriodAdminButtons currentPeriod={currentPeriod} refetch={refetch}/>
      <PeriodsGrid data={gridData}/>
    </div>
  );
};

export default Periods;
