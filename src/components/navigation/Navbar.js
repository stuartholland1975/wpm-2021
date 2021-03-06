import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NavLogo from './NavLogo';
import {NavLink, useHistory, useLocation} from 'react-router-dom';
import {useAuth0} from "@auth0/auth0-react";

export default function NavBar () {
	let routeMatch = useLocation ();
	const history = useHistory ();
	let text;

	const {loginWithRedirect} = useAuth0 ();

	if ( routeMatch.pathname === '/orders' ) {
		text = 'WORK ORDER LISTING';
	} else if ( routeMatch.pathname === '/applications' ) {
		text = 'CURRENT APPLICATION PROCESSING';
	} else if ( routeMatch.pathname === '/admin' ) {
		text = 'CONTRACT ADMINISTRATION';
	} else if ( routeMatch.pathname === '/dashboard' ) {
		text = 'CONTRACT DASHBOARD';
	} else if (
		routeMatch.pathname.startsWith (`/orders/admin/${history.location.state}`)
	) {
		text = 'WORK ORDER ADMINISTRATION';
	} else if ( routeMatch.pathname.startsWith ('/orders/admin/locations') ) {
		text = 'WORK ORDER LOCATIONS';
	} else if ( routeMatch.pathname.startsWith ('/orders/admin/items') ) {
		text = 'WORK ORDER ITEMS';
	} else if ( routeMatch.pathname.startsWith ('/orders/admin/images') ) {
		text = 'WORK ORDER IMAGES';
	} else if ( routeMatch.pathname.startsWith ('/orders/admin/documents') ) {
		text = 'WORK ORDER DOCUMENTS';
	} else if ( routeMatch.pathname.startsWith ('/orders/admin/progress') ) {
		text = 'UPDATE WORK PROGRESS';
	} else if ( routeMatch.pathname.startsWith ('/admin/global/documents') ) {
		text = 'GLOBAL DOCUMENTS ADMINISTRATION';
	} else if ( routeMatch.pathname.startsWith ('/admin/global/periods') ) {
		text = 'CONTRACT PERIODS ADMINISTRATION';
	} else if ( routeMatch.pathname.startsWith ('/admin/global/applications') ) {
		text = 'CONTRACT APPLICATIONS ADMINISTRATION';
	} else if ( routeMatch.pathname.startsWith ('/orders/import') ) {
		text = 'IMPORT ORDER DETAILS';
	} else if ( routeMatch.pathname.startsWith ('/analysis') ) {
		text = 'PERIOD ANALYSIS';
	} else if ( routeMatch.pathname.startsWith ('/enquiries') ) {
		text = 'ENQUIRIES';
	} else if ( routeMatch.pathname.startsWith ('/enquiry/applications') ) {
		text = 'APPLICATION ENQUIRY';
	} else if ( routeMatch.pathname.startsWith ('/orders/admin/worksheets') ) {
		text = 'WORK ORDER WORKSHEETS';
	} else {
		text = 'WORK PACKAGE MANAGER';
	}

	return (
		<Box sx={{flexGrow: 1, mb: 0}}>
			<AppBar position='static' sx={{background: '#737373'}}>
				<Toolbar variant='dense'>
					<IconButton edge='start' color='inherit' sx={{mr: 0}} component={NavLink}
					            to='/'>
						<NavLogo/>
					</IconButton>
					<div style={{marginLeft: 0}}>

						<IconButton
							color='inherit'
							sx={{fontSize: 18, mr: 1}}
							component={NavLink}
							to='/admin'
							exact
							activeStyle={{color: 'blue'}}
						>
							ADMINISTRATION
						</IconButton>

						<IconButton
							color='inherit'
							sx={{fontSize: 18}}
							component={NavLink}
							to='/test'
							exact
							activeStyle={{color: 'blue'}}
						>
							TEST
						</IconButton>
						<IconButton
							color='inherit'
							sx={{fontSize: 18}}
							component={NavLink}
							to='/login'
							exact
							activeStyle={{color: 'blue'}}
						>
							LOGIN
						</IconButton>
						{/* <IconButton
              color='inherit'
              sx={{ fontSize: 18, alignItems: 'middle' }}
              component={NavLink}
              to={'https://dev-xw5nv1fz.eu.auth0.com'}
             onClick={() => loginWithRedirect()}
            exact
             activeStyle={{ color: 'blue' }}
            >
              AUTH
            </IconButton> */}
					</div>
					<Typography
						sx={{ml: 'auto', mr: -40, color: 'navy', fontWeight: 'bold'}}
						variant='h5'
					>
						{text}
					</Typography>
					<div style={{marginLeft: 'auto'}}>
						<IconButton
							color='inherit'
							sx={{fontSize: 18, mr: 1}}
							component={NavLink}
							to='/orders'
							exact
							activeStyle={{color: 'blue'}}
						>
							WORK ORDERS
						</IconButton>
						<IconButton
							color='inherit'
							sx={{fontSize: 18, mr: 1}}
							component={NavLink}
							to='/applications'
							exact
							activeStyle={{color: 'blue'}}
						>
							APPLICATIONS
						</IconButton>
						<IconButton
							color='inherit'
							sx={{fontSize: 18, mr: 0}}
							component={NavLink}
							to='/dashboard'
							exact
							activeStyle={{color: 'blue'}}
						>
							DASHBOARD
						</IconButton>
						<IconButton
							color='inherit'
							sx={{fontSize: 18}}
							component={NavLink}
							to='/analysis'
							exact
							activeStyle={{color: 'blue'}}
						>
							ANALYSIS
						</IconButton>
						<IconButton
							color='inherit'
							sx={{fontSize: 18}}
							component={NavLink}
							to='/enquiries'
							exact
							activeStyle={{color: 'blue'}}
						>
							ENQUIRIES
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
