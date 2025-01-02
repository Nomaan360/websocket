const {Router}=require('express')
const router=Router()
const md5 = require('md5');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Merchant = require('../models/Merchant');
const { Op } = require('sequelize');

// const {strictcheckauth}=require('../middleware/usermiddleware')
// const {validateTokenForUser} =require('../services/userauth')

router.get('/',async(req,res)=>{
    // let categoris=await Categories.find({})
    // console.log('rewrrte',categoris);
    let merchantid= req.session.merchantid
    let merchant
    if(merchantid){
        merchant = await Merchant.findOne({ where: { id: merchantid } }); // Correct query
    }
    console.log('req.uses',req.users);
    res.render('home',{
        user:merchant,
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
            await Merchant.create({
                merchant_name: uname,
                merchant_email: uemail,
                mobile_number: unumber,
                password: hashedPassword,
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
})

router.post('/login',async(req,res)=>{
    const {unumber,upassword}=req.body
    try {
        // Validate input
        if (!unumber || !upassword) {
            return res.status(400).json({ message: 'Mobile number and password are required' });
        }
    
        // Find merchant by mobile number
        const merchant = await Merchant.findOne({ where: { mobile_number: unumber } }); // Correct query
    
        if (!merchant) {
            return res.status(401).json({ message: 'Invalid credentials' }); // If no merchant found
        }
    
        // Hash the entered password with MD5
        const hashedPassword = crypto.createHash('md5').update(upassword).digest('hex');
    
        // Compare the hashed password with the stored password
        if (hashedPassword === merchant.password) {
            // Set session variables
            req.session.merchantid = merchant.id; // Ensure you use the correct field for ID
            req.session.merchantname = merchant.merchant_name;
            res.redirect('/')
            // return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' }); // Password mismatch
        }
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    
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

router.get('/chats',async(req,res)=>{
    let merchantid= req.session.merchantid
    console.log(merchantid);
    
    if(merchantid){

        let merchant = await Merchant.findOne({ where: { id: merchantid } });

        // Fetch all merchants except the current one
        let users = await Merchant.findAll({
            where: {
                id: {
                    [Op.ne]: merchantid // This is the correct syntax for "not equal to"
                }
            }
        });
        res.render('./users/userchat',{
            users:users,
            user:merchant,
        });
    }
    else{
        res.redirect('/')

    }
})

router.get('/api/user/:id',async(req,res)=>{
    console.log('asd',req.params.id);
    let merchantid= req.session.merchantid
    console.log('merchantid',merchantid);
    
    if(merchantid){
        try {
            let user = await Merchant.findOne({ where: { id: req.params.id } });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            console.log('user',user);
            
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
})


module.exports=router