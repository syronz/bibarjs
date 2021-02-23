function promiseReq(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const wordsFeed = [
  { id: "hello", en: "Hello", ku: "slaw" },
  { id: "bye", en: "Bye", ku: "xwa hafiz" },
  { id: "counter", en: 3, ku: "xwa hafiz" },
];

class WordDB {
  async open(version) {
    let dbReq = indexedDB.open('dictionary', version);
    dbReq.onupgradeneeded = () => {
      let db = dbReq.result;
      const wStore = db.createObjectStore('words', {keyPath: 'id'});
      for (let i in wordsFeed) {
        wStore.add(wordsFeed[i]);
      }
    };
    let db = await promiseReq(dbReq);

    // Increment a counter 10 times in the same transaction.
    let tx = db.transaction('words', 'readwrite');
    this.store = tx.objectStore('words');


    // await promiseReq(this.store.put(1, 'counter'));
  }

  async inc() {
    let val = await promiseReq(this.store.get('counter'));
    console.log('4$$$$$$44', val);
    if (typeof val == undefined) {
      val = { id: "counter", en: 3, ku: "xwa hafiz" };
    }
    val.en += 1;
    await promiseReq(this.store.put(val));
  }




}

// async function test() {
//   // Open database.
//   let dbReq = indexedDB.open('test', 1);
//   dbReq.onupgradeneeded = () => {
//     let db = dbReq.result;
//     db.createObjectStore('counters');
//   };
//   let db = await promiseReq(dbReq);

//   // Increment a counter 10 times in the same transaction.
//   let tx = db.transaction('counters', 'readwrite');
//   let store = tx.objectStore('counters');
//   for (let i=0; i < 10; i++) {
//     let val = await promiseReq(store.get('counter'));
//     if (typeof val !== 'number') {
//       val = 0;
//     }
//     val += 1;
//     await promiseReq(store.put(val, 'counter'));
//   }

//   // Output the final value.
//   let finalVal = await promiseReq(store.get('counter'));
//   console.log('Final value', finalVal);
// }

// console.log('Starting test');
// test().catch(err => console.error('Test failed', err));

(async () => {
  try {
    wordDB = new WordDB()
    await wordDB.open(2)
    await wordDB.inc()
  } catch(err) {
    console.log(err)
  }
})()


