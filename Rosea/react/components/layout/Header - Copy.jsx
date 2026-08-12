import useCart from "../../hooks/useCart";

function Header() {
    const { cantidadTotal } = useCart();

    return (
        <header className="border-bottom bg-white">
            <div className="container py-3">
                <div className="d-flex justify-content-between align-items-center">
                    <a
                        href="/Store/IndexR"
                        className="text-decoration-none text-dark"
                    >
                        <span className="fs-3 fw-bold">
                            Rosea
                        </span>
                    </a>

                    <nav className="d-flex align-items-center gap-3">
                        <a
                            href="/Store/IndexR"
                            className="text-decoration-none"
                        >
                            Tienda
                        </a>

                        <a
                            href="/Cart/IndexR"
                            className="btn btn-outline-primary position-relative"
                        >
                            Carrito

                            {cantidadTotal > 0 && (
                                <span
                                    className="
                                        position-absolute
                                        top-0
                                        start-100
                                        translate-middle
                                        badge
                                        rounded-pill
                                        bg-danger
                                    "
                                >
                                    {cantidadTotal}

                                    <span className="visually-hidden">
                                        productos en el carrito
                                    </span>
                                </span>
                            )}
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;