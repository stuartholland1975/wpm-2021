import React from 'react';
import CreateOrderheaderForm from './CreateOrderheaderForm';
import CreateLocationWithDetailForm from './CreateLocationWithDetailForm'
import CreateItemWithDetailForm from "./CreateItemWithDetailForm";
import { useMutation } from '@apollo/client';
import { CREATE_ORDERHEADER } from '../../../../gql/mutations/orderheaders';


const BlankForm = () => <div>BLANK FORM</div>

const CreateOrderWithDetailForm = ({ hideModal }) => {
	const [orderheaderValues, setOrderheaderValues] = React.useState()
	const [locationValues, setLocationValues] = React.useState(false)
	const [itemValues, setItemValues] = React.useState([])
	const [step, setStep] = React.useState(1)
	const nextStep = () => setStep(step => step + 1)
	const prevStep = () => setStep(step => step - 1)

	const [submitOrderData] = useMutation(CREATE_ORDERHEADER, {
		onCompleted: data => setOrderheaderValues(data.createOrderheader.orderheader.orderheaderWithValueById)
	})

	const onSubmitOrderData = data => {
		const { areaId, orderStatusId, worktypeId } = data
		const apiObject = {
			...data,
			areaId: areaId.id,
			orderStatusId: orderStatusId.id,
			worktypeId: worktypeId.id
		}
		setOrderheaderValues(apiObject)
		nextStep()
	}

	const onSubmitLocationData = data => {
		setLocationValues(data)
		//nextStep()
	}

	const onSubmitItemData = data => {
		setItemValues(data)
		nextStep()
	}

	switch (step) {
		case 1:
			return (
				<CreateOrderheaderForm
					nextStep={nextStep}
					setOrderheaderValues={setOrderheaderValues}
					hideModal={hideModal}
					onSubmit={onSubmitOrderData}
				/>
			);
		case 2:
			return (
				<>
					<CreateLocationWithDetailForm
						prevStep={prevStep}
						onSubmit={onSubmitLocationData}
					/>
					{locationValues && <CreateItemWithDetailForm
						onSubmit={onSubmitItemData}
					/>}

				</>
			);
		/* case 3:
			return (
				<CreateItemWithDetailForm
					nextStep={nextStep}
					prevStep={prevStep}
					locationValues={locationValues}
					setItemValues={setItemValues}
					hideModal={hideModal}
				/>
			); */

		case 3: return (
			<h1>SUBMISSION PAGE</h1>
		)

		default:
			(console.log('This is a multi-step form built with React.'))
	}
}


export default CreateOrderWithDetailForm;