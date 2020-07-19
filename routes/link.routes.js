const {Router} = require('express')
const config = require('config')
const shortid =require('shortid')
const Link = require('../models/Link')
const auth=require('../middleware/auth.middleware')
const router = Router()

//генерация ссылки
router.post('/generate', auth, async(req,res)=>{

    try{
        //для вставки в урл новой сокращенной ссылки:
        const baseUrl= config.get('baseUrl')
        // с client мы будем получать обьект  "from" -откуда делаем ссылку:
        const {from} = req.body
        // генерим короткую ссылку:
         const code = shortid.generate()
        // проверяем есть ли уже такая ссылка с from
       const existing = await Link.findOne({from})
      //если есть то просто ее отправляем
        if (existing) {
            return res.json({link:existing})
        }
        // формируем сокраещенную ссылку:
        const to = baseUrl+'/t/'+code
        // готовим новый обьект ссылки чтобы отправить в базу
        //  owner:req.user.userId - тянется с auth middleware -описание ниже
        const link = new Link({
            code, to, from,  owner:req.user.userId
        })
        //  cохраняем новую ссылку в базу:
         await link.save()
        await res.status(201).json({link})


    } catch(e){
        await res.status(500).json({message:'Что-то пошло не так, попробуйте снова [link-routes Error-1]'})
    }

})

//получение всех ссылок
// auth  - это middleware который обрабатывает jwt и передает данные по юзеру в req.user -для использования дальше
router.get('/', auth, async(req,res)=>{
    try{
        //ищем все ссылки
      const links=await Link.find({owner:req.user.userId}) // user - был создан в middleware и добавлен к обьекту req как метод и туда закинут обьект {userId:user.id}
        await res.json(links) // отправляем данные на фронт

    } catch(e){
        await res.status(500).json({message:'Что-то пошло не так, попробуйте снова [link-routes Error-2]'})
    }


})
//получение ссылки по id
router.get('/:id', auth, async(req,res)=>{
    try{
        const link=await Link.findById(req.params.id) //?
        await res.json(link) // отправляем данные на фронт

    } catch(e){
        await res.status(500).json({message:'Что-то пошло не так, попробуйте снова [link-routes Error-3]'})
    }


})
module.exports=router