import Storage from "react-native-storage";

const storage = new Storage({
  // maximum capacity, default 1000 key-ids
  size: 1000,

  // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
  // can be null, which means never expire.
  defaultExpires: 1000 * 3600 * 24,

  // cache data in the memory. default is true.
  enableCache: true,
});

export default storage;
