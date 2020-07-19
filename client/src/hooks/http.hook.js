//используем нативный fetch - должен взаимодействовать с сервером
import {useState, useCallback} from 'react'

export const useHttp=()=>{
const [loading, setLoading]=useState(false) //проверка идет ли загрузка на сервак или нет

 const [error, setError] = useState(null)

//useCallback используется чтобы Реакт не уходил в рекурсию.

    const request = useCallback(async (url, method='GET', body=null, headers={})=>{
 setLoading(true)
        try {
     //Чтобы передвалао правильно body на server а не как {object, object}- если  body есть -переводим в строку
            if (body){
                body=JSON.stringify(body)
                headers['Content-Type']='application/json' //указываем что передаем именно Json
            }
    const response= await fetch(url, {method, body, headers})
    //получили ответ - обрабатываем его:
     const data = await response.json()
         // ок- это глобальный метод для response
     if (!response.ok){
         throw new Error(data.message ||'Что-то пошло не так') //message определен на бекенде
     }
            setLoading(false)
     return data

 } catch(e){
            setLoading(false)
            setError(e.message)
            throw e

 }
    },[])
    //чистит ошибки
    const clearError = useCallback(()=>{setError(null)},[])

    return {loading, request, error, clearError}

}