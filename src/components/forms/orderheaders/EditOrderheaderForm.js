import React from 'react';
import {useReactiveVar, gql, useMutation, useQuery} from '@apollo/client';
import {gridSelectionsVar} from '../../../cache';
import CreateButton from '../../ui-components/buttons/CreateButton';
import CancelButton from '../../ui-components/buttons/CancelButton';
import {TextField, Grid, Autocomplete, CircularProgress} from '@mui/material';
import {useModal} from 'react-modal-hook';
import ReactModal from 'react-modal';
import EditButton from '../../ui-components/buttons/EditButton';

const GET_ALL_AREAS = gql`
query getAreas {
  areas {
    nodes {
      id
      description
    }
  }
}
`
const GET_ALL_WORKTYPES = gql`
query getWorktypes {
  worktypes {
    nodes {
      id
      description
    }
  }
}
`
const GET_ALL_ORDERHEADER_STATUSES = gql`
query getOrderheaderStatus {
  orderheaderStatuses {
    nodes {
      id
      statusDescription
    }
  }
}
`
const EDIT_ORDERHEADER = gql`
mutation EditOrderheader($patch: OrderheaderPatch!, $id: Int!) {
  updateOrderheader(
    input: {
      patch: 
       $patch
      
      id: $id
    }
  ) {
    orderheader {
      orderheaderWithValueById {
        area
        averageItemValue
        averageLocationValue
        id
        documentCount
        imageCount
        issuedDate
        itemCount
        itemsComplete
        itemCountVarn
        itemCountBoq
        itemsCompleteBoq
        itemsCompleteVarn
        locationCount
        locationsComplete
        orderNumber
        orderStatusId
        orderValueLabour
        orderValueMaterials
        orderValueOther
        orderValueTotal
        orderValueTotalApplied
        orderValueTotalBoq
        orderValueTotalComplete
        orderValueTotalVarn
        projectTitle
        statusDescription
        workType
        worktypeId
      }
    }}
}

`


const OrderheaderForm = ({hideModal}) => {
	const selectedOrder = useReactiveVar (gridSelectionsVar).selectedOrder
	const [areaOptions, setAreaOptions] = React.useState ([])
	const [worktypeOptions, setworktypeOptions] = React.useState ([])
	const [orderStatusOptions, setOrderStatusOptions] = React.useState ([])

	const {loading: areasLoading} = useQuery (GET_ALL_AREAS, {
		onCompleted: data => setAreaOptions (data.areas.nodes),
		fetchPolicy: 'cache-and-network'
	})

	const {loading: worktypesLoading} = useQuery (GET_ALL_WORKTYPES, {
		onCompleted: data => setworktypeOptions (data.worktypes.nodes),
		fetchPolicy: 'cache-and-network'
	})

	const {loading: orderheaderStatusLoading} = useQuery (GET_ALL_ORDERHEADER_STATUSES, {
		onCompleted: data => setOrderStatusOptions (data.orderheaderStatuses.nodes),
		fetchPolicy: 'cache-and-network'
	})

	const [submitOrderheader] = useMutation (EDIT_ORDERHEADER, {
		onCompleted: () => hideModal ()
	})


	function handleSubmit (event) {
		event.preventDefault ()
		let fd = new FormData (event.target);
		const areaId = areaOptions.filter (obj => obj.description === fd.get ('areaId'))[0].id
		const worktypeId = worktypeOptions.filter (obj => obj.description === fd.get ('worktypeId'))[0].id
		const orderStatusId = orderStatusOptions.filter (obj => obj.statusDescription === fd.get ('orderStatusId'))[0].id

		const apiObject = {
			orderNumber: fd.get ('orderNumber'),
			projectTitle: fd.get ('projectTitle'),
			areaId,
			worktypeId,
			orderStatusId,
			notes: fd.get ('notes'),
			startDate: fd.get ('startDate'),
			endDate: fd.get ('endDate'),
			issuedDate: fd.get ('issuedDate'),
		}
		submitOrderheader ({
			variables: {patch: apiObject, id: selectedOrder.id}
		})
	}

	return (
		<form onSubmit={handleSubmit}>
			<Grid container spacing={5}>
				<Grid item xs={6}>
					<TextField
						label='Order Number'
						name='orderNumber'
						required
						variant='filled'
						fullWidth
						defaultValue={selectedOrder.orderNumber}
					/>
				</Grid>
				<Grid item xs={6}>
					<TextField
						label='Project Title'
						name='projectTitle'
						required
						variant='filled'
						fullWidth
						defaultValue={selectedOrder.projectTitle}
					/>
				</Grid>
				<Grid item xs={4}>
					<Autocomplete

						isOptionEqualToValue={(option, value) => option.description === value.description}
						getOptionLabel={(option) => option.description}
						options={areaOptions}
						loading={areasLoading}
						defaultValue={{id: selectedOrder.areaId, description: selectedOrder.area}}

						renderInput={(params) => (
							<TextField
								{...params}
								variant='filled'
								label="Area"
								required
								name="areaId"

								InputProps={{
									...params.InputProps,
									endAdornment: (
										<React.Fragment>
											{areasLoading ? <CircularProgress color="inherit" size={20}/> : null}
											{params.InputProps.endAdornment}
										</React.Fragment>
									),
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={4}>
					<Autocomplete

						isOptionEqualToValue={(option, value) => option.description === value.description}
						getOptionLabel={(option) => option.description}
						options={worktypeOptions}
						loading={worktypesLoading}
						defaultValue={{id: selectedOrder.worktypeId, description: selectedOrder.workType}}
						renderInput={(params) => (
							<TextField
								{...params}
								variant='filled'
								label="Work Type"
								required
								name="worktypeId"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<React.Fragment>
											{worktypesLoading ? <CircularProgress color="inherit" size={20}/> : null}
											{params.InputProps.endAdornment}
										</React.Fragment>
									),
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={4}>
					<Autocomplete

						isOptionEqualToValue={(option, value) => option.statusDescription === value.statusDescription}
						getOptionLabel={(option) => option.statusDescription}
						options={orderStatusOptions}
						loading={orderheaderStatusLoading}
						defaultValue={{id: selectedOrder.orderStatusId, statusDescription: selectedOrder.statusDescription}}
						renderInput={(params) => (
							<TextField
								{...params}
								variant='filled'
								label="Order Status"
								required
								name="orderStatusId"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<React.Fragment>
											{areasLoading ? <CircularProgress color="inherit" size={20}/> : null}
											{params.InputProps.endAdornment}
										</React.Fragment>
									),
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={4}>
					<TextField
						label="Start Date"
						type="date"
						name="startDate"
						required
						variant="filled"
						fullWidth
						InputLabelProps={{shrink: true}}
						defaultValue={selectedOrder.startDate}
					/>
				</Grid>
				<Grid item xs={4}>
					<TextField
						label="End Date"
						type="date"
						name="endDate"
						required
						variant="filled"
						fullWidth
						InputLabelProps={{shrink: true}}
						defaultValue={selectedOrder.endDate}
					/>
				</Grid>
				<Grid item xs={4}>
					<TextField
						label="Issued Date"
						type="date"
						name="issuedDate"
						required
						variant="filled"
						fullWidth
						InputLabelProps={{shrink: true}}
						defaultValue={selectedOrder.issuedDate}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						label="Notes"
						multiline
						name="notes"
						variant="filled"
						fullWidth
						defaultValue={selectedOrder.notes}
						rows={5}
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

const EditOrderheaderForm = () => {

	const selectedOrder = useReactiveVar (gridSelectionsVar).selectedOrder;

	const [showModal, hideModal] = useModal (() => (
		<ReactModal isOpen appElement={document.getElementById ('root')}>
			<h3>EDIT WORK ORDER</h3>
			<hr/>
			<OrderheaderForm hideModal={hideModal}/>
		</ReactModal>
	));

	return (
		<div>
			<EditButton
				label='EDIT WORK ORDER'
				onClick={showModal}
				disabled={selectedOrder === false}
			/>
		</div>
	);
};

export default EditOrderheaderForm;