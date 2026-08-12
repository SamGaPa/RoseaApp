import { useState } from "react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CheckoutForm from "../components/checkout/CheckoutForm";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import EmptyCart from "../components/cart/EmptyCart";

import useCart from "../hooks/useCart";
import { crearPedido } from "../services/pedidosApi";

const INITIAL_FORM = {
    nombre: "",
    apellidos: "",
    telefono: "",
    codigoPostal: "",
    direccion: "",
    comentarios: ""
};

function CheckoutPage() {
    const {
        carrito,
        subtotal,
        vaciarCarrito
    } = useCart();

    const [formData, setFormData] =
        useState(INITIAL_FORM);

    const [errors, setErrors] =
        useState({});

    const [submitting, setSubmitting] =
        useState(false);

    const [apiError, setApiError] =
        useState("");

    const [pedidoCreado, setPedidoCreado] =
        useState(null);

    function handleChange(event) {
        const {
            name,
            value
        } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));

        if (errors[name]) {
            setErrors((current) => ({
                ...current,
                [name]: ""
            }));
        }

        if (apiError) {
            setApiError("");
        }
    }


    function validarItems(items) {
        return items.every((item) =>
            Number.isInteger(item.productoId) &&
            item.productoId > 0 &&
            item.nombre.length > 0 &&
            Number.isFinite(item.precio) &&
            item.precio >= 0 &&
            Number.isInteger(item.cantidad) &&
            item.cantidad > 0
        );
    }
    function validarFormulario() {
        const nuevosErrores = {};

        if (!formData.nombre.trim()) {
            nuevosErrores.nombre =
                "El nombre es obligatorio.";
        }

        if (!formData.apellidos.trim()) {
            nuevosErrores.apellidos =
                "Los apellidos son obligatorios.";
        }

        const telefonoLimpio =
            formData.telefono.replace(/\D/g, "");

        if (!telefonoLimpio) {
            nuevosErrores.telefono =
                "El teléfono es obligatorio.";
        } else if (telefonoLimpio.length < 10) {
            nuevosErrores.telefono =
                "Ingresa un teléfono válido.";
        }

        const codigoPostalLimpio =
            formData.codigoPostal.replace(/\D/g, "");

        if (!codigoPostalLimpio) {
            nuevosErrores.codigoPostal =
                "El código postal es obligatorio.";
        } else if (
            codigoPostalLimpio.length !== 5
        ) {
            nuevosErrores.codigoPostal =
                "El código postal debe tener 5 dígitos.";
        }

        if (!formData.direccion.trim()) {
            nuevosErrores.direccion =
                "La dirección es obligatoria.";
        }

        if (carrito.length === 0) {
            nuevosErrores.carrito =
                "El carrito está vacío.";
        }

        setErrors(nuevosErrores);

        return (
            Object.keys(nuevosErrores).length === 0
        );
    }

    function construirPayload() {
        return {
            nombre: formData.nombre.trim(),
            apellidos: formData.apellidos.trim(),
            telefono: formData.telefono.trim(),
            direccion: formData.direccion.trim(),
            codigoPostal: formData.codigoPostal.trim(),
            comentarios: formData.comentarios.trim(),

            items: carrito.map((item) => ({
                productoId: Number(item.id),
                nombre: String(item.nombre || "").trim(),
                precio: Number(item.precio),
                cantidad: Number(item.qty)
            }))
        };
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        const payload = construirPayload();

        if (
            payload.items.length === 0 ||
            !validarItems(payload.items)
        ) {
            setApiError(
                "El carrito contiene productos con datos inválidos."
            );

            return;
        }

        try {
            setSubmitting(true);
            setApiError("");

            console.log(
                "Payload enviado a la API:",
                payload
            );

            const response =
                await crearPedido(payload);

            const pedidoNormalizado = {
                ...(response || {}),

                codigoPedido:
                    response?.codigoPedido ??
                    response?.codigo ??
                    response?.CodigoPedido ??
                    null,

                idPedido:
                    response?.idPedido ??
                    response?.id ??
                    response?.IdPedido ??
                    null
            };

            setPedidoCreado(
                pedidoNormalizado
            );

            vaciarCarrito();
        } catch (error) {
            console.error(
                "Error al registrar el pedido:",
                error
            );

            setApiError(
                error.message ||
                "No fue posible registrar el pedido."
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (pedidoCreado) {
        return (
            <>
                <Header />

                <main className="container py-5">
                    <div
                        className="card shadow-sm mx-auto"
                        style={{
                            maxWidth: "650px"
                        }}
                    >
                        <div className="card-body text-center p-5">
                            <div
                                className="mb-3"
                                style={{
                                    fontSize: "4rem"
                                }}
                                aria-hidden="true"
                            >
                                ✅
                            </div>

                            <h1 className="h2">
                                Pedido registrado
                            </h1>

                            <p className="text-muted">
                                Tu pedido fue enviado correctamente.
                            </p>

                            {pedidoCreado.codigoPedido && (
                                <div className="alert alert-success">
                                    <span className="d-block">
                                        Código de pedido
                                    </span>

                                    <strong className="fs-4">
                                        {
                                            pedidoCreado
                                                .codigoPedido
                                        }
                                    </strong>
                                </div>
                            )}

                            {pedidoCreado.idPedido && (
                                <p>
                                    Número interno:{" "}
                                    <strong>
                                        {
                                            pedidoCreado
                                                .idPedido
                                        }
                                    </strong>
                                </p>
                            )}

                            {!pedidoCreado.codigoPedido &&
                                !pedidoCreado.idPedido && (
                                    <div className="alert alert-success">
                                        El pedido se registró correctamente.
                                    </div>
                                )}

                            <p className="small text-muted">
                                Guarda el código del pedido para consultar su estado.
                            </p>

                            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                                <a
                                    href="/Consulta"
                                    className="btn btn-primary"
                                >
                                    Consultar pedido
                                </a>

                                <a
                                    href="/Store/IndexR"
                                    className="btn btn-outline-secondary"
                                >
                                    Volver a la tienda
                                </a>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="container py-4">
                <div className="mb-4">
                    <h1 className="h2">
                        Datos del pedido
                    </h1>

                    <p className="text-muted">
                        Ingresa la información necesaria para registrar tu pedido.
                    </p>
                </div>

                {carrito.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="row g-4">
                        <section className="col-12 col-lg-7">
                            <div className="card shadow-sm">
                                <div className="card-body p-4">
                                    {apiError && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            {apiError}
                                        </div>
                                    )}

                                    <CheckoutForm
                                        formData={formData}
                                        errors={errors}
                                        submitting={submitting}
                                        onChange={handleChange}
                                        onSubmit={handleSubmit}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="col-12 col-lg-5">
                            <div
                                className="sticky-top"
                                style={{
                                    top: "20px"
                                }}
                            >
                                <CheckoutSummary
                                    carrito={carrito}
                                    subtotal={subtotal}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}

export default CheckoutPage;