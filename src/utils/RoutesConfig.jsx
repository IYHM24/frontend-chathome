//Modulos
import Home from "@/pages/home/home"

//Permisos u configuraciones
const homeComponent = ({ conf }) => <Home props={{...conf}}/>

//Mapeo de rutas
export const routesMap = [
    {
        nombre: "inicio",
        rutas:{
            path: "/",
            component: homeComponent
        }
    },
]