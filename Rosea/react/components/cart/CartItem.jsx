import { formatCurrency } from "../../utils/formatCurrency";
import { getImageUrl } from "../../utils/imageHelper";

function CartItem({
    item,
    onIncrease,
    onDecrease,
    onQuantityChange,
    onRemove
}) {
    function handleQuantityInput(event) {
        const nuevaCantidad = Number(event.target.value);

        if (!Number.isInteger(nuevaCantidad)) {
            return;
        }

        onQuantityChange(item.id, nuevaCantidad);
    }

    return (
        <article className="card shadow-sm mb-3">
            <div className="card-body">
                <div className="row align-items-center g-3">
                    <div className="col-4 col-md-2">
                        <img
                            src={getImageUrl(item)}
                            alt={item.nombre}
                            className="img-fluid rounded"
                            style={{
                                width: "100%",
                                height: "110px",
                                objectFit: "contain"
                            }}
                        />
                    </div>

                    <div className="col-8 col-md-4">
                        <h2 className="h5 mb-1">
                            {item.nombre}
                        </h2>

                        {item.descripcion && (
                            <p className="small text-muted mb-2">
                                {item.descripcion}
                            </p>
                        )}

                        <p className="fw-bold text-rose mb-0">
                            {formatCurrency(item.precio)}
                        </p>
                    </div>

                    <div className="col-12 col-md-3">
                        <label
                            htmlFor={`cantidad-${item.id}`}
                            className="form-label small"
                        >
                            Cantidad
                        </label>

                        <div className="input-group">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => onDecrease(item.id)}
                                aria-label={`Disminuir cantidad de ${item.nombre}`}
                            >
                                −
                            </button>

                            <input
                                id={`cantidad-${item.id}`}
                                type="number"
                                className="form-control text-center"
                                min="1"
                                max="99"
                                value={item.qty}
                                onChange={handleQuantityInput}
                                aria-label={`Cantidad de ${item.nombre}`}
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => onIncrease(item.id)}
                                aria-label={`Aumentar cantidad de ${item.nombre}`}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="col-8 col-md-2 text-md-end">
                        <span className="small text-muted d-block">
                            Total
                        </span>

                        <strong className="fs-5">
                            {formatCurrency(
                                Number(item.precio) *
                                item.qty
                            )}
                        </strong>
                    </div>

                    <div className="col-4 col-md-1 text-end">
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => onRemove(item.id)}
                            aria-label={`Eliminar ${item.nombre}`}
                            title="Eliminar producto"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default CartItem;