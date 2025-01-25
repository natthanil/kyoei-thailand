const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const port = process.env.PORT || 4000;
const app = express();

app.use(cors())
app.use(express.json());


const tbuser = mongoose.model('member', {
    id: {
        type: Number,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },

})

app.get('/', async (req, res) => {
    res.json({
        message: 'Hello World'
    });
})
app.post('/registerUser', async (req, res) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;
    let id = 10000000
    const checkUser = await tbuser.findOne({ username: username })
    const checkUsers = await tbuser.find({})
    if (checkUser) {
        res.json({
            success: false,
            message: 'มี Username นี้อยู่ในระบบอยู่แล้ว',
            status: 'error',
            text: "โปรดใช้ Username ใหม่"
        })
    } else {
        console.log(checkUsers.length)
        if (checkUsers.length >= 1) {
            let regis = checkUsers.slice(-1)
            let regisArray = regis[0]
            id = regisArray.id + 1
        } else {
            id = 100000001
        }
        const inseact = tbuser({
            id: id,
            fullname: fullname,
            email: email,
            username: username,
            password: password,
            phone: phone,
            address: address
        })
        res.json({
            success: true,
            message: 'สมัครสมาชิกสำเร็จ',
            status: 'success',
            text: "เข้าสู่ระบบได้เลยยย!!!"
        })
        await inseact.save();
    }
})


app.post('/loginUser', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const usernames = await tbuser.findOne({ username: username })
    if (usernames) {
        const passwords = await tbuser.findOne({ password: password })
        if (passwords) {
            res.json({
                success: true,
                message: 'Username และ Password ถูกต้อง',
                status: 'success',
                text: "เข้าสู่ระบบสำเร็จ",
                fullname: usernames.fullname,
                id : usernames.id
            })
        } else {
            res.json({
                success: false,
                message: 'Password ไม่ถูกต้อง',
                status: 'error',
                text: "เข้าสู่ระบบไม่สำเร็จ"
            })
        }
    } else {
        res.json({
            success: false,
            message: 'Username ไม่ถูกต้อง',
            status: 'error',
            text: "เข้าสู่ระบบไม่สำเร็จ"
        })
    }
})



const leaveData = mongoose.model('leaveData', {

    username: {
        type: String,
        required: true
    },
    cause: {
        type: String,
        required: true
    }
    , select: {
        type: String,
        required: true
    }
    , approval: {
        type: String,
        required: true
    },
    time : {
        type : String,
        required : true
    },
    startDate : {
        type : String,
        required : true
    },
    endDate : {
        type : String,
        required : true
    }

})
app.post('/leave', async (req, res) => {
    const name = req.body.name
    const cause = req.body.cause
    const select = req.body.select
    const time = req.body.time
    const startDate = req.body.dateStart
    const endDate = req.body.dateEnd
    const addLeave = leaveData({
        username: name,
        cause: cause,
        select: select,
        approval: 'ยังไม่ได้รับการอนุมัติ',
        time : time,
        startDate : startDate,
        endDate : endDate

    })
    await addLeave.save();
    res.json({
        success: true,
        message: 'ลาสำเร็จ',
        status: 'success',
        text: "โปรดรอการอนุมัติ"
    })
})

app.post('/shopData' , async (req, res)=>{
    const showData = await leaveData.find({username : req.body.fullname})
    console.log(showData)
   

    res.json({
        data : showData
    })
})

mongoose.connect('mongodb+srv://63301282011:hhnFoUWZOg3hab9s@cluster0.m81ir.mongodb.net/')
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

