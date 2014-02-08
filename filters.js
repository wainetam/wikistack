// Setting custom filters on Swig

module.exports = function(swig) {
  var page_link = function(doc) {
    var link_name;
    if (typeof doc.title !== "undefined" && doc.title !== "") {
      link_name = doc.title;
    } else {
      link_name = "Page "+doc.url_name;
    }
    // return "<a href='/wiki/"+doc.url_name+"'>"+link_name+"</a>";
    return "<a href='/wiki/"+doc._id+"'>"+link_name+"</a>";
  };
  page_link.safe = true;

  swig.setFilter('page_link', page_link); // second page_link is name of function

  var markedFunc = function(body) {
    var marked = require('marked');
    return marked(body);
  };

  markedFunc.safe = true;
  swig.setFilter('marked', markedFunc); // 'marked' is name of filter

  var truncate_str = function(str) {
    var maxCharCount = 100;
    var result = str.slice(0, maxCharCount) + "...";
    return result;
  };
  swig.setFilter('truncate_str', truncate_str); // 'marked' is name of filter
};

