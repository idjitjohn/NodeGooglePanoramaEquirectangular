var load = require('./index');

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