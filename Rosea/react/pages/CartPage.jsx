import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";

import useCart from "../hooks/useCart";

function CartPage() {
    const {
        carrito,
        cantidadTotal,
        subtotal,
        eliminarProducto,
        cambiarCantidad,
        vaciarCarrito
    } = useCart();

    function aumentarCantidad(idProducto) {
        const item = carrito.find(
            (producto) => producto.id === idProducto
        );

        if (!item) {
            return;
        }

        cambiarCantidad(
            idProducto,
            item.cantidad + 1
            , item.qty + 1
        );
    }

    function disminuirCantidad(idProducto) {
        const item = carrito.find(
            (producto) => producto.id === idProducto
        );

        if (!item) {
            return;
        }

        cambiarCantidad(
            idProducto,
            item.cantidad - 1,
            item.qty - 1
        );
    }

    function cambiarCantidadProducto(
        idProducto,
        nuevaCantidad
    ) {
        if (nuevaCantidad < 1) {
            eliminarProducto(idProducto);
            return;
        }

        if (nuevaCantidad > 99) {
            cambiarCantidad(idProducto, 99);
            return;
        }

        cambiarCantidad(
            idProducto,
            nuevaCantidad
        );
    }

    function confirmarEliminar(idProducto) {
        const item = carrito.find(
            (producto) => producto.id === idProducto
        );

        if (!item) {
            return;
        }

        const confirmado = window.confirm(
            `¿Deseas eliminar "${item.nombre}" del carrito?`
        );

        if (confirmado) {
            eliminarProducto(idProducto);
        }
    }

    function confirmarVaciar() {
        if (carrito.length === 0) {
            return;
        }

        const confirmado = window.confirm(
            "¿Deseas eliminar todos los productos del carrito?"
        );

        if (confirmado) {
            vaciarCarrito();
        }
    }

    return (
        <>
            <Header />

            <main className="container py-4">
                <div className="mb-4">
                    <h1 className="h2">
                        Mi carrito
                    </h1>

                    <p className="text-muted">
                        Revisa los productos antes de realizar tu pedido.
                    </p>
                </div>

                {carrito.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="row g-4">
                        <section
                            className="col-12 col-lg-8"
                            aria-label="Productos del carrito"
                        >
                            {carrito.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onIncrease={aumentarCantidad}
                                    onDecrease={disminuirCantidad}
                                    onQuantityChange={
                                        cambiarCantidadProducto
                                    }
                                    onRemove={confirmarEliminar}
                                />
                            ))}
                        </section>

                        <div className="col-12 col-lg-4">
                            <div
                                className="sticky-top"
                                style={{ top: "20px" }}
                            >
                                <CartSummary
                                    cantidadTotal={cantidadTotal}
                                    subtotal={subtotal}
                                    onClear={confirmarVaciar}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}

export default CartPage;