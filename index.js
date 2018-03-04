const pausableInterval = period => (start, sink) => {
  if (start !== 0) return;
  let i = 0, id = null;
  const pause = () => {
    clearInterval(id);
    id = null;
  };
  const resume = () => {
    id = setInterval(() => { sink(1, i++); }, period);
  };
  sink(0, t => {
    if (t === 1) {
      if (id) pause();
      else resume();
    }
    if (t === 2) pause();
  });
  resume();
};

module.exports = pausableInterval;
