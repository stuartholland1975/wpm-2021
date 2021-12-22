import { useReactiveVar, gql, useMutation } from '@apollo/client';
import { gridSelectionsVar } from '../../../../cache';
import CreateButton from '../../../ui-components/buttons/CreateButton';
import CancelButton from '../../../ui-components/buttons/CancelButton';
import { TextField, Grid } from '@mui/material';
import { useForm } from "react-hook-form";

const CreateLocationWithDetailForm = ({ nextStep, prevStep, setLocationValues, projectTitle }) => {

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        mode: "onChange"
    });


    const onSubmit = (event) => {
        console.log("END")

    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>{`CREATE LOCATION FOR PROJECT ${projectTitle}`}</h3>
            <Grid container spacing={5} mt={2}>
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
                    <CreateButton type={"submit"} label={"NEXT"} onClick={nextStep} />
                </Grid>
            </Grid>

        </form>
    );
};


export default CreateLocationWithDetailForm;