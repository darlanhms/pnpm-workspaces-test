import React, { useState } from 'react';

import { sum } from '@pnpm-workspaces-test/utils';

import logo from './logo.svg';

import './App.css';

function App() {
    const [counter, setCounter] = useState(sum(1, 1));

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React - {counter}
                </a>
                <button onClick={() => setCounter(counter + 1)}>Increase counter</button>
            </header>
        </div>
    );
}

export default App;
