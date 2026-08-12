const PLACEHOLDER_IMAGE = "../images/defaultImage.png";

export function getImageUrl(producto) {
    const imagen = producto?.imagen;

    if (!imagen) {
        return PLACEHOLDER_IMAGE;
    }

    // Evita agregar el prefijo dos veces.
    if (
        imagen.startsWith("data:image/") ||
        imagen.startsWith("http://") ||
        imagen.startsWith("https://") ||
        imagen.startsWith("/")
    ) {
        return imagen;
    }

    return `data:image/jpeg;base64,${imagen}`;
}

// export function getImageUrl(producto) {

//     if (!producto.imagen) {

//         return "../images/defaultImage.png";

//     }

//     return `data:image/jpeg;base64,${producto.imagen}`;

// }