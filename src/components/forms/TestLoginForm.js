import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { gql, useMutation } from '@apollo/client'
import { AUTH_TOKEN } from '../../constants';
import { useHistory } from 'react-router-dom'

/* const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $email: String!
    $password: String!
    $name: String!
  ) {
    signup(
      email: $email
      password: $password
      name: $name
    ) {
      token
    }
  }
`; */

const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    
    $password: String!
    $userName: String!
  ) {
      authenticate(input: { username: $userName, password:$password }) {
    jwtToken {
      email
      forename
      id
      password
      surname
      
      userName
    }
}
  }
`;


const theme = createTheme();

export default function SignIn() {

    const history = useHistory()


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const apiData = {
            userName: data.get('username'),
            password: data.get('password'),

        }
        login({ variables: apiData })
    }

    const [login] = useMutation(LOGIN_MUTATION, {
        onCompleted: ({ login }) => {
            localStorage.setItem(AUTH_TOKEN, login.token);
            history.push({ pathname: '/' })
        }
    })



    /* const [signup] = useMutation(SIGNUP_MUTATION, {
        variables: {
            name: formState.name,
            email: formState.email,
            password: formState.password
        },
        onCompleted: ({ signup }) => {
            localStorage.setItem(AUTH_TOKEN, signup.token);
            navigate('/');
        }
    }); */

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="User Name"
                            name="username"
                            //  autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

            </Container>
        </ThemeProvider>
    );
}