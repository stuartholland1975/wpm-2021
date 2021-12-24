import React from 'react';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { gql, useQuery, useReactiveVar } from '@apollo/client'
import { gridSelectionsVar } from '../../cache';
import { CircularProgress, TextField, Box, Container } from '@mui/material';
import SelectItemType from '../forms/Select/SelectItemType';
import SelectActivityCode from '../forms/Select/SelectActivityCode';
import RemoveIcon from '@mui/icons-material/Remove';
import Icon from '@mui/material/Icon';

const GET_MAX_ITEM_NUMBER = gql`
query GetMaxItemNumber($id: Int!) {
  wpmGraphqlGetLastItemNumber(orderId: $id)
}
`

const MultiLineForm = () => {


    const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder;

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

    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "orderdetail"
    });


    const { loading: maxItemNumberLoading } = useQuery(GET_MAX_ITEM_NUMBER, {
        variables: { id: 2 },
        onCompleted: data => setMaxItemNumber(data.wpmGraphqlGetLastItemNumber),
        fetchPolicy: 'network-only'
    })

    if (maxItemNumberLoading) return <CircularProgress />

    return (
        <form onSubmit={handleSubmit(data => console.log(data))}>

            {fields.map((item, index) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                        label={"Item Number"}
                        {...register(`orderdetail.${index}.itemNumber`)}
                        autoFocus
                        variant="filled"
                        fullWidth
                    />
                    <TextField
                        label={"Qty Ordered"}
                        variant="filled"
                        {...register(`orderdetail.${index}.qtyOrdered`)}
                        fullWidth
                    />
                    <SelectItemType control={control} fieldName={`orderdetail.${index}.itemType`} />
                    <SelectActivityCode control={control}
                        fieldNameRH={`orderdetail.${index}.ratesetDescription`}
                        fieldNameAC={`orderdetail.${index}.ratesetPrice`} />
                    <TextField
                        label="Material Pack Number"
                        {...register(`orderdetail.${index}.packNumber`)}
                        variant="filled"
                        fullWidth
                    />
                    <TextField
                        label="Material Pack Value"
                        {...register(`orderdetail.${index}.valueBaseMaterials`)}
                        variant="filled"
                        fullWidth
                    />

                    <RemoveIcon sx={{ color: 'red', fontSize: 50 }} onClick={() => { remove(index); setMaxItemNumber(prevState => prevState - 1) }} />

                    {/*  <RemoveIcon color={'action'} onClick={() => { remove(index); setMaxItemNumber(prevState => prevState - 1) }} /> */}
                </Box>
            ))}

            <button
                type="button"
                onClick={() => { append(defaultValues); setMaxItemNumber(prevState => prevState + 1) }}
            >
                append
            </button>
            <input type="submit" />
        </form>
    );
};

export default MultiLineForm;





