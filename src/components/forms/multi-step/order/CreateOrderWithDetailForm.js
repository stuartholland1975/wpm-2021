import React from 'react';
import CreateOrderheaderForm from './CreateOrderheaderForm';
import CreateLocationWithDetailForm from './CreateLocationWithDetailForm'


const BlankForm = () => <div>BLANK FORM</div>

const CreateOrderWithDetailForm = ({ hideModal }) => {
	const [orderheaderValues, setOrderheaderValues] = React.useState()
	const [locationValues, setLocationValues] = React.useState()

	const [step, setStep] = React.useState(1)
	const nextStep = () => setStep(step => step + 1)
	const prevStep = () => setStep(step => step - 1)
	switch (step) {
		case 1:
			return (
				<CreateOrderheaderForm
					nextStep={nextStep}
					setOrderheaderValues={setOrderheaderValues}
					hideModal={hideModal}
				/>
			);
		case 2:
			return (
				<CreateLocationWithDetailForm
					nextStep={nextStep}
					prevStep={prevStep}
					setLocationValues={setLocationValues}
					projectTitle={orderheaderValues?.projectTitle}
				/>
			);
		case 3:
			return (
				<BlankForm
					nextStep={nextStep}
					prevStep={prevStep}
				/>
			);

		default:
			(console.log('This is a multi-step form built with React.'))
	}
}


export default CreateOrderWithDetailForm;