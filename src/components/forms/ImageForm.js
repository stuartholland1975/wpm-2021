import {useMutation, gql, useQuery} from "@apollo/client";
import CreateButton from "../ui-components/buttons/CreateButton";
import CancelButton from "../ui-components/buttons/CancelButton";
import {Grid, TextField, MenuItem} from "@mui/material";
import React from "react";
import {DateTime} from "luxon";
import EXIF from "exif-js";
import {gridSelectionsVar} from "../../cache";

const dt = DateTime.now().toISO();
const defaultDate = DateTime.now().toISODate();


const UPLOAD_IMAGE = gql`
  mutation CreateImage($input: CreateImageInput!) {
    createImage(input: $input) {
      image {
        orderheaderId
      }
    }
  }
`;

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

/*
const GET_ORDER_LOCATION_IMAGES = gql`
  query GetOrderLocationImages($sitelocationId: Int!) {
    images(
      filter: { sitelocationId: { equalTo: $sitelocationId } }
      orderBy: IMAGE_TYPE_ID_ASC
    ) {
      nodes {
        headerImageFile
        id
        createdAt
        dateTakenManual
        exif
        imageTypeId
        orderheaderId
        sitelocationId
        sitelocation {
          reference
          worksheetReference
        }
        imageType {
          id
          shortName
          longName
        }
      }
    }
  }
`;

const GET_SINGLE_ORDERHEADER = gql`
  query GetSingleOrderheader($id: Int!) {
    orderheaderWithValue(id: $id) {
      area
      averageItemValue
      averageLocationValue
      id
      itemCount
      itemCountBoq
      itemCountVarn
      itemsComplete
      itemsCompleteBoq
      itemsCompleteVarn
      locationCount
      orderNumber
      orderValueLabour
      orderValueMaterials
      orderValueOther
      orderValueTotal
      orderValueTotalApplied
      orderValueTotalBoq
      orderValueTotalComplete
      orderValueTotalVarn
      projectTitle
      workType
      issuedDate
      documentCount
      imageCount
    }
  }
`;
*/

const ImageForm = ({hideModal}) => {

    const [uploadImage] = useMutation(UPLOAD_IMAGE, {
        /*refetchQueries: [
          {
            query: GET_ORDER_LOCATION_IMAGES,
            variables: { sitelocationId: Number(selectedLocation) },
            fetchPolicy: 'cache-first'
          },
          {
            query: GET_SINGLE_ORDERHEADER,
            variables: { id: Number(history.location.state) },
          },
        ],
        awaitRefetchQueries: true,*/
        onCompleted: () => hideModal()
    });
    const [itemType, setItemType] = React.useState({});
    const [imageExif, setImageExif] = React.useState({});


    const handleChange = (event) => {
        setItemType(event.target.value);
    };
    const {data} = useQuery(GET_IMAGE_TYPES);

    const handleSubmit = (event) => {
        event.preventDefault();
        const fd = new FormData(event.target);
        const dateTakenManual = fd.get("dateTakenManual");
        const headerImageFile = fd.get("headerImageFile");
        const exifData = EXIF.getData(event.target.files[0], function () {

            const data = this.exifdata
            let pairs = Object.entries(data)
            pairs.forEach(entry => {
                const [key, value] = entry
                setImageExif(prevState => ({
                    ...prevState,
                    [key]: typeof value === 'string' ? value.replace(/\0.*$/g, '') : value
                }))
            })
        })
        console.log(imageExif)

        uploadImage({
            variables: {
                input: {
                    image: {
                        createdAt: dt,
                        dateTakenManual,
                        headerImageFile,

                        imageTypeId: itemType.id,
                        sitelocationId: gridSelectionsVar().selectedLocation.id,
                        exif: exifData,
                    },
                },
            },
        })
    };
    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
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
                        //  inputProps={{ accept: ".pdf" }}
                        variant="filled"
                        InputLabelProps={{shrink: true}}
                        name="headerImageFile"
                        required
                        onChange={(event) =>
                            (
                                event.target.files.length > 0
                                    ? event.target.files[0].name
                                    : ""

                            )
                        }/>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label={"Item Type"}
                        select
                        InputLabelProps={{shrink: true}}
                        variant={"filled"}
                        fullWidth
                        value={itemType}
                        onChange={handleChange}
                    >
                        {data &&
                        data.imageTypes.nodes.map((item) => (
                            <MenuItem key={item.id} value={item}>
                                {item.longName}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <CreateButton type={"submit"} label={"upload image"}/>
                </Grid>
                <Grid item xs={6}>
                    <CancelButton label={"CLOSE"} type={"button"} onClick={hideModal} fullWidth/>
                </Grid>
            </Grid>
        </form>
    );
};

export default ImageForm;
