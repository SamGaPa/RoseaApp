import { formatCurrency } from "../../utils/formatCurrency";
import { getImageUrl } from "../../utils/imageHelper";
import useCart from "../../hooks/useCart";
import { useState } from "react";


function Carousel({ productos, limite = 5 }) {
    const productosCarrusel = productos.slice(0, limite);
    const { agregarProducto } = useCart();
    const [agregado, setAgregado] = useState(false);
    if (productosCarrusel.length === 0) {
        return null;
    }

    return (
        <section
            className="container mb-5"
            aria-labelledby="carousel-title"
        >
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2
                        id="carousel-title"
                        className="h4 mb-1"
                    >
                        Productos destacados
                    </h2>

                    <p className="text-muted mb-0">
                        Conoce algunos productos de Rosea
                    </p>
                </div>
            </div>

            <div
                id="storeProductCarousel"
                className="carousel slide shadow-sm rounded overflow-hidden"
                data-bs-ride="carousel"
            >
                <div className="carousel-indicators">
                    {productosCarrusel.map((producto, index) => (
                        <button
                            key={producto.id}
                            type="button"
                            data-bs-target="#storeProductCarousel"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : undefined}
                            aria-label={`Producto ${index + 1}`}
                        />
                    ))}
                </div>

                <div className="carousel-inner">
                    {productosCarrusel.map((producto, index) => (
                        <div
                            key={producto.id}
                            className={
                                index === 0
                                    ? "carousel-item active"
                                    : "carousel-item"
                            }
                        >
                            <div className="row g-0 align-items-center bg-light">
                                <div className="col-6 col-md-6">
                                    <img
                                        src={getImageUrl(producto)}
                                        className="d-block w-100"
                                        alt={producto.nombre}
                                        style={{
                                            height: "360px",
                                            objectFit: "contain",
                                            backgroundColor: "#ffffff"
                                        }}
                                    />
                                </div>

                                <div className="col-6 col-md-6">
                                    <div className="p-4 p-lg-5">
                                        <span className="badge bg-secondary mb-3">
                                            Producto destacado
                                        </span>

                                        <h3 className="h2">
                                            {producto.nombre}
                                        </h3>

                                        {producto.descripcion && (
                                            <p className="text-muted">
                                                {producto.descripcion}
                                            </p>
                                        )}

                                        <p className="fs-3 fw-bold mb-4">
                                            {formatCurrency(producto.precio)}
                                        </p>

                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => agregarProducto(producto)}
                                        >
                                            Agregar al carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {productosCarrusel.length > 1 && (
                    <>
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#storeProductCarousel"
                            data-bs-slide="prev"
                        >
                          
                            <span className="bg-dark bg-opacity-50 rounded-circle p-3">
                                <span
                                    className="carousel-control-prev-icon"
                                    aria-hidden="true"
                                />
                            </span>

                            <span className="visually-hidden">
                                Anterior
                            </span>
                        </button>

                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#storeProductCarousel"
                            data-bs-slide="next"
                        >
                       

                            <span className="bg-dark bg-opacity-50 rounded-circle p-3">
                                <span
                                    className="carousel-control-next-icon"
                                    aria-hidden="true"
                                />
                            </span>

                            <span className="visually-hidden">
                                Siguiente
                            </span>
                        </button>
                    </>
                )}
            </div>
        </section>
    );
}

export default Carousel;