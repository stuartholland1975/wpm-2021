import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Box, TextField, IconButton, Grid, CircularProgress } from '@mui/material'
import { MdOutlineAdd, MdRemove } from "react-icons/md";
import ReactModal from 'react-modal'
import { useMutation, useReactiveVar, gql, useQuery } from '@apollo/client'
import { gridSelectionsVar } from '../../../cache'
import { useModal } from 'react-modal-hook'
import CreateButton from '../../ui-components/buttons/CreateButton'
import CancelButton from '../../ui-components/buttons/CancelButton'
import { ErrorMessage } from '@hookform/error-message';
import { GET_SINGLE_ORDERHEADER } from '../../../gql/queries/orderheaders';
import SelectItemType from '../Select/SelectItemType';
import SelectActivityCode from '../Select/SelectActivityCode';
import SelectSiteLocation from '../Select/SelectSiteLocation';
import { GET_ORDER_LOCATIONS } from '../../../gql/queries/locations';

const GET_MAX_ITEM_NUMBER = gql`
query GetMaxItemNumber($id: Int!) {
  wpmGraphqlGetLastItemNumber(orderId: $id)
}
`



const ItemsForm = ({ hideModal }) => {

    const [maxItemNumber, setMaxItemNumber] = React.useState()
    const [orderLocations, setOrderLocations] = React.useState([{ id: '', reference: '' }])

    const defaultValues = {
        itemNumber: maxItemNumber ? maxItemNumber + 1 : 1,
        qtyOrdered: 0,
        valueBaseMaterials: 0,
        packNumber: 0,
        itemType: { id: 1, typeShort: 'BOQ' },
        ratesetPrice: { id: 4, activityCode: 'NSMAT' },
        ratesetDescription: { id: 1, description: 'Contract Tendered Rates' },
        siteLocation: { id: orderLocations[0].id, reference: orderLocations[0].reference }
    }
    console.log(defaultValues)
    const { register, control, handleSubmit, reset, trigger, setError } = useForm({
        mode: "onChange"
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "orderdetail"
    });


    const { loading: maxItemNumberLoading } = useQuery(GET_MAX_ITEM_NUMBER, {
        variables: { id: 2 },
        onCompleted: data => setMaxItemNumber(data.wpmGraphqlGetLastItemNumber),
    })

    const { loading: locationsLoading } = useQuery(GET_ORDER_LOCATIONS, {
        variables: { id: 2 },
        onCompleted: data => setOrderLocations(prevState => [...prevState, ...data.sitelocationWithValues.nodes]),
        fetchPolicy: 'cache-and-network'
    })

    React.useEffect(() => {
        append(defaultValues)
        setMaxItemNumber(prevState => prevState + 1)
    }, [])

    const onSubmit = data => {
        console.log(data)
    }

    if (maxItemNumberLoading || locationsLoading) return <CircularProgress />

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 style={{ textDecoration: 'underline', textAlign: 'center' }}>CREATE ITEMS</h2>
                <Grid container mb={1} >
                    <Grid item xs={6} >
                        <CreateButton type={"submit"} label={"SUBMIT"} />
                    </Grid>
                    <Grid item xs={6}>
                        <CancelButton label={"CLOSE"} type={"button"} onClick={hideModal} fullWidth />
                    </Grid>
                </Grid>
                {fields.map((field, index) => <Grid container spacing={2} key={field.id} mt={2} >
                    <Grid item xs={1}>
                        <TextField
                            label={"Item Number"}
                            {...register(`orderdetail.${index}.itemNumber`, { required: 'Please Complete This Field' })}
                            autoFocus
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            label={"Qty Ordered"}
                            variant="filled"
                            {...register(`orderdetail.${index}.qtyOrdered`, { required: 'Please Complete This Field' })}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <SelectSiteLocation control={control} fieldName={`orderdetail.${index}.siteLocation`} orderLocations={orderLocations} loading={locationsLoading} />
                    </Grid>
                    <Grid item xs={2}>
                        <SelectItemType control={control} fieldName={`orderdetail.${index}.itemType`} />
                    </Grid>
                    <Grid item xs={3} >
                        <SelectActivityCode control={control}
                            fieldNameRH={`orderdetail.${index}.ratesetDescription`}
                            fieldNameAC={`orderdetail.${index}.ratesetPrice`} />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            label="Material Pack Number"
                            {...register(`orderdetail.${index}.packNumber`)}
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            label="Material Pack Value"
                            {...register(`orderdetail.${index}.valueBaseMaterials`)}
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={0.5}>
                        <IconButton edge='end' sx={{ color: 'blue', fontSize: 40, background: 'lightgrey' }}
                            onClick={() => { setMaxItemNumber(prevState => prevState + 1); append(defaultValues) }}

                        >
                            < MdOutlineAdd />
                        </IconButton>
                    </Grid>
                    <Grid item xs={0.5}>
                        <IconButton edge='start' sx={{ color: 'red', fontSize: 40, background: 'lightgrey' }} onClick={() => {
                            remove(index);
                        }}>
                            < MdRemove />
                        </IconButton>
                    </Grid>
                </Grid>
                )
                }
            </form >
        </>
    )
}


const CreateItemsForm = () => {
    const [showModal, hideModal] = useModal(() => (
        <ReactModal isOpen appElement={document.getElementById('root')}>
            <ItemsForm hideModal={hideModal} />
        </ReactModal>
    ));

    return (
        <div>
            <CreateButton
                label='CREATE ORDER ITEMS'
                onClick={showModal}
            //  disabled={selectedLocation !== false}
            />
        </div>
    );
};

export default CreateItemsForm;