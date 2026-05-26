import {reatomContext} from '@reatom/npm-react';

import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router";

import {context} from "$shared/context.ts";

import App from './App.tsx'

import '$shared/style.css'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <reatomContext.Provider value={context}>
            <App/>
        </reatomContext.Provider>
    </BrowserRouter>,
)
