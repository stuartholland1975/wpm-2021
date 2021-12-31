/** @format */
//import './wdyr'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, ApolloProvider, ApolloLink, } from '@apollo/client';
import './GridStyles.scss';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { cache } from './cache';
import { ModalProvider } from 'react-modal-hook';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { Auth0Provider } from "@auth0/auth0-react";


persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});

export const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    createUploadLink({
      uri: 'https://workpm.ddns.net/graphql',

      // credentials: 'same-origin'
    }),
  ]),

  cache,
});
/* export const client = new ApolloClient({
  link: authLink.concat(httpLink),
 
   ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }), 
   createUploadLink({
     uri: 'https://workpm.ddns.net/graphql',
     credentials: 'same-origin'
   }), 
 ]),
  cache,
});
 */
function initialise() {
  if (cssHasLoaded('ag-theme-custom-react')) {
    ReactDOM.render(
      <Router>
        {/* <Auth0Provider
          domain="dev-xw5nv1fz.eu.auth0.com"
          clientId="t7amjkEQaKyBbHlmySNbP1cKpv34TVGj"
          redirectUri="https://workpm.ddns.net"
        > */}
        <ApolloProvider client={client}>
          <ModalProvider>
            <App />
          </ModalProvider>
        </ApolloProvider>
        {/* //  </Auth0Provider> */}
        ,

      </Router>,
      document.getElementById('root')
    );
  }
  else {
    setTimeout(initialise, 100);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

function cssHasLoaded(theme) {
  const themeEl = document.createElement('div');
  document.body.appendChild(themeEl);
  try {
    themeEl.className = theme;
    const cellEl = document.createElement('div');
    cellEl.className = 'ag-cell';
    themeEl.appendChild(cellEl);
    const computedStyle = window.getComputedStyle(cellEl);
    return parseFloat(computedStyle.paddingLeft) > 0;
  } finally {
    document.body.removeChild(themeEl);
  }
}

initialise();
reportWebVitals();
