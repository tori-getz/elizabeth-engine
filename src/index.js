import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Theme as UWPThemeProvider, getTheme } from "react-uwp";
import { Provider as StoreProvider } from "react-redux";
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from "redux";
import deepForceUpdate from "react-deep-force-update";

import Reducer from "./Reducer";
import initialState from './initialState';

const store = createStore(Reducer, initialState);

class StoreUpdater extends Component {
    render () {
        return (
            <StoreProvider store={store}>
                <UWPThemeProvider
                    theme={getTheme({
                        themeName: store.getState().settings.theme,
                        accent: "#0078D7",
                        useFluentDesign: store.getState().settings.fluent
                    })}
                >
                    <App />
                </UWPThemeProvider>
            </StoreProvider>
        );
    }
}

let vDOMInstance = ReactDOM.render(<StoreUpdater /> , document.getElementById('root'));

store.subscribe(() => deepForceUpdate(vDOMInstance));

serviceWorker.unregister();
