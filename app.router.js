import {Router} from './core/route/router.js'

const router = new Router()
const baseHref = 'http://localhost:3000'


const contactHandler = () => {
  const main = document.getElementById('main')
  main.innerHTML = 'contact works';
  console.log('contact works');
}

const homeHandler = () => {
  const main = document.getElementById('main')
  main.innerHTML = 'home';
}


// const helloBtn = document.querySelector('[onclick]')
// console.log(helloBtn)
// window.addEventListener('click', _ => {
//   sayHello()
// })


router.root = baseHref
// const main = document.getElementById('main')
// router.add({name:'home', path:'/', handler: () => console.log('handler to home')})
router.add({name:'home', path:'/', handler: homeHandler})
router.add({name:'about', path:'/about', loader: './modules/about/about.mjs'})
router.add({name:'contact', path:'/contact', handler: contactHandler})
router.add({name:'user', path:'/user/:id/:action', handler: (params) => console.log('handler to user')})
// router.add({name:'login', path:'/login', handler: loginHandler})
router.add({name:'login', path:'/login', loader: './modules/login/login.mjs'})

// if (window.location.pathname != '/') {
//   router.navigate(window.location.pathname)
// } else {
//   router.navigate(window.location.pathname)
// }

router.navigate(window.location.pathname)

window.addEventListener('popstate', () => {
  router.navigate(window.location.pathname, true)
})

const activeRoutes = Array.from(document.querySelectorAll('[route]'))
activeRoutes.forEach((route) => route.addEventListener('click', (e) => {
  e.preventDefault()
  router.navigate(e.target.getAttribute('route'))
}, false))

