import React from 'react';
import { gridSelectionsVar } from '../../cache';
import { useReactiveVar, useMutation } from '@apollo/client';
import { DELETE_LOCATION } from '../../gql/mutations/locations';
import { confirmAlert } from 'react-confirm-alert';
import DeleteButton from '../ui-components/buttons/DeleteButton';
import { GET_ORDER_LOCATIONS } from '../../gql/queries/locations';
import { GET_SINGLE_ORDERHEADER } from '../../gql/queries/orderheaders';


const DeleteLocationForm = () => {
    const selectedLocation = useReactiveVar(gridSelectionsVar).selectedLocation
    const [deleteSelectedLocation] = useMutation(DELETE_LOCATION, {
        refetchQueries: [{
            query: GET_ORDER_LOCATIONS,
            variables: { id: gridSelectionsVar().selectedOrder.id }
        }, {
            query: GET_SINGLE_ORDERHEADER,
            variables: { id: gridSelectionsVar().selectedOrder.id }
        }],
        awaitRefetchQueries: true,
    })



    const onSubmit = () => confirmAlert({
        customUI: ({ onClose }) => {
            return (
                <div className="custom-ui">
                    <h1>Confirm Location Deletion</h1>
                    <p>{`Are You Sure You Want To Delete Location: ${selectedLocation.reference}`}</p>
                    <button onClick={() => deleteSelectedLocation({
                        variables: { id: selectedLocation.id },
                    }).then(() => onClose())}
                    >SUBMIT
                    </button>
                    <button onClick={() => {
                        onClose()
                    }}
                    >CANCEL
                    </button>
                </div>
            );
        }
    });

    return (
        <div>
            <DeleteButton
                label='delete location'
                disabled={
                    selectedLocation === false ||
                    (selectedLocation && selectedLocation.complete) || (selectedLocation && selectedLocation.itemCount > 0)
                }
                onClick={onSubmit}
            />
        </div>
    );
};

export default DeleteLocationForm;