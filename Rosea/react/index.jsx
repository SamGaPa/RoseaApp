import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { CartProvider } from "./context/CartContext";

const rootElement =
    document.getElementById("root");

if (!rootElement) {
    throw new Error(
        "No se encontró el elemento #root."
    );
}

ReactDOM
    .createRoot(rootElement)
    .render(
        <React.StrictMode>
            <CartProvider>
                <App />
            </CartProvider>
        </React.StrictMode>
    );