import { gql, useQuery } from '@apollo/client'
import { useForm } from "react-hook-form";
import { TextField, Grid } from '@mui/material';
import CreateButton from '../../../ui-components/buttons/CreateButton';
import CancelButton from '../../../ui-components/buttons/CancelButton';
import SelectArea from '../../Select/SelectArea';
import SelectWorktype from '../../Select/SelectWorktype';
import SelectStatus from '../../Select/SelectOrderheaderStatus';
import { DateTime } from 'luxon'



const CHECK_ORDER_NUMBER = gql`
query CheckOrderNumber {
    orderheaders {
    nodes {
      orderNumber
    }
  }
}
`
const defaultDate = DateTime.now().toISODate();

const CreateOrderheaderForm = ({ nextStep, setOrderheaderValues, hideModal, onSubmit }) => {
	const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
		mode: "onChange",
		defaultValues: {
			areaId: { id: 1, description: 'North' },
			worktypeId: { id: 1, description: "HV Overhead Refurbishment" },
			orderStatusId: { id: 1, statusDescription: 'RECEIVED' }
		}
	});



	const { data: orderHeaders } = useQuery(CHECK_ORDER_NUMBER)

	const orderNumbers = orderHeaders?.orderheaders.nodes.map(item => item.orderNumber)

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h3>CREATE WORK ORDER</h3>
			<hr />
			<Grid container spacing={5}>
				<Grid item xs={6}>
					<TextField
						label='Order Number'
						variant='filled'
						fullWidth
						autoFocus
						{...register('orderNumber', {
							required: true,
							maxLength: 7,
							validate: value => !orderNumbers.includes(value)
						})}
					/>
					{errors.OrderNumber?.type === "required" &&
						<div style={{ color: 'red', fontWeight: 600, marginTop: 5 }}>Please Complete This Field</div>}
					{errors.OrderNumber?.type === "validate" &&
						<div style={{ color: 'red', fontWeight: 600, marginTop: 5 }}>This Order Number Already Exists</div>}
					{errors.OrderNumber?.type === "maxLength" &&
						<div style={{ color: 'red', fontWeight: 600, marginTop: 5 }}>Maximum Length 7 Characters</div>}
				</Grid>
				<Grid item xs={6}>
					<TextField
						label='Project Title'
						{...register('projectTitle', { required: true, maxLength: 50 })}
						variant='filled'
						fullWidth
					/>
				</Grid>
				<Grid item xs={4}>
					<SelectArea control={control} />
				</Grid>
				<Grid item xs={4}>
					<SelectWorktype control={control} />
				</Grid>
				<Grid item xs={4}>
					<SelectStatus control={control} />
				</Grid>
				<Grid item xs={4}>
					<TextField
						label="Start Date"
						type="date"
						{...register('startDate', { required: true })}
						variant="filled"
						fullWidth
						InputLabelProps={{ shrink: true }}
						defaultValue={defaultDate}
					/>
				</Grid>
				<Grid item xs={4}>
					<TextField
						label="End Date"
						type="date"
						{...register('endDate', { required: true })}
						variant="filled"
						fullWidth
						InputLabelProps={{ shrink: true }}
						defaultValue={defaultDate}
					/>
				</Grid>
				<Grid item xs={4}>
					<TextField
						label="Issued Date"
						type="date"

						{...register('issuedDate', { required: true })}
						variant="filled"
						fullWidth
						InputLabelProps={{ shrink: true }}
						defaultValue={defaultDate}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						label="Notes"
						multiline
						{...register('notes')}
						variant="filled"
						fullWidth
						defaultValue={"No Notes"}
						rows={5}
					/>
				</Grid>
				<Grid item xs={4}>
					<CancelButton label={"CLOSE"} type={"button"} onClick={hideModal} />
				</Grid>

				<Grid item xs={4}>
					<CancelButton label={"RESET"} type={"button"} onClick={() => reset()} />
				</Grid>
				<Grid item xs={4}>
					<CreateButton type={"submit"} label={"NEXT"} />
				</Grid>
			</Grid>
		</form>
	);
};

export default CreateOrderheaderForm;