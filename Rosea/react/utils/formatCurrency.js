export function formatCurrency(valor) {

    if (valor === null || valor === undefined)
        return "$0.00";

    return new Intl.NumberFormat(

        "es-MX",

        {

            style: "currency",

            currency: "MXN"

        }

    ).format(valor);

}