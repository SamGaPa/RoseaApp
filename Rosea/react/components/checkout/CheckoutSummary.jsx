import { formatCurrency } from "../../utils/formatCurrency";
import { getImageUrl } from "../../utils/imageHelper";

function CheckoutSummary({
    carrito,
    subtotal
}) {
    return (
        <aside className="card shadow-sm">
            <div className="card-body">
                <h2 className="h4 mb-4">
                    Resumen de compra
                </h2>

                <div
                    className="mb-3"
                    style={{
                        maxHeight: "420px",
                        overflowY: "auto"
                    }}
                >
                    {carrito.map((item) => (
                        <div
                            key={item.id}
                            className="d-flex gap-3 border-bottom py-3"
                        >
                            <img
                                src={getImageUrl(item)}
                                alt={item.nombre}
                                className="rounded"
                                style={{
                                    width: "65px",
                                    height: "65px",
                                    objectFit: "contain"
                                }}
                            />

                            <div className="flex-grow-1">
                                <h3 className="h6 mb-1">
                                    {item.nombre}
                                </h3>

                                <p className="small text-muted mb-1">
                                    Cantidad: {item.qty}
                                </p>

                                <strong>
                                    {formatCurrency(
                                        Number(item.precio) *
                                        item.qty
                                    )}
                                </strong>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-between mb-2">
                    <span>Productos</span>

                    <strong>
                        {carrito.reduce(
                            (total, item) =>
                                total + item.qty,
                            0
                        )}
                    </strong>
                </div>

                <div className="d-flex justify-content-between mb-3">
                    <span>Envío</span>

                    <span className="text-muted">
                        Por confirmar
                    </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center">
                    <span className="fs-5">
                        Subtotal
                    </span>

                    <strong className="fs-4 text-rose">
                        {formatCurrency(subtotal)}
                    </strong>
                </div>
            </div>
        </aside>
    );
}

export default CheckoutSummary;