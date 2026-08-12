import { routes } from "../../config/routes";

function UserMenu({
    user,
    isAuthenticated
}) {
    return (
        <ul className="navbar-nav ms-lg-3">
            <li className="nav-item dropdown">
                <button
                    type="button"
                    className="nav-link dropdown-toggle btn btn-link"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="Abrir menú de usuario"
                >
                    <i className="bi bi-person" />
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                    {!isAuthenticated ? (
                        <>
                            <li>
                                <a
                                    className="dropdown-item"
                                    href={routes.login}
                                >
                                    Iniciar sesión
                                </a>
                            </li>

                            <li>
                                <a
                                    className="dropdown-item"
                                    href={routes.register}
                                >
                                    Registrarse
                                </a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <span className="dropdown-item-text text-muted">
                                    Hola {user}
                                </span>
                            </li>

                            <li>
                                <a
                                    className="dropdown-item"
                                    href={
                                        routes.accountSettings
                                    }
                                >
                                    Configuración
                                </a>
                            </li>

                            <li>
                                <a
                                    className="dropdown-item text-danger"
                                    href={routes.logout}
                                >
                                    Cerrar sesión
                                </a>
                            </li>
                        </>
                    )}
                </ul>
            </li>
        </ul>
    );
}

export default UserMenu;