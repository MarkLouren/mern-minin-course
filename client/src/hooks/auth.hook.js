import {useState, useCallback, useEffect} from 'react'

const storageName='userData'

export const useAuth =()=>{
    const[token, setToken]=useState(null)// отвечает за токен
    const[userId, setUserId]=useState(null) //отвечает за юзер id
    const [ready, setReady] = useState(false) // проверяет произошла ли загрузка данных для авторизации (Так как это асихронный запрос)

    const login = useCallback((jwtToken, id)=>{
        setToken(jwtToken)
        setUserId(id)
        localStorage.setItem(storageName, JSON.stringify({userId:id, token:jwtToken}))
    },[])

    const logout = useCallback(()=>{
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storageName)

    },[])

    // Хотим чтобы когда приложение загружается компонент смотрел есть ли данные в localstorage. Если есть, то чтобы сам автоматически
    //  записал в локальные состояния

    useEffect( ()=>{
        const data = JSON.parse(localStorage.getItem(storageName))

        // если data есть и в ней есть токен, то
        if (data && data.token){
            //передаем в функцию и обновляем local state
            login(data.token, data.userId)
        }
        setReady(true)
    }, [login])

    return {login, logout, token, userId, ready}
}