/*
 * GET home page.
 */

// var async = require('async');
var models = require('../models');

exports.index = function(req, res) {
  var user = req.user;
  var is_updated = req.query.updated;
  models.Page.find(function(err, pageDocs) {
    if(err) {
      console.log(err);
    }
    res.render('index', {docs: pageDocs, 'is_updated': is_updated, user: user});
  });
};

// exports.show = function(req, res) {
//   var url_name = req.params.url_name; // get name from URL

//   models.Page.find({url_name: url_name}, function(err, page) {
//     if(err) {
//       console.log(err);
//     }
//     res.render('show', {doc: page[0]}); // page is an array
//   });
// };

exports.show = function(req, res) {
  var url_name = req.params.url_name; // get name from URL
  var id = req.params.id;

  console.log('in index.show');
  var user = req.user;
  console.log('user? ', req.user);

  if(url_name) {
    models.Page.find({url_name: url_name}, function(err, uniqPage) {
    if(err) {
      console.log(err);
    }
    res.render('show', {doc: uniqPage[0]}); // page is an array
    });
  } else {
    models.Page.find({_id: id}, function(err, page) {
      if(err) {
        console.log(err);
      }
      models.Page.find({title: page[0].title}, function(err, matchedTitles) {
        if(err) {
          console.log(err);
        }
        if(matchedTitles.length > 1) {
          res.render('disamb', {docs: matchedTitles});
        } else {
          res.render('show', {doc: page[0], user: user}); // page is an array
        }
      });
    });
  }
};





// exports.show = function(req, res) {
//   var url_name = req.params.url_name; // get name from URL
//   var id = req.params.id;

//   console.log('in exports.show...id=', id);

//   if(id) {
//     models.Page.findById(id, function(err, uniqPage) {
//     // models.Page.find({_id: id}, function(err, uniqPage) {
//     if(err) {
//       console.log(err);
//     }
//     res.render('show', {doc: uniqPage}); // page is an array
//     });
//   } else {
//     models.Page.find({url_name: url_name}, function(err, page) {
//       if(err) {
//         console.log(err);
//       }
//       models.Page.find({title: page[0].title}, function(err, matchedTitles) {
//         // console.log('match', matchedTitles);
//         if(err) {
//           console.log(err);
//         }
//         if(matchedTitles.length > 1) {
//           // res.redirect('/wiki/' + url_name + '/disamb', {docs: matchedTitles});
//           res.render('disamb', {docs: matchedTitles});
//           // console.log('match2', matchedTitles);
//         } else {
//           // console.log('before render match', matchedTitles);
//           res.render('show', {doc: page[0]}); // page is an array
//         }
//       });
//     });
//   }
// };

// exports.disamb = function(req, res) {

//   var url_name = req.params.url_name; // get name from URL

//   models.Page.find({url_name: url_name}, function(err, page) {
//     if(err) {
//       console.log(err);
//     }
//     models.Page.find({title: page[0].title}, function(err, matchedTitles) {
//       // console.log('match', matchedTitles);
//       if(err) {
//         console.log(err);
//       }
//       if(matchedTitles.length > 1) {
//         res.redirect('/wiki/' + url_name + '/disamb', {docs: matchedTitles});
//         // res.render('disamb', {docs: matchedTitles});
//         console.log('match2', matchedTitles);
//       } else {
//         // console.log('before render match', matchedTitles);
//         res.render('show', {doc: page[0]}); // page is an array
//       }
//     });
//   });
// };

//   res.render('show', {doc: page[0]}); // page is an array
//   });

//   models.Page.find({title: page.title}, function(err, matchedTitles) {
//     if(matchedTitles.length > 1) {
//       res.render('disambig', {});
//     }
//     else {
//       models.Page.find({url_name: url_name}, function(err, page) {
//         if(err) {
//           console.log(err);
//         }
//       res.render('show', {doc: page[0]}); // page is an array
//       });
//     }
//   });
// };


exports.disambig = function(req, res) {
  var docMatch = function(uniqTitle, onComplete) {
    var objArr = [];
    models.Page.find({title: uniqTitle}, function(err, matchedTitles) {
      if(matchedTitles.length > 1) {
        // onComplete(null, matchedTitles);
      }
      // console.log('BEFORE RETURN objArr', objArr);
      onComplete(null, matchedTitles);
      // onComplete(null, objArr);
    });
  };

  models.Page.find().distinct('title', function(err, titles) {
    // async.map(arr, iterator, callback);
    async.map(titles, docMatch, function(err, results) {
      // console.log('FINAL ARRAY', results);
      console.log(titles);
      res.render('disambig', {docs: results});
    });
  });
};




// exports.disambig = function(req, res) {
//     models.Page.find().distinct('title', function(err, titles) {
//       var objArr = [];

//       titles.forEach(function(uniqTitle) {
//         models.Page.find({title: uniqTitle}, function(err, matchedTitles) {
//           if(matchedTitles.length > 1) {
//             console.log('matchedTitles', matchedTitles);
//             objArr.push(matchedTitles);
//             console.log('InterobjArr', objArr);
//           }
//         });
//         // console.log('FINALobjArr', objArr);
//         // res.render('disambig', {docs: objArr});
//       });
//       console.log('BEFORE RENDER objArr', objArr);
//       res.render('disambig', {docs: objArr});
//     });
//   // });
// };








// exports.disambig = function(req, res) {
//   var docMatch = function(uniqTitle, onComplete) {
//     var objArr = [];
//     models.Page.find({title: uniqTitle}, function(err, matchedTitles) {
//       if(matchedTitles.length > 1) {
//         // onComplete(null, matchedTitles);
//       }
//       // console.log('BEFORE RETURN objArr', objArr);
//       onComplete(null, matchedTitles);
//       // onComplete(null, objArr);
//     });
//   };

//   models.Page.find().distinct('title', function(err, titles) {
//     // async.map(arr, iterator, callback);
//     async.map(titles, docMatch, function(err, results) {
//       // console.log('FINAL ARRAY', results);
//       console.log(titles);
//       res.render('disambig', {docs: results});
//     });
//   });
// };


  //   titles.forEach(function(uniqTitle) {
  //     models.Page.find({title: uniqTitle}, function(err, matchedTitles) {
  //       if(matchedTitles.length > 1) {
  //         console.log('IN LOOP');
  //         console.log('matchedTitles', matchedTitles);
  //         objArr.push(matchedTitles);
  //         console.log('InterobjArr', objArr);
  //         // console.log('FINALobjArr', objArr);
  //       }
  //     });
  //     // console.log('FINALobjArr', objArr);
  //     // res.render('disambig', {docs: objArr});
  //   });
  //   console.log('BEFORE RENDER objArr', objArr);
  //   res.render('disambig', {docs: objArr});
  // });


  // async.each(matchList, docMatch, function(err, objArr) {


















    //   models.Page.find({title: currentDoc.title}, function(err, matchedTitles) {
    //     if(matchedTitles.length > 1) {
    //       console.log('IN LOOP');
    //       console.log('matchedTitles', matchedTitles);
    //       // console.log('alldocs', allDocs);
    //       objArr.push(matchedTitles);
    //       // sharedTitles[currentDoc.title] = matchedTitles;
    //       // console.log('sharedTitlesHash', sharedTitles);
    //       // console.log('objArr', objArr);
    //     }
    //   });
    //   // sharedArr.push(sharedTitles);
    // }

    //   // var needle = allDocs[i];
    //   // var idsWithSameTitle = [];
    //   // sharedTitles = {};
    //   // for(var j = 0; j < allDocs.length; j++) {
    //   //   if(needle.title === allDocs[j].title) {
    //   //     idsWithSameTitle.push(allDocs[j]._id);
    //   // }
    //   // sharedTitles[needle.title] = idsWithSameTitle;
    //   // objectArr.push(sharedTitles);
    //   // }
    // console.log('arr', objArr);
    // // console.log('first obj', objArr[0]);
    // res.render('disambig', {docs: objArr});
