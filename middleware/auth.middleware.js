
const jwt =require('jsonwebtoken') //чтобы раскодировать токен с фронта
const config=require('config')
// next- pass req to other function
module.exports = (req, res, next) => {
// OPTIONS - REST API method -checks if server is available
    if (req.method === 'OPTIONS'){
        return next()
    }
    try {
        // в request в header смотрим поле authorization и данные в нем формата: "Bearer TOKEN"
        // Парсим данные делаем split() чтобы вытянуть только TOKEN - первый элемент масива
        const token=req.headers.authorization.split(' ')[1]
        // если нет токена:
        if (!token){
            return res.status(401).json({message:'Нет Авторизации'})
        }
        //если токен есть, то его нужно раскодировать - jwt.verify - раскодирует токен
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        // ложим его в обьект request для передачи дальше по факту создаем новый метод и засовываем в него данные
        req.user=decoded
       //продолжаем выполнение запроса- отправляем его в роуты
        next()


    } catch(e){
        res.status(401).json({message:'Нет Авторизации-ошибка'})

    }
}