/** @format */
//import './wdyr'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, ApolloLink, ApolloProvider } from '@apollo/client';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import './GridStyles.scss';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { cache } from './cache';
import { ModalProvider } from 'react-modal-hook';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

persistCache({
  cache,
  storage: new LocalStorageWrapper(window.sessionStorage),
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

      // credentials: 'include'
    }),
  ]),
  cache,
});

function initialise() {
  if (cssHasLoaded('ag-theme-custom-react')) {
    ReactDOM.render(
      <Router>
        <ApolloProvider client={client}>
          <ModalProvider>
            <App />
          </ModalProvider>
        </ApolloProvider>
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
