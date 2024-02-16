/**
 * Insert this Errsole code snippet as the first line of your app's main file
 */
const errsole = require('errsole');
errsole.initialize({
  framework: 'express',
  token: '1a76d399-6ceb-495c-afcc-cd3387393d29',
  exitOnException: true,
  evalExpression: true
});
// End of Errsole code snippet

require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const bcrypt = require("bcryptjs");
const cookieParser=require("cookie-parser");


const auth=require("./middleware/auth");
const path_static = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../template/views");
const partials_path = path.join(__dirname, "../template/partials");
const port = process.env.PORT || 8000;


app.use(express.json());//we want json data
app.use(express.urlencoded({ extended: false }));//becouse we take data from html form
app.use(cookieParser());

app.use(express.static(path_static));
app.set("view engine", "hbs");
app.set("views", views_path);
hbs.registerPartials(partials_path);



require("./db/conn");
const Usercol = require("./models/registers");
const { cookie } = require("express/lib/response");

const { connect } = require("tls");
const { SocketAddress } = require("net");



app.get("/", (req, res) => {
    res.render("index");

});
app.get("/home", auth,(req, res) => {
    res.render("home");

});

app.get("/logout",auth ,async(req,res)=>{
    try {
        //logout from single device
        // req.user.tokens= req.user.tokens.filter((curele)=>{
        //     return curele.token!=req.token;

        // })
        req.user.tokens=[];
        res.clearCookie("jwt");
        await req.user.save();
        res.render("index")
        
    } catch (error) {
        res.status(500).send(error);
        
    }

})
app.post("/", async (req, res) => {
    try {
        const email = req.body.email;
        const passwordd = req.body.password;
        const emaildb = await Usercol.findOne({ email: email });

        const ismatch = await bcrypt.compare(passwordd, emaildb.password);
        const token = await emaildb.generateAuthToken();
        res.cookie("jwt", token,
        {
            expires: new Date(Date.now() + 2000000),
            httpOnly: true
            // secure:true   /only work for https
        });

        if (ismatch) {
            res.status(201).render("home");
        }
        else {
            res.send("incorrect password");
        }

    } catch (err) {
        res.status(400).send("envalid email");
    }


});
app.get("/register", (req, res) => {
    res.render("register");

});
app.post("/register", async (req, res) => {
    try {
        const usersdata = new Usercol({
            name: req.body.name,
            age: req.body.age,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password

        });

        const token = await usersdata.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 50000),
            httpOnly: true
        });


        const dataaaa = await usersdata.save();
        res.status(201).render("home");

    } catch (err) {
        res.status(400).send(err);

    }


});
////code for chat app


const server=app.listen(port, () => {
    console.log(`server is running at port no ${port} `)
})


//chat appcode

const io=require('socket.io')(server);

const users={};

io.on('connection', socket =>{
    socket.on('new-user-joined',name=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joind',name)

    })
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message: message,name:users[socket.id]})

    })
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id]

    })

})
