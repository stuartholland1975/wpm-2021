import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { TextField, IconButton, Grid } from '@mui/material'
import { MdOutlineAdd, MdRemove } from "react-icons/md";
import ReactModal from 'react-modal'
import { useMutation, useReactiveVar } from '@apollo/client'
import { gridSelectionsVar } from '../../../cache'
import { useModal } from 'react-modal-hook'
import CreateButton from '../../ui-components/buttons/CreateButton'
import CancelButton from '../../ui-components/buttons/CancelButton'
import { CREATE_MANY_LOCATIONS } from '../../../gql/mutations/locations';
import { GET_ORDER_LOCATIONS } from '../../../gql/queries/locations';
import { ErrorMessage } from '@hookform/error-message';
import { GET_SINGLE_ORDERHEADER } from '../../../gql/queries/orderheaders';

const defaultValues = {
    reference: null
}


const LocationsForm = ({ hideModal }) => {

    const { register, control, handleSubmit, trigger, formState: { errors } } = useForm({
        mode: "onChange"
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "sitelocation"
    });

    const [createManyLocations] = useMutation(CREATE_MANY_LOCATIONS, {
        refetchQueries: [
            {
                query: GET_ORDER_LOCATIONS,
                variables: {
                    id: gridSelectionsVar().selectedOrder.id
                }
            },
            {
                query: GET_SINGLE_ORDERHEADER,
                variables: { id: gridSelectionsVar().selectedOrder.id }
            }
        ],
        awaitRefetchQueries: true,
        onCompleted: () => hideModal()
    })

    const onSubmit = data => {
        const apiObject =
            data.sitelocation.map(item => ({
                ...item,
                orderheaderId: gridSelectionsVar().selectedOrder.id
            }))

        createManyLocations({ variables: { input: apiObject } })
    };

    React.useEffect(() => {
        append(defaultValues)
    }, [append])





    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2 style={{ textDecoration: 'underline', textAlign: 'center' }}>CREATE LOCATIONS</h2>
            <Grid container mb={1} >
                <Grid item xs={6} >
                    <CreateButton type={"submit"} label={"SUBMIT"} />
                </Grid>
                <Grid item xs={6}>
                    <CancelButton label={"CLOSE"} type={"button"} onClick={hideModal} fullWidth />
                </Grid>
            </Grid>
            {fields.map((item, index) =>
                <Grid container spacing={2} key={item.id} mt={2} >
                    <Grid item xs={11}>
                        <TextField
                            label={"Location Reference"}
                            {...register(`sitelocation.${index}.reference`, { required: 'Please Complete This Field' })}
                            autoFocus
                            variant="filled"
                            fullWidth
                        />
                        <ErrorMessage errors={errors} name={`sitelocation.${index}.reference`} render={({ message }) => <p style={{ color: 'red' }}>{message}</p>} />

                    </Grid>

                    <Grid item xs={0.5} >
                        <IconButton edge='end' sx={{ color: 'blue', fontSize: 40, background: 'lightgrey' }}
                            /* onClick={() => {
                            trigger()
                            append(defaultValues);
                            }} */
                            onClick={async () => {
                                await trigger(`sitelocation.${index}.reference`, { shouldFocus: true })
                                    .then((res) => res && append(defaultValues));
                            }}
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
                </Grid>)

            }

        </form >

    );
};

const CreateLocationsForm = () => {


    const selectedLocation = useReactiveVar(gridSelectionsVar).selectedLocation

    const [showModal, hideModal] = useModal(() => (
        <ReactModal isOpen appElement={document.getElementById('root')}>
            <LocationsForm hideModal={hideModal} />
        </ReactModal>
    ));

    return (
        <div>
            <CreateButton
                label='CREATE SITE LOCATION'
                onClick={showModal}
                disabled={selectedLocation !== false}
            />
        </div>
    );
};

export default CreateLocationsForm;