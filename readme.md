# callbag-pausable-interval

A callbag listenable source that sends incremental numbers every x milliseconds, but can be paused (and resumed) when it is pulled by a sink. This is hybrid source, its both listenable and pullable. Don't use `forEach` directly as the sink for this source, because `forEach` pulls every time it receives data. You can use this source as the argument for `sample`, though.

`npm install callbag-pausable-interval`

## example

```js
const pausableInterval = require('callbag-pausable-interval')

const source = pausableInterval(600)

source(0, (type, data) => {
  if (type === 0) {
    const talkback = data
    // Every 2 seconds, send a message "null" back to the source
    setInterval(() => talkback(1, null), 2000)
  }
  if (type === 1) console.log(data)
})
// 0
// 1
// 2
// ...pauses and waits...
// 3
// 4
// 5
// ...pauses and waits...
// 6
// 7
// 8
// ...
```

