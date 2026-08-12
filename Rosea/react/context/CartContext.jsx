import {
    createContext,
    useEffect,
    useMemo,
    useState
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "rosea_carrito";

function leerCarritoGuardado() {
    try {
        const carritoGuardado =
            localStorage.getItem(STORAGE_KEY);

        if (!carritoGuardado) {
            return [];
        }

        const datos = JSON.parse(carritoGuardado);

        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.error(
            "No fue posible leer el carrito:",
            error
        );

        return [];
    }
}

export function CartProvider({ children }) {
    const [carrito, setCarrito] = useState(
        leerCarritoGuardado
    );

    useEffect(() => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(carrito)
            );
        } catch (error) {
            console.error(
                "No fue posible guardar el carrito:",
                error
            );
        }
    }, [carrito]);

    function agregarProducto(producto) {
        if (!producto?.id) {
            console.error(
                "El producto no tiene un identificador válido.",
                producto
            );

            return;
        }

        setCarrito((carritoActual) => {
            const productoExistente =
                carritoActual.find(
                    (item) => item.id === producto.id
                );

            if (productoExistente) {
                return carritoActual.map((item) =>
                    item.id === producto.id
                        ? {
                            ...item,
                            qty: Number(item.qty || 0) + 1
                        }
                        : item
                );
            }

            return [
                ...carritoActual,
                {
                    id: producto.id,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    imagen: producto.imagen,
                    qty: 1

                }
            ];
        });
    }

    function eliminarProducto(idProducto) {
        setCarrito((carritoActual) =>
            carritoActual.filter(
                (item) => item.id !== idProducto
            )
        );
    }

    function cambiarCantidad(
        idProducto,
        nuevaCantidad
    ) {
        const cantidad = Number(nuevaCantidad);

        if (
            !Number.isFinite(cantidad) ||
            !Number.isInteger(cantidad)
        ) {
            return;
        }

        if (cantidad <= 0) {
            eliminarProducto(idProducto);
            return;
        }

        const cantidadSegura = Math.min(
            cantidad,
            99
        );

        setCarrito((carritoActual) =>
            carritoActual.map((item) =>
                item.id === idProducto
                    ? {
                        ...item,
                        cantidad: cantidadSegura,
                        qty: cantidadSegura
                    }
                    : item
            )
        );
    }

    function vaciarCarrito() {
        setCarrito([]);
    }

    const cantidadTotal = useMemo(
        () =>
            carrito.reduce(
                (total, item) =>
                    total + Number(item.qty || 0),
                0
            ),
        [carrito]
    );

    const subtotal = useMemo(
        () =>
            carrito.reduce(
                (total, item) =>
                    total +
                    Number(item.precio || 0) *
                    Number(item.qty || 0),
                0
            ),
        [carrito]
    );

    const value = {
        carrito,
        cantidadTotal,
        subtotal,
        agregarProducto,
        eliminarProducto,
        cambiarCantidad,
        vaciarCarrito
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;