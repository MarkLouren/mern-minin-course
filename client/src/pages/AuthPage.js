import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook"; //custom hook!
import {AuthContext} from '../context/AuthContext'

export const AuthPage=()=>{
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError}=useHttp()

    const [form, setForm]= useState({
        email:'',
        password:''
    })
    //обработка ошибки с http запроса и вывод ее пользователю
    useEffect(()=>{
        message(error)  //message - обвертка с хука useMessage
        clearError() //очистка errors obj
    },[error, message, clearError])

    useEffect(()=>{
      window.M.updateTextFields()   // M global object from Material Design - сделать активными инпуты (удаление старого теката)
    },[])




    //обработка изменяющихся параметров в форме через Хук!
    const changeHandler = event => {
        setForm({...form, [event.target.name]:event.target.value})
    }
    //отправка запроса на Сервер через хук:
 const registerHandler = async()=>{
        try{
            const data = await request('/api/auth/register', 'POST', {...form})
            //popup что пользователь создан
            message(data.message)

        } catch(e){}
 }

    const loginHandler = async()=>{
        try{
            const data = await request('/api/auth/login', 'POST', {...form})
          // Используем метод login с AuthContext -чтобы данные с запроса закинуть в контекст
            // login в AuthContext мы получаем в App.js c auth.hook.js
            auth.login(data.token, data.userId)

        } catch(e){}
    }


    return(
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Сократи Ссылку</h1>

                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>

                        <div className="input-field">
                            <input placeholder="Введите Емейл"
                                   id="email"
                                   type="text"
                                   name="email"
                                   className="validate"
                                   value={form.email}
                                   onChange={changeHandler}/>
                            <label htmlFor="email">Email</label>
                        </div>

                        <div className="input-field">
                            <input placeholder="Введите пароль"
                                   id="password"
                                   type="text"
                                   name="password"
                                   className="validate"
                                   value={form.password}
                                   onChange={changeHandler}/>
                            <label htmlFor="password">Password</label>
                        </div>

                    </div>

                    <div className="card-action">
                        <button className="btn yellow darken-4"
                                style={{marginRight: 10}}
                                disabled={loading}
                                onClick={loginHandler}
                        >Войти</button>
                        <button className="btn grey"
                                onClick={registerHandler}
                                disabled={loading}
                        >Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    )
}