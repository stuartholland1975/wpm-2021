import React from 'react';
import CreateOrderForm from './CreateOrderForm';

const BlankForm = () => <div>BLANK FORM</div>

const MultiStepForm = () => {
    const [step, setStep] = React.useState(1)
    const [orderFields, setOrderFields] = React.useState({
        firstName: '', lastName: '', email: '', occupation: '', city: '', bio: ''
    })

    const nextStep = () => setStep(step => step + 1)
    const prevStep = () => setStep(step => step - 1)
    const handleChange = input => e => {
        setOrderFields(fields => ({ ...fields, [input]: e.target.value }))
    };
    const { firstName, lastName, email, occupation, city, bio } = orderFields
    const values = { firstName, lastName, email, occupation, city, bio }

    switch (step) {
        case 1:
            return (
                <CreateOrderForm
                    nextStep={nextStep}
                    handleChange={handleChange}
                    values={values}
                    confirmLabel="Next"
                    cancelLabel="Close"
                />
            );
        case 2:
            return (
                <BlankForm
                    nextStep={nextStep}
                    prevStep={prevStep}
                    handleChange={handleChange}
                    values={values}
                    confirmLabel="Next"
                    cancelLabel="Back"
                />
            );
        case 3:
            return (
                <BlankForm
                    nextStep={nextStep}
                    prevStep={prevStep}
                    values={values}
                    confirmLabel="Submit"
                    cancelLabel="Back"
                />
            );
        case 4:
            return <CreateOrderForm />;
        default:
            (console.log('This is a multi-step form built with React.'))
    }
}


export default MultiStepForm;