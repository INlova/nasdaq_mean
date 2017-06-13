var mongoose = require('mongoose');
var Nasdaq = mongoose.model('Nasdaq');

module.exports.stocksGetOne = function(req, res){

  var id = req.params.stockId;
  // var id = req.query.symbol;
  console.log("GET stockId", id);

  Nasdaq
    .findById(id)
    // .findOne({'Symbol': id})
    .exec(function(err, doc){
      console.log("1.doc == " + doc);
      var response = {
        status : 200,
        message : doc
      };
      if(err){
        console.log("Error finding stock");
        response.status = 500;
        response.message = err;
      } else if (!doc) {
        response.status = 404;
        response.message = {
          "message" : "Stock ID not found " + id
        };
      }
      res
        .status(response.status)
        .json(response.message);
  });
};

var getStockSymbol = function(req, res){

  var symbol = req.query.symbol;
  console.log("1.getStockSymbol", symbol);

  Nasdaq
    .findOne({'Symbol': symbol})
    .exec(function(err, doc){
      console.log("2A.symbol == " + symbol);
      console.log("2B.doc == " + doc);
      var response = {
        status : 200,
        message : doc
      };
      if(err){
        console.log("Error finding stock");
        response.status = 500;
        response.message = err;
      } else if (!doc) {
        response.status = 404;
        response.message = {
          "message" : "Stock symbol not found "
        };
      }
      console.log("3A.response.status == ", response.status);
      console.log("3B.response.message == ", response.message);
      res
        .status(response.status)
        .json(response.message);
  });
};


module.exports.stocksGetAll = function(req, res){

  console.log('GET all the stocks');
  console.log("req.query == ", req.query);

  if(req.query && req.query.symbol){
    getStockSymbol(req, res);
  return;
  }

  var offset = 0;
  var count = 3;
  var maxCount = 10;

  if (req.query && req.query.offset){
    offset = parseInt(req.query.offset, 10);
  }

	if (req.count && req.query.count){
	 count = parseInt(req.query.count, 10);
	}

	if (isNaN(offset) || isNaN(count)){
		console.log("querystring error");
		res
			.status(400)
			.json({
				"message" : "If supplied count and offset should be numbers."
				});
		return;
	}

	if (count > maxCount){
		res
			.status(400)
			.json({
				"message" : "Count limit of " + maxCount + " exceeded"
			});
		return;
	}

	Nasdaq
	.find()
  .skip(offset)
  .limit(count)
	.exec(function(err, stocks){
    console.log("stocks == " + stocks);
		if(err){
			console.log("Error finding stocks");
			res
				.status(500)
				.json(err);
		} else {
		  console.log("Found " + stocks.length + " stocks");
      res
        .json(stocks);
		}
		console.log("found offset " + offset + " : count " + count + " stocks");
	});
};
