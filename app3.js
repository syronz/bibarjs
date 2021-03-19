window.DBVERSION = 3;
window.LANG = 'ku';

import { WordDB } from "./core/word-db.js";
import "./core/custom-elements/dict.js";
import "./core/custom-elements/sidebar.js";
import "./core/custom-elements/goto.js";
import "./core/custom-elements/bitable.js";
import "./core/custom-elements/biform.js";
import "./core/custom-elements/snackbar.js";
import "./core/custom-elements/alertbar.js";


(async () => {
  try {
    let wordDB = new WordDB()
    await wordDB.open(DBVERSION)
    await wordDB.inc()
    // let r = await wordDB.get('hello');
    // console.log(r);
  } catch(err) {
    console.warn(err)
  }
})()


