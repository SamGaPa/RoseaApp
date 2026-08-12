import NavbarLinks from "./NavbarLinks";
import UserMenu from "./UserMenu";

import useCart from "../../hooks/useCart";
import useSession from "../../hooks/useSession";

import { routes } from "../../config/routes";

function Header() {
    const { cantidadTotal } = useCart();

    const {
        role,
        user,
        isAuthenticated
    } = useSession();

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-glass sticky-top">
                <div className="container">
                    <a
                        className="navbar-brand fw-bold fs-4 text-rose"
                        href={routes.store}
                    >
                        🌸 Rosea
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#menuRoseaReact"
                        aria-controls="menuRoseaReact"
                        aria-expanded="false"
                        aria-label="Mostrar navegación"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="menuRoseaReact"
                    >
                        <NavbarLinks role={role} />

                        <a
                            className="nav-link position-relative me-3"
                            href={routes.cart}
                            aria-label={`Carrito con ${cantidadTotal} productos`}
                        >
                            <i className="bi bi-cart3 fs-5" />

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

                        <UserMenu
                            user={user}
                            isAuthenticated={
                                isAuthenticated
                            }
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;