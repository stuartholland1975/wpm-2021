import React from 'react';
import { Dialog, Button, TextField, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';

const UserLoginForm = () => {

    const [userInfo, setUserInfo] = React.useState({
        username: '',
        password: '',
        email: '',
        message: "",
        open: false
    })

    const setUsername = event => {
        setUserInfo(prevState => ({ ...prevState, username: event.target.value }))

    };

    const setPassword = event => {
        setUserInfo(prevState => ({ ...prevState, password: event.target.value }))
    };

    const signIn = () => {
        if (userInfo.username === "react" && userInfo.password === "password") {
            setUserInfo(prevState => ({ ...prevState, open: true, message: "You have successfully Logged In!" }))

        } else {
            setUserInfo(prevState => ({ ...prevState, open: true, message: "Incorrect User Name or Password" }))
        }
    };

    const handleClose = () => {
        setUserInfo(prevState => ({ ...prevState, open: false }))
    };


    return (
        <div className="App">
            <header className="App-header">
                <div className="Login">
                    <TextField
                        variant="standard"
                        placeholder="Username"
                        margin="normal"
                        required
                        onChange={setUsername}
                        value={userInfo.username}
                    />
                    <TextField
                        variant="standard"
                        placeholder="Password"
                        margin="normal"
                        required
                        type="password"
                        onChange={setPassword}
                        value={userInfo.password}
                    />

                    <div className="Button">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                signIn();
                            }}
                        >
                            Log In
                        </Button>
                    </div>
                </div>
                <Dialog
                    open={userInfo.open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Sign In</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {userInfo.message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Okay
                        </Button>
                    </DialogActions>
                </Dialog>
            </header>
        </div>

    );
};

export default UserLoginForm;