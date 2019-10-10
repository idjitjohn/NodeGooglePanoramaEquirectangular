# NodeGooglePanoramaEquirectangular
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

[![2d](http://i.imgur.com/AukW6Mv.png)](http://mattdesl.github.io/google-panorama-equirectangular/demo/)

## Install

```sh
npm install node-google-panorama-equirectangular
```
Package to bring https://github.com/mattdesl/google-panorama-equirectangular to node

### Basic use

```js
const load = require('node-google-equirectangular')

// Use an array
load('dXZfBMex9_L7jO2JW3FTdA', { zoom: 3 }, false )
  .on('complete', function () {
    // everything's finished
  })
  .on('progress', function (progress) {
    console.log(progress + '%')
  })
  .on('imageready', function (image) {
    image.jimpImage.write(image.id + '.jpg')
  })

// ...

//use an array
load(['dXZfBMex9_L7jO2JW3FTdA', 'dXZfBMex9_L7jO2JW3FTdA'], { zoom: 4 }, false )
  .on('complete', function () {
    // everything's finished
  })
  .on('progress', function (progress) {
    console.log(progress + '%')
  })
  .on('imageready', function (image) {
    image.jimpImage.write(image.id + '.jpg')
  })

```