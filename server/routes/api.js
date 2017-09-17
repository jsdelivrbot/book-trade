const express = require('express');
const googleBooks = require('google-books-search');
const router = new express.Router();
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const Trade = require('mongoose').model('Trade');
const config = require('../../config');

function validateParametersForm(payload) {
   const errors = {};
   let isFormValid = true;
   let message = '';

   if (!payload || typeof payload.phone !== 'string' || !validator.isMobilePhone(payload.phone,'any')) {
     isFormValid = false;
     errors.phone = 'Please provide a correct phone number';
   }

   if (!payload || typeof payload.address !== 'string' || payload.address.trim().length === 0) {
     isFormValid = false;
     errors.address = 'Please provide your adress.';
   }

   if (!isFormValid) {
     message = 'Check the form for errors.';
   }

   return {
     success: isFormValid,
     message,
     errors
   };
 }


router.get('/dashboard', (req, res) => {
  jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;
    User.findById(userId, function (err, user){
      if (err) { return res.status(401).end(); }
      Trade.find({recipient: userId},function(err,trades){
        if (err) { return res.status(401).end(); }
        return res.status(200).json({
          books: user.books,
          tradebooks: trades.map((element) => {return element.book})
        });
      });

    });
  });
});

router.post('/decline/:id', (req, res) => {
  jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;

    Trade.find({ book:req.params.id, recipient: userId }).remove(function(err){
      if (err) { return res.status(401).end(); }
      res.status(200).json({message: "success"});
    });

  });
});



router.post('/accept/:id', (req, res) => {
  jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;

    Trade.findOne({ book:req.params.id, recipient: userId },function(err,trade){
      if (err) { return res.status(401).end(); }
      User.findById(userId, function (err, user) {
        if (err) return handleError(err);
        var books = user.books;
        var index = books.indexOf(trade.book);
        books.splice(index, 1);
        user.books  = books;
        user.save(function (err, updatedUser) {
          if (err) { return res.status(401).end(); }
          User.findById(trade.requester, function (err, newuser) {
            if (err) { return res.status(401).end(); }
            console.log(newuser);
            var books = newuser.books;
            books.push(trade.book);
            newuser.books  = books;
            newuser.save(function (err, updatedUser) {
              if (err) { return res.status(401).end(); }
              res.status(200).json({message : "Saved"});
            });
          });
        });
      });

    });

  });
});


router.post('/infos', (req, res) => {
  jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;

    User.findByIdAndUpdate(userId, { $set: { address: req.body.address, phone: req.body.phone }}, { new: true }, function (err, user) {
      if (err) return handleError(err);
      res.status(200).json({message : "Saved"});
    });

  });
});

router.get('/infos', (req, res) => {
  jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;
    User.findById(userId, function (err, user){
      if (err) { return res.status(401).end(); }
      return res.status(200).json({
        address: user.address,
        phone : user.phone
      });
    });
  });
});


router.delete('/book/:id', (req, res) => {
  jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;
    User.findByIdAndUpdate(userId, { $pull: { books: { $in : [req.params.id] }}}, { new: true }, function (err, tank) {
      if (err) return handleError(err);
      res.status(200).json("sucess");
    });
  });
});

router.get('/explore',(req,res)=>{
  jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }
    var books = [];
    User.find({books: {$exists: true}}, function(err, docs) {
      if (err) { return res.status(401).end(); }
        for(var i = 0; i<docs.length; i++) {
            for(var j=0;j<docs[i].books.length;j++){
              books.push({book: docs[i].books[j],owner : docs[i]._id});
            }
        }
        res.status(200).json({books : books});
    });
  });
});

router.post('/book/:id', (req, res) => {
  googleBooks.lookup(req.params.id, function(error, results) {
    if ( ! error ) {
      jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret, (err, decoded) => {
        // the 401 code is for unauthorized status
        if (err) { return res.status(401).end(); }

        const userId = decoded.sub;
        User.update(
            { _id: userId },
            { $addToSet: { books: req.params.id } },
            function(err,affected,resp){
              if (err) { return res.status(401).end(); }
              return res.status(200).json({
                message: "Your Books In JSON :D"
              });
            }
        );

      });
    } else {
       res.status(400);
    }
    });
});

router.put('/trade/:id',(req,res)=>{
  var bookId = req.params.id.split("===")[0];
  var owner = req.params.id.split("===")[1];
  // console.log(bookId);
  // console.log(owner);
  jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;

    User.findById(userId,function (err, user) {
      if (err) return handleError(err);
      if(user.books.indexOf(req.params.id)>=0){
        res.status(200).json({message : "Already have this book!"});
      }else{
        if(userId===owner)
        {
          res.status(200).json({message: "Already have this book!"});
        }else{
          Trade.find({book : bookId},function(err,trade){
            if (err) { return res.status(401).end(); }
            if(trade.length===0)
            {
              var trade = new Trade({
                requester : userId,
                recipient : owner,
                book: bookId
              });
              trade.save(function(err){
                res.status(200).json({message: "Something Bad Happened!! With database while saving this trade"});
              })
            }else{
              res.status(200).json({message : "Book already traded"});
            }
          });
        }
      }

    });
  });
});

module.exports = router;
