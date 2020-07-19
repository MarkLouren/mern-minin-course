const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path =require('path')
const app = express()
// Чтобы считавало правильно request body
app.use(express.json({extended:true}))
//Routes:
app.use('/api/auth', require('./routes/auth.routes'))
//link handler
app.use('/api/link', require('./routes/link.routes'))
// redirect Links
app.use('/t',require('./routes/redirect.routes') )

// launch frontend app via server: Чтобы фронт и бек работали одновременно
// если env prod
if (process.env.NODE_ENV === 'production'){
    // добавляем новый middleware express статик- если идет запрос на / показываем содержимое static папки
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    // любой get запрос перенаправялем на /
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000



//database connection: mongoose returns a promise so use async
async function start(){
try {
    await mongoose.connect(config.get('mongoUri'), {
    useNewUrlParser:true,
     useUnifiedTopology:true,
     useCreateIndex:true
    })

} catch(e){
    console.log('Server Error', e.message)
    process.exit(1) //process is global object
}
}
start()

app.listen(PORT, ()=>console.log(`App has been started on port ${PORT} `))