import { routes } from "../../config/routes";

function NavbarLinks({ role }) {
    return (
        <ul className="navbar-nav me-auto align-items-lg-center">
            {role === "ADMIN" && (
                <>
                    <li className="nav-item">
                        <a
                            className="nav-link fw-semibold text-rose"
                            href={routes.admin}
                        >
                            ⚙️ Panel Admin
                        </a>
                    </li>

                    <li className="nav-item">
                        <a
                            className="nav-link fw-semibold"
                            href={routes.productosAdmin}
                        >
                            🧴 Productos
                        </a>
                    </li>

                    <li className="nav-item">
                        <a
                            className="nav-link fw-semibold"
                            href={routes.pedidosAdmin}
                        >
                            📦 Pedidos
                        </a>
                    </li>
                </>
            )}

            {role === "ROOT" && (
                <>
                    <li className="nav-item">
                        <a
                            className="nav-link fw-semibold"
                            href={routes.pageAdministration}
                        >
                            🌸 Administración de página
                        </a>
                    </li>

                    <li className="nav-item">
                        <a
                            className="nav-link fw-semibold"
                            href={routes.pedidoHistorial}
                        >
                            🌸 Historial de pedidos
                        </a>
                    </li>
                </>
            )}

            {role === "USER" && (
                <>
                    <li className="nav-item">
                        <a
                            className="nav-link"
                            href={routes.consultarPedido}
                        >
                            📦 Mis pedidos
                        </a>
                    </li>

                    <li className="nav-item">
                        <a
                            className="nav-link"
                            href={routes.nosotros}
                        >
                            Nosotros
                        </a>
                    </li>

                    <li className="nav-item">
                        <a
                            className="nav-link fw-semibold"
                            href={routes.store}
                        >
                            🌸 Catálogo
                        </a>
                    </li>
                </>
            )}

            {!role && (
                <>
                    <li className="nav-item">
                        <a
                            className="nav-link fw-semibold"
                            href={routes.store}
                        >
                            🌸 Catálogo
                        </a>
                    </li>

                    <li className="nav-item">
                        <a
                            className="nav-link"
                            href={routes.nosotros}
                        >
                            Nosotros
                        </a>
                    </li>
                </>
            )}
        </ul>
    );
}

export default NavbarLinks;