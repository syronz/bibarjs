const wordsFeed = [
  { id: "hello", en: "Hello", ku: "سڵاو" },
  { id: "bye", en: "Bye", ku: "خوا حافیز" },
  { id: "counter", en: 3, ku: "ئەرکەکان" },
  { id: "roles", en: "roles", ku: "ئەرکەکان" },
  { id: "users", en: "users", ku: "بەکارهێنەرەکان" },
  { id: "receipt vouchers", en: "receipt vouchers", ku: "پارە وەرگرتن" },
  { id: "code", en: "code", ku: "کۆد" },
  { id: "domain", en: "domain", ku: "دۆمەین" },
  { id: "message", en: "message", ku: "پەیام" },
  { id: "original error", en: "original error", ku: "هەڵەی بنەڕەتی" },
  { id: "path", en: "path", ku: "ڕێڕەو" },
  { id: "save", en: "save", ku: "save" },
  { id: "close", en: "close", ku: "close" },
  { id: "dashboard", en: "dashboard", ku: "dashboard" },
  { id: "city", en: "City", ku: "city" },
  { id: "cities", en: "cities", ku: "cities" },
  { id: "edit", en: "Edit", ku: "Edit" },
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
