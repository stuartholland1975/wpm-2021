import React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { withStyles } from '@mui/styles'

const styles = {
    root: {
        marginLeft: 5
    }
}
const SpinnerAdornment = withStyles(styles)(props => (
    <CircularProgress
        className={props.classes.spinner}
        size={20}
    />
))
const SpinnerButton = (props) => {
    const {
        children,
        loading,
        ...rest
    } = props
    return (
        <Button {...rest}>
            {children}
            {loading && <SpinnerAdornment {...rest} />}
        </Button>
    )
}

export default SpinnerButton