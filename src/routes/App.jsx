import Chatlayout from '@/containers/layouts/chatlayout';
import Login from '@/pages/login/login';
import Register from '@/pages/register/register';

import { getUser, setUser } from '@/utils/AuthConfig';
import { ConfigContext } from "@/context/configContext";
import { useEffect, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routesMap } from '@/utils/RoutesConfig';
import Home from '@/pages/home/home';

function App() {

  const [user, setUser] = useState({})
  const { remember } = useContext(ConfigContext);

  useEffect(() => {
    const usuarioObtenido = getUser(remember);
    setUser(usuarioObtenido)
  }, [])

  const setRutas = () =>(
    routesMap.map((ruta, indice) =>
      <Route path={ruta.rutas.path} element={ruta.rutas.component({})} />
    )
  )

  return (
    <BrowserRouter>
      <Routes>
        {user != null?
          <Route path="/" element={<Chatlayout />} >
            { setRutas() }
            <Route path="/*" element={ <Home /> }/>
          </Route>
        :
          <>
            <Route path="/" element={<Login />}/>
            <Route path="/registro" element={<Register/>} />
            <Route path="/*" element={ <Login /> }/>
          </>
        }
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
