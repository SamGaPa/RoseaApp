import { formatCurrency } from "../../utils/formatCurrency";
import { getImageUrl } from "../../utils/imageHelper";
import useCart from "../../hooks/useCart";
import { useState } from "react";

function ProductCard({ producto }) {
    const { agregarProducto } = useCart();
    const [agregado, setAgregado] = useState(false);
    function handleAgregar() {
        agregarProducto(producto);
        setAgregado(true);

        window.setTimeout(() => {
            setAgregado(false);
        }, 1200);
    }

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <article className="card h-100 shadow-sm">
                <img
                    src={getImageUrl(producto)}
                    className="card-img-top"
                    alt={producto.nombre}
                    style={{
                        height: "230px",
                        objectFit: "contain",
                        padding: "12px"
                    }}
                />

                <div className="card-body d-flex flex-column">
                    <h3 className="h5">
                        {producto.nombre}
                    </h3>

                    {producto.descripcion && (
                        <p className="text-muted">
                            {producto.descripcion}
                        </p>
                    )}

                    <p className="fs-5 fw-bold mt-auto">
                        {formatCurrency(producto.precio)}
                    </p>

                    <button
                        type="button"
                        className={
                            agregado
                                ? "btn btn-success"
                                : "btn btn-primary"
                        }
                        onClick={handleAgregar}
                        disabled={agregado}
                    >
                        {agregado
                            ? "Producto agregado"
                            : "Agregar al carrito"}
                    </button>
                </div>
            </article>
        </div>
    );
}

export default ProductCard;