const express       = require('express');
const app           = express();
const session       = require('express-session');
const cookieParser  = require('cookie-parser');
const i18n          = require('i18n');

i18n.configure({
    //define how many languages we would support in our application
    locales:['en', 'zh', 'vi'],

    //define the path to language json files, default is /locales
    directory: __dirname + '/locales',

    //define the default language
    defaultLocale: 'en',

    // define a custom cookie name to parse locale settings from 
    cookie: 'i18n'
});

app.use(cookieParser("i18n_demo"));
app.use(session({
    secret: "i18n_demo",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));


app.use(i18n.init);