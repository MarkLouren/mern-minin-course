const {Router} =require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router=Router()
// api/auth/
router.post(
    '/register',
    // Validation middleware:
    [
        check('email', 'Некорректный емейл').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({min:6})
    ],
    async (req, res)=>{
    try{
        console.log('Body', req.body)
        //validation results:
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json(
               {
                   errors:errors.array(),
                   message:'Не корректные регистрационные данные'
               }
           )
        }
        //handle req data
        const {email, password}=req.body
        const candidate = await User.findOne({email}) //ищем - есть ли юзер в базе

        if (candidate){
           return res.status(400).json({message:'Такой пользователь уже существует [1.1]'})
        }
        const hashedPassword = await bcrypt.hash(password, 12) //bcrypt is async
        const user = new User({email, password:hashedPassword}) //  cоздаем Юзера
        await user.save()
        res.status(201).json({message:'Пользователь создан'})


    } catch(e){
       res.status(500).json({message:'Что-то пошло не так, попробуйте снова [1]'})
    }

})
router.post('/login',
    [
    check('email', 'Введите корректный емейл').normalizeEmail().isEmail(),
    check('password', 'Ведите пароль').exists()],
    async (req, res)=>{

    try{
        //validation results:
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json(
                {
                    errors:errors.array(),
                    message:'Не корректные данные логинизации'
                }
            )
        }
        //handle req data
const{email, password} = req.body
    // проверка наличия пользователя
const user = await User.findOne({email})
if (!user){
    return res.status(400).json({message:'Пользователь не найден'})
}
// проверка пароля
        const isMatch = await bcrypt.compare(password, user.password)
if (!isMatch){
    return res.status(400).json({message:'Введите правильный пароль'})
}
// проверка успешна -генерим jwt:
        const token = jwt.sign(
            {userId:user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
            )
    //возвращаем токен в ответе
      await  res.json({token, userId:user.id})

    } catch(e){
        await res.status(500).json({message:'Что-то пошло не так, попробуйте снова [1.3]'})
    }
})
module.exports=router