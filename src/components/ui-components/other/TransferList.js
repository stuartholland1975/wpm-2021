/** @format */

import * as React from 'react';
import {createStyles, makeStyles} from '@mui/styles';
import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {mutationApiVar} from "../../../cache";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: 'auto',
    },
    cardHeader: {
      padding: 2,
      boxShadow: '0px 4px 80px grey',
      backgroundColor: 'hsl(222,37%,75%)',
    },
    list: {
      height: 400,
      backgroundColor: 'hsl(222,37%,89%)',
      overflow: 'auto',
      marginTop: 4,
    },
    collapse: {
      '& .MuiCollapse-wrapperInner': {
        display: 'flex',
        flexDirection: 'column',
      },
    },
    button: {
      marginTop: 10,
    },
  }),
);

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function TransferList({existing, options}) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(options);
  const [right, setRight] = React.useState(existing);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  React.useEffect(() => {
    mutationApiVar({...mutationApiVar(), data: existing})
  }, [existing])

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    }
    else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    }
    else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    mutationApiVar({...mutationApiVar(), data: right.concat(leftChecked)})
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    mutationApiVar({...mutationApiVar(), data: not(right, rightChecked)})
    setChecked(not(checked, rightChecked));
  };

  const handleSwap = () => {
    setRight(left);
    mutationApiVar({...mutationApiVar(), data: left})
    setLeft(right);
  };

  const handleSortClick = (event, items, side) => {
    const copyItems = [...items].sort((a, b) => a > b ? 1 : -1);
    if (side === 'right') {
      setRight(copyItems);
    }
    else {
      setLeft(copyItems);
    }
  };


  const CardSelector = (title, items, side) => {
    const [expanded, setExpanded] = React.useState(true);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    return (
      <Card
        style={{display: 'flex', flexDirection: 'column'}}
        component={Paper}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Checkbox
              onClick={handleToggleAll(items)}
              checked={
                numberOfChecked(items) === items.length && items.length !== 0
              }
              indeterminate={
                numberOfChecked(items) !== items.length &&
                numberOfChecked(items) !== 0
              }
              disabled={items.length === 0}
              inputProps={{'aria-label': 'all items selected'}}
            />
          }
          title={title}
          subheader={`${numberOfChecked(items)}/${items.length} selected`}
          action={
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'>
              {expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
            </IconButton>
          }
        />
        <Collapse in={expanded} className={classes.collapse}>
          <List className={classes.list} dense component='div' role='list'>
            {items.map((value) => {
              const labelId = `transfer-list-all-item-${value.title}-label`;

              return (
                <ListItem
                  key={value.id}
                  role='listitem'
                  button
                  onClick={handleToggle(value)}>
                  <ListItemIcon>
                    <Checkbox
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{'aria-labelledby': labelId}}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.title}/>
                </ListItem>
              );
            })}
            <ListItem/>
          </List>
          <Button
            variant='outlined'
            style={{margin: 12}}
            onClick={(e) => handleSortClick(e, items, side)}>
            Sort
          </Button>
        </Collapse>
      </Card>
    );
  };

  return (
    <Grid container={true} spacing={2}>
      <Grid item xs={5}>
        <Paper elevation={3}>{CardSelector('Choices', left, 'left')}</Paper>
      </Grid>
      <Grid item xs={2}>
        <Grid container direction='column' alignItems='center'>
          <Button
            variant='outlined'
            size='small'
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label='move selected right'>
            &gt;
          </Button>
          <Button
            variant='outlined'
            size='small'
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label='move selected left'>
            &lt;
          </Button>
          <Button
            variant='outlined'
            size='small'
            className={classes.button}
            onClick={handleSwap}>
            <SwapHorizIcon/>
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <Paper elevation={3}>{CardSelector('Chosen', right, 'right')}</Paper>
      </Grid>
    </Grid>
  );
}
