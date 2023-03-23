const express = require('express');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session');
/* const Chart = require('chart.js');
const fs = require('fs'); */

require('../src/passport');

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());
    
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('login')
});

app.get('/auth' , passport.authenticate('google', { scope:
    [ 'email', 'profile', 'https://www.googleapis.com/auth/calendar.events.readonly' ]
}));

app.get( '/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure'
}));

app.get('/auth/callback/success' , (req , res) => {
    if(!req.user)
    {   
        res.redirect('/auth/callback/failure');
    }else{
        req.user._json.accessToken = req.user.accessToken
        ipcRenderer.send('GoogleAuthSucces', req.user._json)
        res.render('success',{user : req.user._json})
        
    }
});

app.get('/auth/callback/failure' , (req , res) => {
    ipcRenderer.send('GoogleAuthFail')
 res.render('failure');
})

app.listen(3000 , () => {
    console.log("Server Running on port 3000");
});

