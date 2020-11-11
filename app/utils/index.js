const wait_ = (resolve, reject, timestamp, waitTime = 0, start = undefined) => {
  start = start || timestamp;
  const progress = timestamp - start;

  if (progress >= waitTime) {
    try {
      resolve();
    } catch (e) {
      reject(e);
    }
  } else {
    requestAnimationFrame((timestamp) =>
      wait_(resolve, reject, timestamp, waitTime, start)
    );
  }
};

export const asyncCall = (callback, waitTime = 0) =>
  new Promise((resolve, reject) =>
    requestAnimationFrame((timestamp) =>
      wait_(
        () => resolve(callback()),
        (e) => reject(e),
        timestamp,
        waitTime
      )
    )
  );

const getMinMaxRandom_ = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

export const getRandomPosition = ({ rows, columns }) => {
  const x = getMinMaxRandom_(1, columns);
  const y = getMinMaxRandom_(1, rows);

  return { x, y };
};

export const generateMapFromKeys = (keys) =>
  keys.reduce((acc, curr) => {
    acc[curr] = curr;

    return acc;
  }, {});

export const getComputedStyle = (element) =>
  asyncCall(() => {
    return global.getComputedStyle(element);
  });

export const getBoundingClientRect = (element) =>
  asyncCall(() => {
    return element.getBoundingClientRect();
  });

export const setGlobalProperty = (document, property, value) => {
  document.documentElement.style.setProperty(property, value);
};
