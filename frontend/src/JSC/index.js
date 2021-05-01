import React from "react";
import App from "./store"
import { BrowserRouter } from 'react-router-dom';

function app() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

export default app;
