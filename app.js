const path = require("path");

const express = require("express");
const csrf = require('csurf')
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const authRoutes = require("./routes/auth.routes");
const productRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const { request } = require("http");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static('public'));
app.use(express.urlencoded({extended: false }));

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase().then(function() {
    app.listen(3000);
})
.catch(function(error) {
    console.log('Fail to connect to the database!');
    console.log(error);
});

