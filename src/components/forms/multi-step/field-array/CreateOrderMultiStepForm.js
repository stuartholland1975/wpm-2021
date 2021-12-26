import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CreateOrderheaderForm from '../order/CreateOrderheaderForm';


const CreateOrderMultiStepForm = () => {
    return (
        <Switch>
            <Route exact path="/form">
                <CreateOrderheaderForm />
            </Route>
        </Switch>
    );
};

export default CreateOrderMultiStepForm;