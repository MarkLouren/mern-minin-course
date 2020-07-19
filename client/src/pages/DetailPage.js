import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import Loader from '../components/Loader'
import LinkCard from '../components/LinkCard'


export const DetailPage =()=>{
    const {request, loading} = useHttp()
    const {token}=useContext(AuthContext)

    const[link, setLink]= useState(null) // ccылка которуб мы получим с бекенда по умолчанию нет

    const linkId=useParams().id  // тянем с урла id

    // отправляем запрос на бекенд с заданным id

    const getLink = useCallback( async()=>{
        try{
            const fetched = await request(`/api/link/${linkId}`, 'GET', null , {
                Authorization: `Bearer ${token}`
            })
            setLink(fetched)

        }catch (e){

        }

    },[token, linkId, request])

    // Делаем запрос (запуск функции с запросом) - при  начальной загрузке станицы
    useEffect( ()=>{

        getLink()

    },[getLink])

    //loading берем с хука - пока нет Auth данных в приложении- показываем только loader

    if (loading){
        return <Loader/>
    }
    // {!loading&&link&&<LinkCard link={link}/>}  - если не Loading и есть уже есть Link - то показываю компонент LinkCard
    // В LinkCard как props передаем ответ с сервера (link object) где его и разворачиваем.

    return (
        <div>
            {!loading&&link&&<LinkCard link={link}/>}
        </div>
    )
}

