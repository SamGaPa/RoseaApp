function CheckoutForm({
    formData,
    errors,
    submitting,
    onChange,
    onSubmit
}) {
    return (
        <form
            onSubmit={onSubmit}
            noValidate
        >
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label
                        htmlFor="nombre"
                        className="form-label"
                    >
                        Nombre
                    </label>

                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        className={
                            errors.nombre
                                ? "form-control is-invalid"
                                : "form-control"
                        }
                        value={formData.nombre}
                        onChange={onChange}
                        maxLength={80}
                        autoComplete="given-name"
                        disabled={submitting}
                    />

                    {errors.nombre && (
                        <div className="invalid-feedback">
                            {errors.nombre}
                        </div>
                    )}
                </div>

                <div className="col-md-6 mb-3">
                    <label
                        htmlFor="apellidos"
                        className="form-label"
                    >
                        Apellidos
                    </label>

                    <input
                        id="apellidos"
                        name="apellidos"
                        type="text"
                        className={
                            errors.apellidos
                                ? "form-control is-invalid"
                                : "form-control"
                        }
                        value={formData.apellidos}
                        onChange={onChange}
                        maxLength={100}
                        autoComplete="family-name"
                        disabled={submitting}
                    />

                    {errors.apellidos && (
                        <div className="invalid-feedback">
                            {errors.apellidos}
                        </div>
                    )}
                </div>

                <div className="col-md-6 mb-3">
                    <label
                        htmlFor="telefono"
                        className="form-label"
                    >
                        Teléfono
                    </label>

                    <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        className={
                            errors.telefono
                                ? "form-control is-invalid"
                                : "form-control"
                        }
                        value={formData.telefono}
                        onChange={onChange}
                        maxLength={20}
                        autoComplete="tel"
                        placeholder="Ej. 55 1234 5678"
                        disabled={submitting}
                    />

                    {errors.telefono && (
                        <div className="invalid-feedback">
                            {errors.telefono}
                        </div>
                    )}
                </div>

                <div className="col-md-6 mb-3">
                    <label
                        htmlFor="codigoPostal"
                        className="form-label"
                    >
                        Código postal
                    </label>

                    <input
                        id="codigoPostal"
                        name="codigoPostal"
                        type="text"
                        inputMode="numeric"
                        className={
                            errors.codigoPostal
                                ? "form-control is-invalid"
                                : "form-control"
                        }
                        value={formData.codigoPostal}
                        onChange={onChange}
                        maxLength={10}
                        autoComplete="postal-code"
                        disabled={submitting}
                    />

                    {errors.codigoPostal && (
                        <div className="invalid-feedback">
                            {errors.codigoPostal}
                        </div>
                    )}
                </div>

                <div className="col-12 mb-3">
                    <label
                        htmlFor="direccion"
                        className="form-label"
                    >
                        Dirección
                    </label>

                    <input
                        id="direccion"
                        name="direccion"
                        type="text"
                        className={
                            errors.direccion
                                ? "form-control is-invalid"
                                : "form-control"
                        }
                        value={formData.direccion}
                        onChange={onChange}
                        maxLength={250}
                        autoComplete="street-address"
                        disabled={submitting}
                    />

                    {errors.direccion && (
                        <div className="invalid-feedback">
                            {errors.direccion}
                        </div>
                    )}
                </div>

                <div className="col-12 mb-4">
                    <label
                        htmlFor="comentarios"
                        className="form-label"
                    >
                        Comentarios
                    </label>

                    <textarea
                        id="comentarios"
                        name="comentarios"
                        className="form-control"
                        value={formData.comentarios}
                        onChange={onChange}
                        rows="4"
                        maxLength={500}
                        placeholder="Indicaciones adicionales para tu pedido"
                        disabled={submitting}
                    />

                    <div className="form-text text-end">
                        {formData.comentarios.length}/500
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-success btn-lg w-100"
                disabled={submitting}
            >
                {submitting ? (
                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            aria-hidden="true"
                        />

                        Procesando pedido...
                    </>
                ) : (
                    "Confirmar pedido"
                )}
            </button>
        </form>
    );
}

export default CheckoutForm;