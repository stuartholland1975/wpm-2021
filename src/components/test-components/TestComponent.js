import React from 'react'
import NavigationButton from '../ui-components/buttons/NavigationButton'
import CreateButton from '../ui-components/buttons/CreateButton'
import EditButton from '../ui-components/buttons/EditButton'
import DeleteButton from '../ui-components/buttons/DeleteButton'
import ToggleButton from '../ui-components/buttons/ToggleButton'
import ImageForm from "../forms/ImageForm";

const TestComponent = () => {
    return (
        <div>
            <NavigationButton label="navigation button" />
            <CreateButton label="create Button" />
            <EditButton label="edit button" />
            <DeleteButton label="delete button" />
            <ToggleButton label="toggle button" />
            <hr/>
            <ImageForm/>
        </div>
    )
}

export default TestComponent
