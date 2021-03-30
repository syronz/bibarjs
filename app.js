import {Router} from './core/route/router.js';
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

Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});


(async () => {
  try {
    let wordDB = new WordDB()
    await wordDB.open(DBVERSION)
    await wordDB.inc()


    // load snack-bar
    const snackBar = document.querySelector('snack-bar');
    window.SnackBar = snackBar;

    window.UserInfo = JSON.parse(localStorage.getItem('user_info'));
    if (window.UserInfo === undefined
        | window.UserInfo?.lang === undefined
        | window.UserInfo?.id === undefined) {
      const router = new Router(window.routes, window.baseHref)
      router.navigate('/login');
    }
    console.log(window.UserInfo);

  } catch(err) {
    console.warn(err)
  }
})()


