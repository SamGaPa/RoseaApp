function EmptyCart() {
    return (
        <div className="text-center py-5">
            <div
                className="mb-3"
                style={{ fontSize: "4rem" }}
                aria-hidden="true"
            >
                🛒
            </div>

            <h2 className="h4">
                Tu carrito está vacío
            </h2>

            <p className="text-muted">
                Agrega algunos productos para continuar con tu pedido.
            </p>

            <a
                href="/Store/IndexR"
                className="btn btn-primary"
            >
                Ir a la tienda
            </a>
        </div>
    );
}

export default EmptyCart;