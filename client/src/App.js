import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes'
import {useAuth} from "./hooks/auth.hook";
import 'materialize-css'
import {AuthContext} from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";

function App() {
    const {token, login, logout, userId, ready} = useAuth() //обновляется при каждом рендеринге прилжения
    const isAuthenticated = !!token  //!! перевод в boolean true or false -  если токен есть то true
  const routes = useRoutes(isAuthenticated)  //true or false для передачи соответствующих роутов

    //  если auth данные еще не подгрузились с сервера, показываем loader для всего приложения
    if(!ready){
        return <Loader/>
    }

  return (
      <AuthContext.Provider value={{token, login, logout, userId, isAuthenticated}}>
      <Router>
          {/*если залогинен то дополнительно показываем NavBar*/}
          {isAuthenticated&&<Navbar/>}
  <div className="container">{routes}</div>
      </Router>
      </AuthContext.Provider>
  );
}
export default App;
