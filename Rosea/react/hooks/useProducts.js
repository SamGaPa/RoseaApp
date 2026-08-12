import { useCallback, useEffect, useState } from "react";

import {
    obtenerProductos,
    buscarProductos
} from "../services/storeApi";

function useProducts() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarProductos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await obtenerProductos();

            setProductos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar productos:", error);

            setError(
                "No fue posible cargar los productos."
            );

            setProductos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const buscar = useCallback(async (texto) => {
        const textoLimpio = texto.trim();

        // Si el usuario borra la búsqueda,
        // volvemos a cargar todo el catálogo.
        if (!textoLimpio) {
            await cargarProductos();
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await buscarProductos(textoLimpio);

            setProductos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al buscar productos:", error);

            setError(
                "No fue posible realizar la búsqueda."
            );

            setProductos([]);
        } finally {
            setLoading(false);
        }
    }, [cargarProductos]);

    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    return {
        productos,
        loading,
        error,
        buscar,
        recargar: cargarProductos
    };
}

export default useProducts;