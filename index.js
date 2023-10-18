const express = require('express')
const app = express();
const ejs = require('ejs')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const flash = require('connect-flash')

//Connect Mongodb
mongoose.connect('mongodb+srv://admin:1234@cluster0.zpomhhp.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true})

global.loggedIn = null // จับค่าว่าเข้าหรือยัง

//Controller
const indexController = require('./controllers/indexcontroller')
const loginController = require('./controllers/logincontroller')
const registerController = require('./controllers/registercontroller')
const storeUserController = require('./controllers/storeUsercontroller')
const loginUserController = require('./controllers/loginUsercontroller')
const logoutController = require('./controllers/logoutcontroller')
const homeController = require('./controllers/homecontroller')

//middleware
const redirectIfAuth = require('./middleware/redirectifAuth')
const authMiddleware = require('./middleware/authMiddleware')

app.use(express.static('public')) //access to public folder
app.use(express.json())
app.use(express.urlencoded())
app.use(flash())
app.use(expressSession({
    secret: "node secret"
}))

app.use("*",(req, res, next)=>{
    loggedIn = req.session.userId
    next()
})

app.set('view engine', 'ejs')

app.get('/',indexController)
app.get('/home',authMiddleware,homeController)
app.get('/login', redirectIfAuth,loginController)
app.get('/register', redirectIfAuth,registerController)
app.post('/user/register', redirectIfAuth,storeUserController)//post ใช้เพิ่มข้อมูล
app.post('/user/login', redirectIfAuth,loginUserController)
app.get('/logout',logoutController)

app.listen(4000, () =>{
    console.log("App listen on port 4000")
})