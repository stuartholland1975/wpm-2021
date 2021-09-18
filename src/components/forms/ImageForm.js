import React from 'react';
import {Grid, TextField, MenuItem, CircularProgress} from "@mui/material";
import CreateButton from "../ui-components/buttons/CreateButton";
import CancelButton from "../ui-components/buttons/CancelButton";
import {gql, useMutation, useQuery} from "@apollo/client";
import {useForm} from "react-hook-form";
import {DateTime} from "luxon";

const GET_IMAGE_TYPES = gql`
  query GetImageTypes {
    imageTypes {
      nodes {
        id
        longName
        shortName
      }
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation CreateImage($input: CreateImageInput!) {
    createImage(input: $input) {
      image {
        orderheaderId
      }
    }
  }
`;
const defaultDate = DateTime.now().toISODate()

const ImageForm = ({hideModal}) => {
    const {register, handleSubmit} = useForm();

    const {data, loading} = useQuery(GET_IMAGE_TYPES);
    const [imageType, setImageType] = React.useState("");
   // const [uploadImage] = useMutation((UPLOAD_IMAGE))

    const handleChangeImageType = event => {
        return setImageType(event.target.value);
    }

    const onSubmit = data => {
        console.log(data)
    }

    if (loading) return <CircularProgress/>

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <TextField
                        {...register("dateTakenManual")}
                        label="Work Done Date"
                        type="date"
                        name="dateTakenManual"
                        required
                        variant="filled"
                        fullWidth
                        InputLabelProps={{shrink: true}}
                        defaultValue={defaultDate}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Select Image File"
                        {...register("headerImageFile")}
                        type="file"
                        fullWidth
                        variant="filled"
                        InputLabelProps={{shrink: true}}
                        name="headerImageFile"
                        required/>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        select
                        label="Image type"
                        variant="filled"
                        fullWidth
                        value={imageType}
                        InputLabelProps={{shrink: true}}
                        onChange={handleChangeImageType}
                    >
                        {data.imageTypes.nodes.map(item => <MenuItem key={item.id} value={item.id}>
                            {item.longName}
                        </MenuItem>)}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <CreateButton type={'submit'} label={"SAVE IMAGE"} fullWidth/>
                </Grid>
                <Grid item xs={6}>
                    <CancelButton label={"CANCEL"} fullWidth onClick={hideModal}/>
                </Grid>
            </Grid>
        </form>

    );
};

export default ImageForm;