import React from 'react';

import './App.css';
import { Button } from '@pnpm-workspaces-test/ui';
import { sum } from '@pnpm-workspaces-test/utils';

import logo from './logo.svg';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
                <Button>It worked! {sum(1, 1)}</Button>
            </header>
        </div>
    );
}

export default App;
