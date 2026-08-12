import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
    const rootElement =
        document.getElementById("root");

    const page =
        rootElement?.dataset?.page ?? "store";

    switch (page) {
        case "cart":
            return <CartPage />;

        case "checkout":
            return <CheckoutPage />;

        case "store":
        default:
            return <StorePage />;
    }
}

export default App;