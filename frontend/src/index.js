import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// redux
import { configureStore } from '@reduxjs/toolkit';
import globalReducer from "state";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

// redux
const store = configureStore({
  reducer: {
    global: globalReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

