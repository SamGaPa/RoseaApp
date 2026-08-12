import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";

import SearchBar from "../components/store/SearchBar";
import Carousel from "../components/store/Carousel";
import ProductGrid from "../components/store/ProductGrid";

import useProducts from "../hooks/useProducts";

function StorePage() {
    const {
        productos,
        loading,
        error,
        buscar,
        recargar
    } = useProducts();

    return (
        <>
            <Header />

            <main className="py-4">
                <section className="container">
                    <div className="mb-4">
                        <h1 className="h2">
                            Catálogo Rosea
                        </h1>

                        <p className="text-muted mb-0">
                            Explora nuestros productos de cuidado personal.
                        </p>
                    </div>

                    <SearchBar
                        onSearch={buscar}
                        disabled={loading}
                    />
                </section>

                {error && (
                    <section className="container">
                        <div
                            className="alert alert-danger"
                            role="alert"
                        >
                            <p className="mb-2">
                                {error}
                            </p>

                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={recargar}
                            >
                                Intentar nuevamente
                            </button>
                        </div>
                    </section>
                )}

                {loading ? (
                    <div className="container">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <Carousel
                                key={productos.map((producto) => producto.id).join("-")}
                                productos={productos}
                                limite={5}
                        />

                        <section className="container">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h2 className="h4 mb-0">
                                    Todos los productos
                                </h2>

                                <span className="text-muted">
                                    {productos.length} encontrados
                                </span>
                            </div>

                            <ProductGrid
                                productos={productos}
                            />
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </>
    );
}

export default StorePage;