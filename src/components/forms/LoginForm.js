import React, { useState } from 'react';
import LoginButton from '../login/LoginButton';


const LoginForm = () => {

    const [formState, setFormState] = useState({
        login: true,
        email: '',
        password: '',
        surname: ''
    });

    return (
        <div>
            <h4 className="mv3">
                {formState.login ? 'Login' : 'Sign Up'}
            </h4>
            <div className="flex flex-column">
                {!formState.login && (
                    <input
                        value={formState.surname}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                name: e.target.value
                            })
                        }
                        type="text"
                        placeholder="Surname"
                    />
                )}
                <input
                    value={formState.email}
                    onChange={(e) =>
                        setFormState({
                            ...formState,
                            email: e.target.value
                        })
                    }
                    type="text"
                    placeholder="Your email address"
                />
                <input
                    value={formState.password}
                    onChange={(e) =>
                        setFormState({
                            ...formState,
                            password: e.target.value
                        })
                    }
                    type="password"
                    placeholder="Choose a safe password"
                />
            </div>
            <div className="flex mt3">
                <LoginButton />
                <button
                    className="pointer button"
                    onClick={(e) =>
                        setFormState({
                            ...formState,
                            login: !formState.login
                        })
                    }
                >
                    {formState.login
                        ? 'need to create an account?'
                        : 'already have an account?'}
                </button>
            </div>
        </div>
    );
};

export default LoginForm;