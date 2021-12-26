import React from 'react';
import { useReactiveVar, useLazyQuery, gql, useMutation } from '@apollo/client';
import { gridSelectionsVar } from '../../cache';
import CreateButton from '../ui-components/buttons/CreateButton';
import CancelButton from '../ui-components/buttons/CancelButton';
import { TextField, Grid, Autocomplete, CircularProgress } from '@mui/material';
import { useModal } from 'react-modal-hook';
import ReactModal from 'react-modal';
import { DateTime } from 'luxon'

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
const CREATE_ORDERHEADER = gql`
mutation CreateOrderheader($input: OrderheaderInput!) {
  createOrderheader(
    input: {orderheader: $input}
  ) {
   orderheader {
      orderheaderWithValueById {
                area
				averageItemValue
				averageLocationValue
				id
				itemCount
				itemsComplete
				locationsComplete
				itemCountVarn
				locationCount
				orderNumber
				projectTitle
				workType
				issuedDate
				documentCount
				orderValueTotal
				orderValueTotalComplete
				orderValueTotalApplied
				imageCount
				statusDescription
                startDate
                endDate
                areaId
                worktypeId
                orderStatusId
      }
    }
  }
}
`
const GET_ALL_ORDER_HEADERS = gql`
	query GetOrderheadersWithValues {
		orderheaderWithValues {
			nodes {
				area
				averageItemValue
				averageLocationValue
				id
				itemCount
				itemsComplete
				locationsComplete
				itemCountVarn
				locationCount
				orderNumber
				projectTitle
				workType
				issuedDate
				documentCount
				orderValueTotal
				orderValueTotalComplete
				orderValueTotalApplied
				imageCount
				statusDescription
			}
		}
	}
`;

const defaultDate = DateTime.now().toISODate();

const OrderheaderForm = ({ hideModal }) => {

    const [areasOpen, setAreasOpen] = React.useState(false);
    const [areaOptions, setAreaOptions] = React.useState([])
    const [worktypesOpen, setWorktypesOpen] = React.useState(false);
    const [worktypeOptions, setworktypeOptions] = React.useState([])
    const [orderStatusOpen, setOrderStatusOpen] = React.useState(false);
    const [orderStatusOptions, setOrderStatusOptions] = React.useState([])

    const [getAreas, { loading: areasLoading }] = useLazyQuery(GET_ALL_AREAS, {
        onCompleted: data => setAreaOptions(data.areas.nodes),
        fetchPolicy: 'cache-and-network'
    })

    const [getWorktypes, { loading: worktypesLoading }] = useLazyQuery(GET_ALL_WORKTYPES, {
        onCompleted: data => setworktypeOptions(data.worktypes.nodes),
        fetchPolicy: 'cache-and-network'
    })

    const [getOrderheaderStatuses, { loading: orderheaderStatusLoading }] = useLazyQuery(GET_ALL_ORDERHEADER_STATUSES, {
        onCompleted: data => setOrderStatusOptions(data.orderheaderStatuses.nodes),
        fetchPolicy: 'cache-and-network'
    })

    const [submitOrderheader] = useMutation(CREATE_ORDERHEADER, {
        refetchQueries: [
            { query: GET_ALL_ORDER_HEADERS }
        ],
        // awaitRefetchQueries: true,
        onCompleted: data => { console.log(data); hideModal() }
    })

    React.useEffect(() => {
        if (worktypesOpen && worktypeOptions.length === 0) {
            getWorktypes()
        }
    }, [getWorktypes, worktypeOptions.length, worktypesOpen]);

    React.useEffect(() => {
        if (areasOpen && areaOptions.length === 0) {
            getAreas()
        }
    }, [areaOptions.length, areasOpen, getAreas]);

    React.useEffect(() => {
        if (orderStatusOpen && orderStatusOptions.length === 0) {
            getOrderheaderStatuses()
        }
    }, [getOrderheaderStatuses, orderStatusOpen, orderStatusOptions.length]);

    function handleSubmit(event) {
        event.preventDefault()
        let fd = new FormData(event.target);
        const areaId = areaOptions.filter(obj => obj.description === fd.get('areaId'))[0].id
        const worktypeId = worktypeOptions.filter(obj => obj.description === fd.get('worktypeId'))[0].id
        const orderStatusId = orderStatusOptions.filter(obj => obj.statusDescription === fd.get('orderStatusId'))[0].id

        const apiObject = {
            orderNumber: fd.get('orderNumber'),
            projectTitle: fd.get('projectTitle'),
            areaId,
            worktypeId,
            orderStatusId,
            notes: fd.get('notes'),
            startDate: fd.get('startDate'),
            endDate: fd.get('endDate'),
            issuedDate: fd.get('issuedDate'),
        }
        submitOrderheader({
            variables: { input: apiObject }
        })
    }



    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={5} >
                <Grid item xs={6}>
                    <TextField
                        label='Order Number'
                        name='orderNumber'
                        required
                        variant='filled'
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label='Project Title'
                        name='projectTitle'
                        required
                        variant='filled'
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <Autocomplete
                        open={areasOpen}
                        onOpen={() => {
                            setAreasOpen(true);
                        }}
                        onClose={() => {
                            setAreasOpen(false);
                        }}
                        isOptionEqualToValue={(option, value) => option.description === value.description}
                        getOptionLabel={(option) => option.description}
                        options={areaOptions}
                        loading={areasLoading}
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
                                            {areasLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
                        open={worktypesOpen}
                        onOpen={() => {
                            setWorktypesOpen(true);
                        }}
                        onClose={() => {
                            setWorktypesOpen(false);
                        }}
                        isOptionEqualToValue={(option, value) => option.description === value.description}
                        getOptionLabel={(option) => option.description}
                        options={worktypeOptions}
                        loading={worktypesLoading}
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
                                            {worktypesLoading ? <CircularProgress color="inherit" size={20} /> : null}
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

                        open={orderStatusOpen}
                        onOpen={() => {
                            setOrderStatusOpen(true);
                        }}
                        onClose={() => {
                            setOrderStatusOpen(false);
                        }}
                        isOptionEqualToValue={(option, value) => option.statusDescription === value.statusDescription}
                        getOptionLabel={(option) => option.statusDescription}
                        options={orderStatusOptions}
                        loading={orderheaderStatusLoading}
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
                                            {areasLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
                        InputLabelProps={{ shrink: true }}
                        defaultValue={defaultDate}
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
                        InputLabelProps={{ shrink: true }}
                        defaultValue={defaultDate}
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
                        InputLabelProps={{ shrink: true }}
                        defaultValue={defaultDate}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Notes"
                        multiline
                        name="notes"
                        variant="filled"
                        fullWidth
                        defaultValue={"No Notes"}
                        rows={5}
                    />
                </Grid>
                <Grid item xs={6}>
                    <CreateButton type={"submit"} label={"SUBMIT"} />
                </Grid>
                <Grid item xs={6}>
                    <CancelButton label={"CLOSE"} type={"button"} onClick={hideModal} fullWidth />
                </Grid>
            </Grid>
        </form>
    )
}

const AddOrderheaderForm = () => {

    const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder;

    const [showModal, hideModal] = useModal(() => (
        <ReactModal isOpen appElement={document.getElementById('root')}>
            <h3>CREATE WORK ORDER</h3>
            <hr />
            <OrderheaderForm hideModal={hideModal} />
        </ReactModal>
    ));

    return (
        <div>
            <CreateButton
                label='CREATE WORK ORDER'
                onClick={showModal}
                disabled={selectedOrder !== false}
            />
        </div>
    );
};

export default AddOrderheaderForm;