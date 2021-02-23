
initWords = (initLoadWords) => {
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

  console.log('----------> 1');

  request.onerror = (event) => {
    console.log('----------> 2');
    console.log("error: ");
  };

  request.onsuccess = (event) => {
    console.log('----------> 3');
    db = request.result;
    console.log("success: "+ db);
    initLoadWords(request);
  };

  request.onupgradeneeded = (event) => {
    console.log('----------> 4');
    const db = event.target.result;
    if (db.objectStoreNames.length > 0) {
      db.deleteObjectStore('words');
    }

    const wordsStore = db.createObjectStore("words", {keyPath: "id"});
    for (let i in words) {
      wordsStore.add(words[i]);
    }
  }
}



//dict
initLoadWords = (request) => {
  customElements.define('di-ct',
    class extends HTMLElement {
      constructor() {
        super();

        const pElem = document.createElement('span');
        const id = this.innerHTML

        const shadowRoot = this.attachShadow({mode: 'open'});


        //start
        // let request = window.indexedDB.open("dictionary", 1),
        //   db,
        //   tx,
        //   store,
        //   index;

        db = request.result;
        const tx = db.transaction("words", "readonly");
        const store = tx.objectStore("words");
        let q1 = store.get('hello');
        

        console.log('+++++++++++ 1', q1);
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


        /*
        request.onerror = function(e) {
          console.log('+++++++++++ 2');
          console.warn("there was an error: ", e);
        }

        request.onsuccess = function(e) {
          console.log('+++++++++++ 3');
          db = request.result;
          tx = db.transaction("words", "readonly");
          store = tx.objectStore("words");

          db.oerror = function(e) {
            console.warn("ERROR: ",e, e.target.errCode);
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
        */
        //end
      }
    }
  );
}

initWords(initLoadWords);
