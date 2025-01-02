const {Router}=require('express')
const router=Router()
const md5 = require('md5');
const crypto = require('crypto');
const Merchant = require('./models/Merchant');
// const {strictcheckauth}=require('../middleware/usermiddleware')
// const {validateTokenForUser} =require('../services/userauth')

router.get('/',async(req,res)=>{
    // let categoris=await Categories.find({})
    // console.log('rewrrte',categoris);
    console.log('req.uses',req.users);
    res.render('home',{
        user:req.users,
        // categories:categoris
    })
})
router.get('/signup/',(req,res)=>{
    res.render('./users/signup')
})
router.get('/signin/',(req,res)=>{
    res.render('./users/signin')
})
router.post('/register',async(req,res)=>{
    const {uname,unumber,upassword,cpassword,uemail}=req.body

    try {
        if(upassword==cpassword){
            // Hash the password using MD5
            const hashedPassword = crypto.createHash('md5').update(upassword).digest('hex');

            // Insert the merchant into the database
            const newMerchant = await Merchant.create({
                unumber,
                password: hashedPassword,
                uname,
                uemail
            });
            res.redirect('/user/signin')
            // return res.status(201).json({ message: 'Merchant created successfully', merchant: newMerchant });
        }
        else{
            res.render('./users/signup',{
                err:'Password not matched'
            }) 
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while inserting the merchant' });
    }
    // try
    // {
    //     if(upassword==cpassword){
    //         await Users.create({
    //             firstname:uname,
    //             emaild:uemail,
    //             number:unumber,
    //             password: upassword,
    //         })
    //         res.redirect('/user/signin')
    //     }
    //     else{
    //         res.render('./users/signup',{
    //             err:'Password not matched'
    //         }) 
    //     }
    // }catch(error){
    //     if (error.code === 11000 && error.keyPattern.emaild) {
    //         res.render('./users/signup',{
    //             err:'Already registered with Email Id!'
    //         }) 
    //     }
    //      else if(error.code === 11000 && error.keyPattern.number) {
    //         res.render('./users/signup',{
    //             err:'Already registered with Number!'
    //         }) 
    //     }
    //     else{
    //         throw err
    //     }
    // }
})

router.post('/login',async(req,res)=>{
    const {unumber,upassword}=req.body

    const hashedPassword = md5(upassword);

    console.log(hashedPassword);
    
})

router.get('/logout',async(req,res)=>{
    let user=req.users
    var date = new Date();
    var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
    var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
    console.log('current_time',current_time);
    console.log('current_times', date.toTimeString().split(' ')[0]); 

    await Users.updateOne(
        { _id: user._id },
        {$set: {
            lastlogin: current_date+' '+current_time,
            islogin: false,
        }}
    )
    res.clearCookie('token')
    res.redirect('/')
})

// router.get('/chats',strictcheckauth,async(req,res)=>{
    
//     let users=await Users.find({_id: { $ne: req.users._id }});
//     res.render('./users/userchat',{
//         users:users,
//         user:req.users,
//     });
// })

// router.get('/api/user/:id',strictcheckauth,async(req,res)=>{
//     try {
//         const user = await Users.find({_id:req.params.id}).exec();
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         console.log('user',user);
        
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// })


module.exports=router