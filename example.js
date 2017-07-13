
var through = require('through2'),
    benchmark = require('./index.js');

function createDelayStream( delay ){
  return through.obj( function( chunk, enc, next ){
    setTimeout( function(){
      this.push( chunk );
      this.push( chunk );
      next();
    }.bind(this), delay );
  });
}

var streams = {
  stream1: createDelayStream(200),
  stream2: createDelayStream(100),
  tap: through.obj(),
  sink: through.obj( function( _, __, next ){ next(); })
};

streams.tap
  .pipe( benchmark.proxy( 'stream1', streams.stream1 ) )
  .pipe( benchmark.proxy( 'stream2', streams.stream2 ) )
  .pipe( benchmark.proxy( 'sink', streams.sink ) );

for( var i=0; i<10; i++ ){
  streams.tap.write({ hello: 'world' });
}

streams.tap.end();
