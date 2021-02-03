//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || 
  window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || 
  window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
  window.msIDBKeyRange

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.")
}


const words = [
  { id: "hello", en: "Hello", ku: "slaw" },
  { id: "bye", en: "Bye", ku: "xwa hafiz" },
];
// var db;
const request = window.indexedDB.open("dictionary", 1);

request.onerror = (event) => {
  console.log("error: ");
};

request.onsuccess = (event) => {
  db = request.result;
  console.log("success: "+ db);
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.deleteObjectStore('words');

  const wordsStore = db.createObjectStore("words", {keyPath: "id"});
  for (let i in words) {
    wordsStore.add(words[i]);
  }
}


//dict
customElements.define('di-ct',
  class extends HTMLElement {
    constructor() {
      super();

      const pElem = document.createElement('span');
      const id = this.innerHTML

      const shadowRoot = this.attachShadow({mode: 'open'});


      //start
      let request = window.indexedDB.open("dictionary", 1),
        db,
        tx,
        store,
        index;


      request.onerror = function(e) {
        console.warn("there was an error: ", e);
      }

      request.onsuccess = function(e) {
        db = request.result;
        tx = db.transaction("words", "readonly");
        store = tx.objectStore("words");

        db.oerror = function(e) {
          console.warn("ERROR: ", e.target.errCode);
        }

        let q1 = store.get(id);
        q1.onsuccess = function() {
          console.log('.........', q1.result);
          if (q1.result === undefined) {
            pElem.textContent = `**${id}**`;
          } else {
            if ('ku' in q1.result) {
              pElem.textContent = q1.result.ku;
            } else {
              pElem.textContent = `*${id}*`;
            }
          }
          // if ('ku' in q1.result) {
          //   console.log(q1.result.ku);
          // }
          // pElem.textContent = q1.result.ku;
          shadowRoot.appendChild(pElem);
        }

        tx.oncomplete = function() {
          db.close();
        }
      }
      //end
    }
  }
);

