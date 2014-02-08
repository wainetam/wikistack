var models = require("../models");

exports.show = function(req, res){
  console.log('in edit.show');

  var user = req.user;
  console.log('user? ', req.user);

  var id = req.params.id; // get name from URL
  // var url_name = req.params.url_name; // get name from URL
  models.Page.findById(id, function(err, page) {
    console.log('page.title', page.title);
    if(err) {
      console.log(err);
    }
    res.render('edit', {doc: page, user: user}); // page is an array
  });
};

exports.submit = function(req, res){
  // var url_name = req.params.url_name; // get name from URL
  // var cookie_id = req.cookies['connect.sid'];

  var user = req.user;
  console.log('user? ', req.user);

  console.log('in edit.submit');
  var is_updated = req.query.updated;
  var id = req.params.id; // get name from URL

  // { 'connect.sid': 's:c70CVko7SbWmmwWVjwMgyFxo.rhV+N2fF49xf7UuUIBADLGo2AAze7AxMp3K32Duf7nk' }
  // console.log('cookie_id ', cookie_id);

  // var query = {url_name: url_name};
  var query = {_id: id};

  models.Page.findOneAndUpdate(query, {
    $set: {name: req.body.name, title: req.body.title, body: req.body.body, url_name: req.body.title.replace(/\s/g, '_')} }, function(err, inserted) {
    if(err) {
      console.log(err);
    }
    // console.log('inserted', inserted);
    // res.render('show', {doc: inserted});

    res.redirect('/?updated=true');
  });
};

exports.delete = function(req, res) {
  var user = req.user;
  var url_name = req.params.url_name; // get name from URL
  var id = req.params.id; // get name from URL

  models.Page.remove({_id:id}, function() {
    res.render('deleteconfirm', {user: user});
  });
};


 // models.Page.find({url_name: url_name}).sort({date: -1}).limit(1).exec(function(err, page) {
  //     if(err) {
  //       console.log(err);
  //     }
  //     res.render('edit', {doc: page[0]}); // page is an array
  //   }
  // );


// In the shell it would be:

// db.test.find({day: {$lt: 16085}}).sort({day: -1}).limit(1)
// Which finds all the docs where day is less than 16085, sorts them on day descending, and then takes the first one.

// In Mongoose it would be something like:

// MyModel.find({day: {$lt: 16085}}).sort({day: -1}).limit(1).exec(callback);
