import { useState } from "react";

function SearchBar({
    onSearch,
    disabled = false
}) {
    const [texto, setTexto] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        await onSearch(texto);
    }

    async function handleClear() {
        setTexto("");

        await onSearch("");
    }

    return (
        <form
            className="row g-2 mb-4"
            onSubmit={handleSubmit}
        >
            <div className="col-12 col-md">
                <label
                    htmlFor="store-search"
                    className="visually-hidden"
                >
                    Buscar productos
                </label>

                <input
                    id="store-search"
                    type="search"
                    className="form-control"
                    placeholder="Buscar por nombre, precio, categoría..."
                    value={texto}
                    onChange={(event) =>
                        setTexto(event.target.value)
                    }
                    disabled={disabled}
                />
            </div>

            <div className="col-6 col-md-auto">
                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={disabled}
                >
                    Buscar
                </button>
            </div>

            <div className="col-6 col-md-auto">
                <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={handleClear}
                    disabled={disabled || texto.length === 0}
                >
                    Limpiar
                </button>
            </div>
        </form>
    );
}

export default SearchBar;