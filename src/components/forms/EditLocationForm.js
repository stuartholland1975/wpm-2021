import { useReactiveVar, gql, useMutation } from '@apollo/client';
import { gridSelectionsVar } from '../../cache';
import CreateButton from '../ui-components/buttons/CreateButton';
import CancelButton from '../ui-components/buttons/CancelButton';
import { TextField, Grid } from '@mui/material';
import { useModal } from 'react-modal-hook';
import ReactModal from 'react-modal';
import { GET_ORDER_LOCATIONS } from '../order-admin/OrderLocations';
import EditButton from '../ui-components/buttons/EditButton';

const EDIT_SITE_LOCATION = gql`
mutation CreateSiteLocation($id: Int!, $reference: String!) {
updateSitelocation(input: {patch: {reference: $reference}, id: $id}) {
    sitelocation {
        id
        reference
    }
  }
}
`


const LocationForm = ({ hideModal }) => {
    const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder;
    const selectedLocation = useReactiveVar(gridSelectionsVar).selectedLocation

    const [EditLocation] = useMutation(EDIT_SITE_LOCATION, {
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
        event.preventDefault()
        let fd = new FormData(event.target);


        EditLocation({
            variables: { id: selectedLocation.id, reference: fd.get('reference') }
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
                        defaultValue={selectedLocation.reference}
                        autoFocus
                    />
                </Grid>
                <Grid item xs={6}>
                    <CreateButton type={"submit"} label={"UPDATE"} />
                </Grid>
                <Grid item xs={6}>
                    <CancelButton label={"CLOSE"} type={"button"} onClick={hideModal} fullWidth />
                </Grid>
            </Grid>

        </form>
    );
};
const EditLocationForm = () => {


    const selectedLocation = useReactiveVar(gridSelectionsVar).selectedLocation

    const [showModal, hideModal] = useModal(() => (
        <ReactModal isOpen appElement={document.getElementById('root')}>
            <h3>EDIT SITE LOCATION</h3>
            <hr />
            <LocationForm hideModal={hideModal} />
        </ReactModal>
    ));

    return (
        <div>
            <EditButton
                label='EDIT SITE LOCATION'
                onClick={showModal}
                disabled={selectedLocation === false}
            />
        </div>
    );
};

export default EditLocationForm;