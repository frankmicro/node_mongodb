const express = require('express');

const bodyParser = require('body-parser');

//const expressValidator = require('express-validator');

const app = express();

app.use((req, res, next) => {
  User.findById('5fda735a33329e2f7c16f708').then(user => {
    req.user = user;
    next();
  })
});

const adminRoutes = require('./routes/admin');
const User = require('./models/admin');
// const errorController = require('./controllers/error');
const shopRouter = require('./routes/shop');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/admin',adminRoutes);
app.use(shopRouter);

//app.use(errorController.get404);
  
mongoose.connect('mongodb+srv://ron_node:c75cb0otnvsxLZjB@cluster0.hrgf4.mongodb.net/shop?retryWrites=true&w=majority',
{
   useNewUrlParser: true, 
   useNewUrlParser: true, 
   useUnifiedTopology: true,
   autoCreate: false
  }).then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name : 'Ron',
          email : 'ron@node.com',
          cart : {
            items : []
          }
        });
       user.save();
      }
    });
  app.listen(3000);
}).catch(err => {
  console.log(err);
});
