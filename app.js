const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const errorController = require('./controllers/error');
const User = require('./models/user');
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dbffk.mongodb.net/${process.env.MONGO_DATABASE}`;
const multer = require('multer');
const flash = require('connect-flash');
const app = express();
const helmet = require('helmet');
const compression = require('compression');


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
  next();
});

const apiShopRoutes = require('./routes/api/shop');
const apiAuthRoutes = require('./routes/api/auth');
const apiUserRoutes = require('./routes/api/user');

//api routes
app.use('/api', apiShopRoutes);
app.use('/api', apiAuthRoutes);
app.use('/api', apiUserRoutes);


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const csrfProtection = csrf();

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());



const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions'
})


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// const apiShopRoutes = require('./routes/api/shop');
// const apiAuthRoutes = require('./routes/api/auth');
// const apiUserRoutes = require('./routes/api/user');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);


// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'OPTIONS, GET, POST, PUT, PATCH, DELETE'
//   );
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
//   next();
// });

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('imageUrl')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(csrfProtection);
app.use(flash());
app.use(helmet());
app.use(compression());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", 'js.stripe.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      'frame-src': ["'self'", 'js.stripe.com'],
      'font-src': ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com']
    },
  })
)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//api routes
// app.use('/api', apiShopRoutes);
// app.use('/api', apiAuthRoutes);
// app.use('/api', apiUserRoutes);
app.use(errorController.get404);


mongoose
  .connect(
    MONGO_URI, { useNewUrlParser: true })
  .then(result => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
