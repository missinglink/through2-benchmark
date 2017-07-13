## Disclaimer

This module was written quick 'n dirty, it currently doesn't have tests and the API will probably change over time.

## Installation

```bash
$ npm install through2-benchmark
```

[![NPM](https://nodei.co/npm/through2-benchmark.png?downloads=true&stars=true)](https://nodei.co/npm/through2-benchmark)

## Example

```javascript
// copied from example.js

var through = require('through2'),
    benchmark = require('through2-benchmark');

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
```

```bash
$ node example.js
[stream1] processed 10 records in 2015.7093 ms
[stream1] average speed 201.5709 ms
[stream2] processed 20 records in 2025.5596 ms
[stream2] average speed 101.278 ms
[sink] processed 40 records in 0.8005 ms
[sink] average speed 0.02 ms
```
