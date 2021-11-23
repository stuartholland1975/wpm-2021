import React from "react";
import { confirmAlert } from "react-confirm-alert";
import CloseIcon from '@mui/icons-material/Close'
import { withStyles } from "@mui/styles";
import { Button, Dialog, DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent, DialogActions as MuiDialogActions, IconButton, Typography } from "@mui/material";


const styles = theme => ({
    root: {
        margin: 0,
        padding: (2)
    },
    closeButton: {
        position: "absolute",
        right: (1),
        top: (1),
        color: 'grey'
    }
});

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: (2)
    }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: (1)
    }
}))(MuiDialogActions);

export default function MuiConfirmAlert() {
    const submit = () => {
        confirmAlert({
            title: "Confirm to submit",
            message: "Are you sure to do this.",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => alert("Click Yes")
                },
                {
                    label: "No"
                    // onClick: () => alert("Click No")
                }
            ]
        });
    };

    const submit2 = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h1>Are you sure?</h1>
                        <p>You want to delete this file?</p>
                        <button onClick={onClose}>No</button>
                        <button
                            onClick={() => {

                                onClose();
                            }}
                        >
                            Yes, Delete it!
                        </button>
                    </div>
                );
            }
        });
    };

    const submit3 = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <Dialog
                            open={true}
                            onClose={onClose}
                            aria-labelledby="customized-dialog-title"
                            disableBackdropClick
                            disableEscapeKeyDown
                            maxWidth="xs"
                        >
                            <DialogTitle id="customized-dialog-title" onClose={onClose}>
                                Modal title
                            </DialogTitle>
                            <DialogContent dividers>
                                <Typography gutterBottom>
                                    Cras mattis consectetur purus sit amet fermentum. Cras justo
                                    odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                                    risus, porta ac consectetur ac, vestibulum at eros.
                                </Typography>
                                <Typography gutterBottom>
                                    Praesent commodo cursus magna, vel scelerisque nisl
                                    consectetur et. Vivamus sagittis lacus vel augue laoreet
                                    rutrum faucibus dolor auctor.
                                </Typography>
                                <Typography gutterBottom>
                                    Aenean lacinia bibendum nulla sed consectetur. Praesent
                                    commodo cursus magna, vel scelerisque nisl consectetur et.
                                    Donec sed odio dui. Donec ullamcorper nulla non metus auctor
                                    fringilla.
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={onClose} color="primary">
                                    OK
                                </Button>
                                <Button autoFocus onClick={onClose} color="primary">
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                );
            }
        });
    };

    return (
        <div className="App">
            <div className="container">
                <button onClick={submit}>Confirm dialog</button>
                <br />
                <button onClick={submit2}>Confirm custom dialog</button>
                <br />
                <button onClick={submit3}>Confirm custom dialog</button>
            </div>
        </div>
    );
}
