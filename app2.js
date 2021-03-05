const DBVERSION = 1;
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

    let tx = db.transaction('words', 'readwrite');
    this.store = tx.objectStore('words');
  }

  async get(key) {
    let val = await promiseReq(this.store.get(key));
    console.log('... val is ', val);
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


class Dict extends HTMLElement {
  constructor() {
    super();

    console.log("kkk")

    const pElem = document.createElement('span');
    const id = this.innerHTML

    const shadowRoot = this.attachShadow({mode: 'open'});

    // getFn('bye')

    pElem.textContent = `**changed**`;
    shadowRoot.appendChild(pElem);

    // db = request.result;
    // const tx = db.transaction("words", "readonly");
    // const store = tx.objectStore("words");
    // let q1 = store.get('hello');


    // console.log('+++++++++++ 1', q1);
    // q1.onsuccess = function() {
    //   console.log('.........', q1.result);
    //   if (q1.result === undefined) {
    //     pElem.textContent = `**${id}**`;
    //   } else {
    //     if ('ku' in q1.result) {
    //       pElem.textContent = q1.result.ku;
    //     } else {
    //       pElem.textContent = `*${id}*`;
    //     }
    //   }
    //   shadowRoot.appendChild(pElem);
    // }
  }
}

customElements.define('di-ct', Dict);

(async () => {
  try {
    wordDB = new WordDB()
    await wordDB.open(DBVERSION)
    await wordDB.inc()
  } catch(err) {
    console.log(err)
  }
})()


