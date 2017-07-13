
var through = require('through2'),
    now = require('performance-now');

module.exports.proxy = function( title, stream ){
  var memo = { input: 0, output: 0, time: 0, title: title };

  return through.obj( function( chunk, enc, next ){

    memo.input++;
    var start = now();

    // proxy
    stream._transform.call( this, chunk, enc, function(){
      memo.time += now() - start;
      memo.output++;
      next.apply( this, Array.prototype.slice.call( arguments ) );
    });

  }, function( done ){
    stream.end();
    done();
    report( memo );
  });
};

function report( memo ){
  var avg = ( memo.time / memo.input );
  console.error( '[%s] processed %d records in %d ms', memo.title, memo.input, memo.time.toFixed(4) );
  console.error( '[%s] average speed %d ms', memo.title,  avg.toFixed(4) );
}
