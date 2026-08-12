import { formatCurrency } from "../../utils/formatCurrency";

function CartSummary({
    cantidadTotal,
    subtotal,
    onClear
}) {
    return (
        <aside className="card shadow-sm">
            <div className="card-body">
                <h2 className="h4 mb-4">
                    Resumen del pedido
                </h2>

                <div className="d-flex justify-content-between mb-3">
                    <span>Productos</span>

                    <strong>{cantidadTotal}</strong>
                </div>

                <div className="d-flex justify-content-between mb-3">
                    <span>Envío</span>

                    <span className="text-muted">
                        Por confirmar
                    </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fs-5">
                        Subtotal
                    </span>

                    <strong className="fs-4 text-rose">
                        {formatCurrency(subtotal)}
                    </strong>
                </div>

                <a
                    href="/Cart/CheckoutR"
                    className="btn btn-success w-100 mb-2"
                >
                    Proceder al pedido
                </a>

                <a
                    href="/Store/IndexR"
                    className="btn btn-outline-primary w-100 mb-2"
                >
                    Continuar comprando
                </a>

                <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={onClear}
                >
                    Vaciar carrito
                </button>
            </div>
        </aside>
    );
}

export default CartSummary;