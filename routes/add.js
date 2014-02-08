var models = require("../models");

exports.form = function(req, res){
  res.render('add', {user: user});
};

exports.submit = function(req, res){
  var name = req.body.name;
  var title = req.body.title;
  var url_name = title.replace(/\W/g, '_');
  var body = req.body.body;

  // start validation
  if(!title) { // generates random num for title if one not inputted by user
    for (var i = 0; i < 9; i++) {
      title += String.fromCharCode(Math.floor(Math.random() * 25) + 96);
    }
  }

  // models.Page.find({url_name: url_name}, function(err, page) {
  models.Page.find({title: title}, function(err, page) {
    if(err) {
      console.log(err);
    }

    if(page.length > 0) {
      var docCount = page.length + 1;
      // url_name = url_name + "(" + docCount + ")";
      url_name = url_name + "_" + docCount;
    }

    var p = new models.Page({ "name": name, "title": title, "body":body, "url_name": url_name});
    p.save();
    res.redirect('/');
  });
  // end validation
};
