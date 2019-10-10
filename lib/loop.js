/**
 * node-sync-async-loop
 * marson.laza@gmail.com
 * @idjitjohn
 * version 0.1
 */

module.exports = loop

function loop(arr, callback, endCallback){
  arr.reduce((prev, elt, index) => {
    return new Promise(resolve => {
      const f = done => callback(elt, (err, new_elt) => {
        if(!done) done = { tab: [], err: null}
        done.tab.push(new_elt)
        if(err) done.err = err
        resolve(done)
      }, index)
      if(prev) prev.then(done => {f(done)})
      else f()
    })
  }, false).then(done => {
    if(endCallback) endCallback(done.err, done.tab)
  })
}

loop.parallel = (arr, callback, endCallback) => {
  let error = null
  const all = arr.map((elt, index) => {
    return new Promise(resolve => {
      callback(elt, (err, new_elt) => {
        if(err) error = err
        resolve(new_elt)
      }, index)
    })
  })

  Promise.all(all).then(nArr => {
    if(endCallback) endCallback(error, nArr)
  })
}