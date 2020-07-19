const {Router} = require('express')
const Link= require('../models/Link')

const router = Router()

router.get('/:code', async(req, res)=>{
    try {
        //params.code - тянет с url динамически код
        const link = await Link.findOne({code:req.params.code})
        // еслм ссылка найдена в базе то:
        if(link){
            //плюсуем счетчик перехода по ней
            link.clicks++
            //обновляю данные в базе
            await link.save()
            //редиректим на первоначальную ссылку с from
            return res.redirect(link.from)

        }
        // если не найдена, то:
        await res.status(404).json('Ссылка не найдена')

    } catch(e){
        await res.status(500).json({message: 'Что-то пошло не так [redirect routes]'})
    }
})
module.exports=router