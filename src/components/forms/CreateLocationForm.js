import { useReactiveVar, gql, useMutation } from '@apollo/client';
import { gridSelectionsVar } from '../../cache';
import CreateButton from '../ui-components/buttons/CreateButton';
import CancelButton from '../ui-components/buttons/CancelButton';
import { TextField, Grid } from '@mui/material';
import { useModal } from 'react-modal-hook';
import ReactModal from 'react-modal';
import { GET_ORDER_LOCATIONS } from '../order-admin/OrderLocations';

const CREATE_SITE_LOCATION = gql`
mutation CreateSiteLocation($id: Int!, $reference: String!) {
createSitelocation(input: {sitelocation: {reference: $reference, orderheaderId: $id}}) {
    sitelocation {
        id
    }
  }
}
`


const LocationForm = ({ hideModal }) => {
    const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder;

    const [createLocation] = useMutation(CREATE_SITE_LOCATION, {
        refetchQueries: [
            {
                query: GET_ORDER_LOCATIONS,
                variables: { id: selectedOrder }
            }
        ],
        awaitRefetchQueries: true,
        onCompleted: () => hideModal()
    })

    const handleSubmit = (event) => {
        console.log("END")
        event.preventDefault()
        let fd = new FormData(event.target);


        createLocation({
            variables: { id: selectedOrder, reference: fd.get('reference') }
        })
    }

    return (
        <form onSubmit={handleSubmit}>

            <Grid container spacing={5} mt={2}>
                <Grid item xs={12}>
                    <TextField
                        label='Reference'
                        name='reference'
                        required
                        variant='filled'
                        fullWidth
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
    );
};
const CreateLocationForm = () => {


    const selectedLocation = useReactiveVar(gridSelectionsVar).selectedLocation

    const [showModal, hideModal] = useModal(() => (
        <ReactModal isOpen appElement={document.getElementById('root')}>
            <h3>CREATE SITE LOCATION</h3>
            <hr />
            <LocationForm hideModal={hideModal} />
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

export default CreateLocationForm;