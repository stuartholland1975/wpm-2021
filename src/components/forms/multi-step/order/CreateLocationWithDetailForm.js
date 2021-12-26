import { useMutation } from '@apollo/client';
import React from 'react';
import CancelButton from '../../../ui-components/buttons/CancelButton';
import { TextField, Grid } from '@mui/material';
import { useForm } from "react-hook-form";
import { CREATE_LOCATION } from '../../../../gql/mutations/locations';
//import CreatedOrderSummary from '../summaries/CreatedOrderSummary';
import ActionButton from '../../../ui-components/buttons/ActionButton';

const CreateLocationWithDetailForm = ({ prevStep, onSubmit }) => {

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        mode: "onChange"
    });

    return (
        <>
            {/*  <CreatedOrderSummary data={orderheaderValues} /> */}
            <hr />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={5} mt={2} mb={10}>
                    <Grid item xs={12}>
                        <TextField
                            label='Reference'
                            autoFocus
                            {...register('reference', {
                                required: true,
                            })}
                            variant='filled'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CancelButton label={"BACK"} type={"button"} onClick={prevStep} />
                    </Grid>
                    <Grid item xs={4}>
                        <CancelButton label={"RESET"} type={"button"} onClick={() => reset()} />
                    </Grid>
                    <Grid item xs={4}>
                        <ActionButton type={"submit"} label={"CREATE ITEMS"} />
                    </Grid>
                </Grid>
            </form>

        </>
    );
};


export default CreateLocationWithDetailForm;