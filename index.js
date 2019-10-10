var getPanoramaTiles = require('./lib/getPanoramaTiles')
var Emitter = require('events').EventEmitter
var each = require('./lib/loop');
var jimp = require('jimp');
var request = require('request').defaults({ encoding: null });

module.exports = loadImages

function chunk(array, size) {
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
}

function loadImages(ids, opt) {
  if(typeof ids === 'string') ids = [ids]
  opt = opt || {}
  var emitter = new Emitter()
  let item = 0, total = 0
  function check (finished, jpl, id) {
    emitter.emit('imageready', {
      finished,
      jimpImage: jpl,
      total: ids.length,
      id
    })
    if (finished <= ids.length) {
      emitter.emit('complete')
    }
  }
  let state = 0;
  process.nextTick(start)
  return emitter

  function startOne(data, next, index) {
    loadImage(data,() => ++item).on('finished', (image) => {
      check(++state, image,ids[index])
      next()
    }).on('progress', (data) => {
      const progress = Math.floor(100 * data.current/(data.tilesCount * ids.length))
      emitter.emit('progress', progress)
    })
  }

  function start(){
    const datas = ids.map(id => {
      const data = getPanoramaTiles(id, opt)
      return data
    })
    each(datas, startOne)
    if(ids.length === 0) check(0)
  }
}

function loadImage (data, increment) {
  const images = data.images
  const emitter = new Emitter()
  process.nextTick(start)
  return emitter

  function requestTile(image, next, index) {
    let vita = false
    request(image.url, (err, res, data) => {
      vita = true
      if(!data) return setTimeout(()=>{
        console.log(image.url)
        requestTiles(image, next)
      },100)
      jimp.read(data).then(jpl => {
        emitter.emit('progress', {
          current: increment(),
          tilesCount: images.length
        })
        next(err, {
          image: jpl,
          ...image
        })
      })
    })
  }

  function loadChunk(chunkPart, next){
    each.parallel(chunkPart, requestTile, (err, chunkPartResult) => {
      next(err, chunkPartResult)
    })
  }

  function start () {
    const chunkedImages = chunk(images, 50)
    each(chunkedImages, loadChunk, (error, chunkedImagesResult) => {
      new jimp(data.width, data.height, 0x0, function (err, image) {
        chunkedImagesResult.forEach(chunkPart => {
          for (let i = 0; i < chunkPart.length; i++) {
            image.blit(chunkPart[i].image, chunkPart[i].position[0], chunkPart[i].position[1]);
          }
        })
        emitter.emit('finished', image)
      });
    })
  }
}