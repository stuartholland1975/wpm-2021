import React from 'react';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { gridSelectionsVar } from '../../cache';
import { Box, CircularProgress, Typography } from '@mui/material';
import { formatNumberNoDecimals } from '../../functions/commonFunctions';

export const GET_SINGLE_ORDERHEADER = gql`
	query GetSingleOrderheader($id: Int!) {
		orderheaderWithValue(id: $id) {
			area
			averageItemValue
			averageLocationValue
			id
			itemCount
			itemCountBoq
			itemCountVarn
			itemsComplete
			itemsCompleteBoq
			itemsCompleteVarn
			locationCount
			locationsComplete
			statusDescription
			orderNumber
			orderValueLabour
			orderValueMaterials
			orderValueOther
			orderValueTotal
			orderValueTotalApplied
			orderValueTotalBoq
			orderValueTotalComplete
			orderValueTotalVarn
			projectTitle
			workType
			issuedDate
			documentCount
			imageCount
		}
	}
`;

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: '#b4cce4',
        p: 2,
        mt: 1,
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

const OrderStats = () => {
  const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder;

  const { data, loading } = useQuery(GET_SINGLE_ORDERHEADER, {
    variables: { id: selectedOrder },
  });

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ display: 'flex', ml: 0.5, mr: 0.5 }}>
      <Item>
        <Typography>PROJECT</Typography>
        <Typography>
          {data.orderheaderWithValue.projectTitle.substring(0, 25) + '...'}
        </Typography>
      </Item>
      <Item>
        <Typography>ORDER NO</Typography>
        <Typography>{data.orderheaderWithValue.orderNumber}</Typography>
      </Item>
      <Item>
        <Typography>STATUS</Typography>
        <Typography>{data.orderheaderWithValue.statusDescription} </Typography>
      </Item>
      <Item>
        <Typography>AREA</Typography>
        <Typography>{data.orderheaderWithValue.area}</Typography>
      </Item>
      <Item>
        <Typography>LABOUR</Typography>
        <Typography>
          {formatNumberNoDecimals(data.orderheaderWithValue.orderValueLabour)}
        </Typography>
      </Item>
      <Item>
        <Typography>MATERIALS</Typography>
        <Typography>
          {formatNumberNoDecimals(
            data.orderheaderWithValue.orderValueMaterials
          )}
        </Typography>
      </Item>
      <Item>
        <Typography>OTHER</Typography>
        <Typography>
          {formatNumberNoDecimals(data.orderheaderWithValue.orderValueOther)}
        </Typography>
      </Item>
      <Item>
        <Typography>TOTAL</Typography>
        <Typography>
          {formatNumberNoDecimals(data.orderheaderWithValue.orderValueTotal)}
        </Typography>
      </Item>
      <Item>
        <Typography>COMPLETE</Typography>
        <Typography>
          {formatNumberNoDecimals(
            data.orderheaderWithValue.orderValueTotalComplete
          )}
        </Typography>
      </Item>
      <Item>
        <Typography>TO DO</Typography>
        <Typography>
          {formatNumberNoDecimals(
            data.orderheaderWithValue.orderValueTotal -
            data.orderheaderWithValue.orderValueTotalComplete
          )}
        </Typography>
      </Item>
      <Item>
        <Typography>APPLIED</Typography>
        <Typography>
          {formatNumberNoDecimals(
            data.orderheaderWithValue.orderValueTotalApplied
          )}
        </Typography>
      </Item>
      <Item>
        <Typography>TO APPLY</Typography>
        <Typography>
          {formatNumberNoDecimals(
            data.orderheaderWithValue.orderValueTotalComplete -
            data.orderheaderWithValue.orderValueTotalApplied
          )}
        </Typography>
      </Item>
      <Item>
        <Typography>BOQ VAL</Typography>
        <Typography>
          {formatNumberNoDecimals(data.orderheaderWithValue.orderValueTotalBoq)}
        </Typography>
      </Item>
      <Item>
        <Typography>VARN VAL</Typography>
        <Typography>
          {formatNumberNoDecimals(
            data.orderheaderWithValue.orderValueTotalVarn
          )}
        </Typography>
      </Item>
      <Item>
        <Typography>LOCATIONS</Typography>
        <Typography>
          {formatNumberNoDecimals(data.orderheaderWithValue.locationCount)}
        </Typography>
      </Item>

      <Item>
        <Typography>COMPLETE</Typography>
        <Typography>
          {formatNumberNoDecimals(data.orderheaderWithValue.locationsComplete)}
        </Typography>
      </Item>
      <Item>
        <Typography>ITEMS</Typography>
        <Typography>
          {formatNumberNoDecimals(data.orderheaderWithValue.itemCount)}
        </Typography>
      </Item>
      <Item>
        <Typography>COMPLETE</Typography>
        <Typography>
          {formatNumberNoDecimals(data.orderheaderWithValue.itemsComplete)}
        </Typography>
      </Item>
      <Item>
        <Typography>DOCS</Typography>
        <Typography>
          {formatNumberNoDecimals(data.orderheaderWithValue.documentCount)}
        </Typography>
      </Item>
      <Item>
        <Typography>IMAGES</Typography>
        <Typography>
          {formatNumberNoDecimals(data.orderheaderWithValue.imageCount)}
        </Typography>
      </Item>
    </Box>
  );
};

export default OrderStats;
