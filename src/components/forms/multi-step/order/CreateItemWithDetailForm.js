import React from 'react';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { gql, useQuery, useReactiveVar } from '@apollo/client'
import { gridSelectionsVar } from '../../../../cache';
import { CircularProgress, TextField, Box, Container, IconButton } from '@mui/material';
import SelectItemType from '../../Select/SelectItemType';
import SelectActivityCode from '../../Select/SelectActivityCode';
import RemoveIcon from '@mui/icons-material/Remove';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { MdDelete } from "react-icons/md";
import CreateButton from "../../../ui-components/buttons/CreateButton";

const GET_MAX_ITEM_NUMBER = gql`
query GetMaxItemNumber($id: Int!) {
  wpmGraphqlGetLastItemNumber(orderId: $id)
}
`

function Item(props) {
	const { sx, ...other } = props;
	return (
		<Box
			sx={{
				//		bgcolor: '#b4cce4',
				//		p: 2,
				//		mt: 1,
				ml: 0.25,
				mr: 0.25,
				flexGrow: 1,
				color: 'black',
				...sx,
			}}
			{...other}
		/>
	);
}

const CreateItemWithDetailForm = ({ onSubmit }) => {


	const [maxItemNumber, setMaxItemNumber] = React.useState()

	const defaultValues = {
		itemNumber: maxItemNumber ? maxItemNumber + 1 : 1,
		qtyOrdered: 0,
		valueBaseMaterials: 0,
		packNumber: 0,
		itemType: { id: 1, typeShort: 'BOQ' },
		ratesetPrice: { id: 4, activityCode: 'NSMAT' },
	}

	const { register, control, handleSubmit, reset, trigger, setError } = useForm({
		defaultValues: defaultValues,
		mode: "onSubmit"
	});
	const { fields, append, remove } = useFieldArray({
		control,
		name: "orderdetail"
	});


	const { loading: maxItemNumberLoading } = useQuery(GET_MAX_ITEM_NUMBER, {
		variables: { id: 2 },
		onCompleted: data => setMaxItemNumber(data.wpmGraphqlGetLastItemNumber),
		//fetchPolicy: 'network-only'
	})


	React.useEffect(() => {
		append(defaultValues)
	}, [])

	if (maxItemNumberLoading) return <CircularProgress />

	return (
		<form onSubmit={(handleSubmit(onSubmit))}>
			{/* <h3>
				{`CREATE ITEMS FOR ${locationReference.reference} `}
			</h3> */}
			{/* 	<Item>
				<CreateButton
					label={'new item'}
					onClick={() => {
						append(defaultValues);
						setMaxItemNumber(prevState => prevState + 1)
					}}
					sx={{ mt: 5, mb: 5 }}
				/>
			</Item> */}


			{fields.map((item, index) => (
				<Box key={item.id} sx={{ display: 'flex', ml: 0.5, mr: 0.5, mb: 5 }}>
					<Item>
						<TextField
							label={"Item Number"}
							{...register(`orderdetail.${index}.itemNumber`)}
							autoFocus
							variant="filled"
							fullWidth
						/>
					</Item>

					<Item>
						<TextField
							label={"Qty Ordered"}
							variant="filled"
							{...register(`orderdetail.${index}.qtyOrdered`)}
							fullWidth
						/>
					</Item>
					<Item>
						<SelectItemType control={control} fieldName={`orderdetail.${index}.itemType`} />
					</Item>

					<Item>
						<SelectActivityCode control={control}
							fieldNameRH={`orderdetail.${index}.ratesetDescription`}
							fieldNameAC={`orderdetail.${index}.ratesetPrice`} />
					</Item>
					<Item>
						<TextField
							label="Material Pack Number"
							{...register(`orderdetail.${index}.packNumber`)}
							variant="filled"
							fullWidth
						/>
					</Item>
					<Item>
						<TextField
							label="Material Pack Value"
							{...register(`orderdetail.${index}.valueBaseMaterials`)}
							variant="filled"
							fullWidth
						/>
					</Item>
					<Item>
						<IconButton sx={{ color: 'red', fontSize: 40 }} onClick={() => {
							remove(index);
							setMaxItemNumber(prevState => prevState - 1)
						}}>
							< MdDelete />
						</IconButton>
					</Item>
				</Box>
			))}


			<Box sx={{ display: 'flex' }}>
				<CreateButton
					label={'new item'}
					onClick={() => {
						append(defaultValues);
						setMaxItemNumber(prevState => prevState + 1)
					}}
					sx={{ mt: 5, mb: 5 }}
				/>
				<CreateButton
					label={'new location'}
					onClick={() => {
						//nextStep()
						//	append(defaultValues);
						//	setMaxItemNumber(prevState => prevState + 1)
					}}
					sx={{ mt: 5, mb: 5 }}
				/>
				<CreateButton type="submit" label="submit data" sx={{ mt: 5, mb: 5 }} />
			</Box>


		</form>
	);
};

export default CreateItemWithDetailForm;





