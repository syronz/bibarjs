window.DBVERSION = 2;
window.LANG = 'ku';

import { WordDB } from './core/word-db.js';
import './core/custom-elements/dict.js';
import './core/custom-elements/side-bar.js';


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


