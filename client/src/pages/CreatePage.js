import React, {useEffect, useState, useContext, } from 'react'

import {useHttp} from "../hooks/http.hook";
import {AuthContext} from '../context/AuthContext';
import {useHistory} from 'react-router-dom';

export const CreatePage =()=>{
    const history=useHistory()

    const auth=useContext(AuthContext) // вытягиваем данные по токену с контекста

    const {request}=useHttp()
    const  [link, setLink] =useState('');

    useEffect( ()=>{window.M.updateTextFields()},[])

    const pressHandler = async (event)=>{
        // проверяем что нажали enter
        if (event.key==='Enter'){
            try {
                // формируем link
                const data = await request ('/api/link/generate', 'POST', {from:link}, {
                    Authorization: `Bearer ${auth.token}` // передаем данные по токену в header
                })  // параметры передачи описаны в хуке useHttp -так как request вытянут от туда
                history.push(`/detail/${data.link._id}`) //redirect to the detail link page

            } catch (e){

            }

        }
    }


    return (
        <div className="row">
            <div className="cpl s8 offset-s2"  style={{paddingTop: '2rem'}}>

                <div className="input-field">
                    <input placeholder="Вставьте ссылку"
                           id="link"
                           type="text"
                           value={link}
                           onChange={e=>{setLink(e.target.value)}}
                           onKeyPress ={pressHandler} //если нажимем Enter то формируем ссылку
                    />
                    <label htmlFor="link">Введите Ссылку</label>
                </div>

            </div>

        </div>
    )
}