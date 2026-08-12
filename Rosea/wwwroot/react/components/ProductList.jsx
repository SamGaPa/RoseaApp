import { useEffect, useState } from "react";


function ProductList() {

    const [productos, setProductos] = useState([]);


    useEffect(() => {

        fetch("/api/productos/listar")
            .then(res => res.json())
            .then(data => {

                setProductos(data);

            });


    }, []);



    return (

        <div>

            <h2>
                Productos
            </h2>


            {
                productos.map(p => (

                    <div key={p.id}>

                        {p.nombre}

                    </div>

                ))
            }


        </div>

    )


}


export default ProductList;