import React from 'react'
import {useReactiveVar, gql, useMutation, useQuery, useLazyQuery} from '@apollo/client';
import {gridSelectionsVar} from '../cache';
import CreateButton from '../components/ui-components/buttons/CreateButton';
import CancelButton from '../components/ui-components/buttons/CancelButton';
import {TextField, Grid, Autocomplete, CircularProgress} from '@mui/material';
import {useModal} from 'react-modal-hook';
import ReactModal from 'react-modal';
import {GET_ORDER_LOCATIONS} from '../components/order-admin/OrderLocations';
import {GET_ORDER_DETAILS} from '../components/order-admin/OrderItems';
import {GET_SINGLE_ORDERHEADER} from '../components/order-admin/OrderStats';

const GET_MAX_ITEM_NUMBER = gql`
query GetMaxItemNumber($id: Int!) {
  wpmGraphqlGetLastItemNumber(orderId: $id)
}
`
const GET_ITEM_TYPES = gql`
query GetItemTypes {
  itemTypes {
    nodes {
      id
      typeLong
      typeShort
    }
  }
}
`
const GET_RATESET_HEADERS = gql`
query GetRatesetHeaders {
  ratesetHeaders {
    nodes {
      id
      description
    }
  }
}
`
const GET_RATESET_PRICES = gql`
query GetRatesetPrices($id: Int!) {
  pricesWithUplifts(condition: {ratesetHeaderId: $id}, orderBy: ACTIVITY_CODE_ASC) {
    nodes {
      activityCode
      activityDescription
      id
      ratesetHeaderId
    }
    totalCount
  }
}
`
const CREATE_ORDERDETAIL = gql`
mutation CreateOrderdetail($input: OrderdetailInput!) {
  createOrderdetail(
    input: {
      orderdetail: $input
    }
  ) {
    clientMutationId
  }
}
`

const ItemForm = ({hideModal}) => {

	const selectedOrder = useReactiveVar (gridSelectionsVar).selectedOrder;

	const [locationsOpen, setLocationsOpen] = React.useState (false);
	const [locationOptions, setLocationOptions] = React.useState ([])

	const [itemTypesOpen, setItemTypesOpen] = React.useState (false);
	const [itemTypeOptions, setItemTypeOptions] = React.useState ([])

	const [ratesetsOpen, setRatesetsOpen] = React.useState (false);
	const [ratesetOptions, setRatesetOptions] = React.useState ([])
	const [selectedRateset, setSelectedRateset] = React.useState (false)

	const [ratesetPricesOpen, setRatesetPricesOpen] = React.useState (false);
	const [ratesetPriceOptions, setRatesetPriceOptions] = React.useState ([])
	const [selectedRatesetPrice, setSelectedRatesetPrice] = React.useState (false)

	const [getLocations, {loading: locationsLoading}] = useLazyQuery (GET_ORDER_LOCATIONS, {
		onCompleted: data => setLocationOptions (data.sitelocationWithValues.nodes),
		fetchPolicy: 'cache-and-network'
	})

	const [getItemTypes, {loading: itemTypesLoading}] = useLazyQuery (GET_ITEM_TYPES, {
		onCompleted: data => setItemTypeOptions (data.itemTypes.nodes),
		fetchPolicy: 'cache-and-network'
	})

	const [getRatesets, {loading: ratesetsLoading}] = useLazyQuery (GET_RATESET_HEADERS, {
		onCompleted: data => setRatesetOptions (data.ratesetHeaders.nodes),
		fetchPolicy: 'cache-and-network'
	})

	const [getRatesetPrices, {loading: ratesetPricesLoading}] = useLazyQuery (GET_RATESET_PRICES, {
		onCompleted: data => setRatesetPriceOptions (data.pricesWithUplifts.nodes),
		fetchPolicy: 'cache-and-network'
	})

	const {data: maxItemNumber, loading: maxItemNumberLoading} = useQuery (GET_MAX_ITEM_NUMBER, {
		variables: {id: selectedOrder.id},
		fetchPolicy: 'network-only'
	})

	const [createOrderdetail] = useMutation (CREATE_ORDERDETAIL, {
		refetchQueries: [
			{
				query: GET_ORDER_DETAILS,
				variables: {id: selectedOrder.id}
			},
			{
				query: GET_SINGLE_ORDERHEADER,
				variables: {id: selectedOrder.id}
			}
		],
		awaitRefetchQueries: true,
		onCompleted: data => {
			hideModal ()

		}
	})

	React.useEffect (() => {
		if ( locationsOpen && locationOptions.length === 0 ) {
			getLocations ({variables: {id: selectedOrder.id}})
		}
	}, [getLocations, locationOptions.length, locationsOpen, selectedOrder]);

	React.useEffect (() => {
		if ( itemTypesOpen && itemTypeOptions.length === 0 ) {
			getItemTypes ()
		}
	}, [getItemTypes, itemTypeOptions.length, itemTypesOpen]);

	React.useEffect (() => {
		if ( ratesetsOpen && ratesetOptions.length === 0 ) {
			getRatesets ()
		}
	}, [getRatesets, ratesetOptions.length, ratesetsOpen]);

	React.useEffect (() => {
		if ( selectedRateset ) {
			getRatesetPrices ({
				variables: {id: selectedRateset.id}
			})
		}
	}, [getRatesetPrices, selectedRateset])

	const handleSubmit = (event) => {
		event.preventDefault ()
		let fd = new FormData (event.target)
		let itemNumber = Number (fd.get ('itemNumber'))
		let qtyOrdered = Number (fd.get ('qtyOrdered'))
		let valueBaseMaterials = Number (fd.get ('valueBaseMaterials'))
		let packNumber = fd.get ('materialPackNumber')
		let sitelocationId = locationOptions.filter (obj => obj.reference === fd.get ('sitelocationReference'))[0].id
		let itemTypeId = itemTypeOptions.filter (obj => obj.typeLong === fd.get ('itemTypeDescription'))[0].id
		// let ratesetHeaderId = ratesetOptions.filter(obj => obj.description === fd.get('ratesetDescription'))[0].id
		let ratesetPriceId = selectedRatesetPrice.id

		const apiObject = {
			itemNumber,
			qtyOrdered,
			valueBaseMaterials,
			packNumber,
			sitelocationId,
			itemTypeId,
			ratesetPriceId,
			orderheaderId: selectedOrder.id
		}

		createOrderdetail ({
			variables: {input: apiObject}
		})


	}

	if ( maxItemNumberLoading ) return <CircularProgress/>

	return (
		<form onSubmit={handleSubmit}>
			<Grid container spacing={4}>
				<Grid item xs={6}>
					<TextField
						label={"Item Number"}
						autoFocus
						variant="filled"
						fullWidth
						required
						name={"itemNumber"}
						defaultValue={maxItemNumber.wpmGraphqlGetLastItemNumber ? maxItemNumber.wpmGraphqlGetLastItemNumber + 1 : 1}/>

				</Grid>
				<Grid item xs={6}>
					<TextField
						label={"Qty Ordered"}
						variant="filled"
						fullWidth
						required
						name={"qtyOrdered"}
						defaultValue={"0.00"}/>

				</Grid>
				<Grid item xs={6}>
					<Autocomplete
						open={locationsOpen}
						onOpen={() => {
							setLocationsOpen (true);
						}}
						onClose={() => {
							setLocationsOpen (false);
						}}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						getOptionLabel={(option) => option.reference}
						options={locationOptions}
						loading={locationsLoading}
						renderInput={(params) => (
							<TextField
								{...params}
								variant='filled'
								label="Site Locations"
								required
								name="sitelocationReference"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<React.Fragment>
											{locationsLoading ? <CircularProgress color="inherit" size={20}/> : null}
											{params.InputProps.endAdornment}
										</React.Fragment>
									),
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={6}>
					<Autocomplete
						open={itemTypesOpen}
						onOpen={() => {
							setItemTypesOpen (true);
						}}
						onClose={() => {
							setItemTypesOpen (false);
						}}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						getOptionLabel={(option) => option.typeLong}
						options={itemTypeOptions}
						loading={itemTypesLoading}
						renderInput={(params) => (
							<TextField
								{...params}
								variant='filled'
								label="Item Type"
								required
								name="itemTypeDescription"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<React.Fragment>
											{locationsLoading ? <CircularProgress color="inherit" size={20}/> : null}
											{params.InputProps.endAdornment}
										</React.Fragment>
									),
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={6}>
					<Autocomplete
						open={ratesetsOpen}
						onOpen={() => {
							setRatesetsOpen (true);
						}}
						onClose={() => {
							setRatesetsOpen (false);

						}}
						isOptionEqualToValue={(option, value) => option.description === value.description}
						getOptionLabel={(option) => option.description}
						options={ratesetOptions}
						loading={ratesetsLoading}
						onChange={(event, newValue) => {
							setSelectedRateset (newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								variant='filled'
								label="Rateset"
								required
								name="ratesetDescription"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<React.Fragment>
											{locationsLoading ? <CircularProgress color="inherit" size={20}/> : null}
											{params.InputProps.endAdornment}
										</React.Fragment>
									),
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={6}>
					<Autocomplete
						open={ratesetPricesOpen}
						onOpen={() => {
							setRatesetPricesOpen (true);
						}}
						onClose={() => {
							setRatesetPricesOpen (false);

						}}
						isOptionEqualToValue={(option, value) => option.activityCode === value.activityCode}
						getOptionLabel={(option) => `${option.activityCode}  --  ${option.activityDescription}`}
						options={ratesetPriceOptions}
						loading={ratesetPricesLoading}
						onChange={(event, newValue) => {
							setSelectedRatesetPrice (newValue);
						}}
						disabled={ratesetPriceOptions.length === 0}
						renderInput={(params) => (
							<TextField
								{...params}
								variant='filled'
								label="Activity Code"
								required
								name="ratesetPrice"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<React.Fragment>
											{ratesetPricesLoading ? <CircularProgress color="inherit" size={20}/> : null}
											{params.InputProps.endAdornment}
										</React.Fragment>
									),
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={6}>
					<TextField
						fullWidth
						variant="filled"
						label="Material Pack Number"
						name={"materialPackNumber"}

					/>
				</Grid>
				<Grid item xs={6}>
					<TextField
						fullWidth
						variant="filled"
						label="Material Pack Value"
						name={"valueBaseMaterials"}

					/>
				</Grid>
				<Grid item xs={6}>
					<CreateButton type={"submit"} label={"SUBMIT"}/>
				</Grid>
				<Grid item xs={6}>
					<CancelButton label={"CLOSE"} type={"button"} onClick={hideModal} fullWidth/>
				</Grid>
			</Grid>
		</form>
	)
}


const CreateItemForm = () => {

	const selectedItem = useReactiveVar (gridSelectionsVar).selectedItem;

	const [showModal, hideModal] = useModal (() => (
		<ReactModal isOpen appElement={document.getElementById ('root')}>
			<h3>CREATE ORDER ITEM</h3>
			<hr/>
			<ItemForm hideModal={hideModal}/>
		</ReactModal>
	));

	return (
		<div>
			<CreateButton
				label='CREATE ORDER ITEM'
				onClick={showModal}
				disabled={selectedItem !== false}
			/>
		</div>
	);
};

export default CreateItemForm;