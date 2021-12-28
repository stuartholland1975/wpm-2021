import React from 'react';
import { GET_RATESET_HEADERS, GET_RATESET_PRICES } from '../../../gql/queries/other';
import { useQuery, useLazyQuery } from '@apollo/client';
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField, Box } from '@mui/material';

function Item(props) {
	const { sx, ...other } = props;
	return (
		<Box
			sx={{
				//		bgcolor: '#b4cce4',
				//		p: 2,
				//		mt: 1,
				ml: 0.25,
				mr: 0.25,
				flexGrow: 1,
				color: 'black',
				...sx,
			}}
			{...other}
		/>
	);
}

const SelectActivityCode = (props) => {

	const { control, fieldNameRH, fieldNameAC } = props
	const [ratesetOptions, setRatesetOptions] = React.useState([])
	const [ratesetPriceOptions, setRatesetPriceOptions] = React.useState([])


	useQuery(GET_RATESET_HEADERS, {
		onCompleted: data => {
			setRatesetOptions(data.ratesetHeaders.nodes);
		},
	})

	const [getRatesetPrices] = useLazyQuery(GET_RATESET_PRICES, {
		onCompleted: data => setRatesetPriceOptions(data.pricesWithUplifts.nodes),
		fetchPolicy: 'cache-and-network'
	})


	return (
		<Box sx={{ display: 'flex', ml: 0.5, mr: 0.5 }}>
			<Item>
				<Controller
					name={fieldNameRH}
					control={control}
					render={({ field }) =>
						<Autocomplete {...field}
							openOnFocus
							fullWidth
							isOptionEqualToValue={(option, value) => option?.description === value?.description}
							getOptionLabel={(option) => option?.description}
							options={ratesetOptions}
							onChange={(e, data) => getRatesetPrices({ variables: { id: data.id } })}
							renderInput={(params) => (
								<TextField
									{...params}
									variant='filled'
									label="RateSet"

								/>
							)}
						/>
					}
				/>
			</Item>
			<Item>
				<Controller
					name={fieldNameAC}
					control={control}
					render={({ field }) => <Autocomplete {...field}
						fullWidth
						isOptionEqualToValue={(option, value) => option?.activityCode === value?.activityCode}
						getOptionLabel={(option) => option?.activityCode}
						options={ratesetPriceOptions}
						disabled={ratesetPriceOptions.length === 0}
						onChange={(e, data) => {
							field.onChange({ id: data.id, activityCode: data.activityCode })
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								variant='filled'
								label="RateSet"

							/>
						)}
					/>}
				/>
			</Item>
		</Box>
	);
};

export default SelectActivityCode;