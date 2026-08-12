import { getProductos }
    from "../services/apiReact";


useEffect(() => {

    getProductos()
        .then(setProductos)

}, []);