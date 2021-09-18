import React from 'react';
import {Grid, TextField, MenuItem, Select, FormControl, CircularProgress, Divider} from "@mui/material";
import CreateButton from "../ui-components/buttons/CreateButton";
import CancelButton from "../ui-components/buttons/CancelButton";
import {gql, useQuery} from "@apollo/client";
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
const defaultDate = DateTime.now().toISODate()

const ImageForm = ({hideModal}) => {
    const {data, loading} = useQuery(GET_IMAGE_TYPES);
    const [imageType, setImageType] = React.useState("");


    const handleChangeImageType = event => {
        return setImageType(event.target.value);
    }

    const handleSubmit = event => console.log(event)

    if (loading) return <CircularProgress/>

    return (
        <FormControl fullWidth onSbmit={handleSubmit}>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <TextField
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
                    <CreateButton type={"submit"} label={"SAVE IMAGE"} fullWidth/>
                </Grid>
                <Grid item xs={6}>
                    <CancelButton label={"CANCEL"} fullWidth onClick={hideModal}/>
                </Grid>
            </Grid>
        </FormControl>

    );
};

export default ImageForm;