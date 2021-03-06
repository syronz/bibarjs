const wordsFeed = [
  { id: "hello", en: "Hello", ku: "salam" },
  { id: "bye", en: "Bye", ku: "xwa hafiz" },
  { id: "counter", en: 3, ku: "xwa hafiz" },
  { id: "roles", en: "roles", ku: "rolakan" },
  { id: "users", en: "users", ku: "bakarhenarakan" },
  { id: "receipt vouchers", en: "receipt vouchers", ku: "para wargrtnakan" },
];

function promiseReq(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export class WordDB {
  async open(version) {
    let dbReq = indexedDB.open('dictionary', version);
    dbReq.onupgradeneeded = (e) => {
      let db = dbReq.result;
      let wStore;

      console.log(e)
      if (e.oldVersion < 1) {
        wStore = db.createObjectStore('words', {keyPath: 'id'});
      } else {
        db.deleteObjectStore('words');
        wStore = db.createObjectStore('words', {keyPath: 'id'});
      }

      for (let i in wordsFeed) {
        wStore.add(wordsFeed[i]);
      }

    };
    let db = await promiseReq(dbReq);

    let tx = db.transaction('words', 'readwrite');
    this.store = tx.objectStore('words');
  }

  sayHello() {
    console.log('hello I\'m wordDB');
  }

  async get(key) {
    let val = await promiseReq(this.store.get(key));
    return val

  }

  async inc() {
    let val = await promiseReq(this.store.get('counter'));
    if (typeof val == undefined) {
      val = { id: "counter", en: 3, ku: "xwa hafiz" };
    }
    val.en += 1;
    await promiseReq(this.store.put(val));
  }
}
