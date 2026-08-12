import ProductCard from "./ProductCard";

function ProductGrid({ productos }) {
    if (!productos || productos.length === 0) {
        return (
            <div
                className="alert alert-info text-center"
                role="status"
            >
                No se encontraron productos.
            </div>
        );
    }

    return (
        <div className="row">
            {productos.map((producto) => (
                <ProductCard
                    key={producto.id}
                    producto={producto}
                />
            ))}
        </div>
    );
}

export default ProductGrid;