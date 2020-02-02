import {Router} from './core/route/router.js'


const route = [
  { path: 'home', action: _ => console.log('this is home') },
  { path: 'login', module: '/modules/login/login.mjs' },
  { path: 'about', module: '/modules/about/about.mjs', children: [
    {path: 'sub', action: _ => console.log('this is sub') },
    {path: 'location', action: _ => console.log('this is location') },
    {path: 'history/:year', action: _ => console.log('this is history'), children: [
      {path: 'sort', action: _ => console.log('this is sort') },
      ],
    },
  
    ],
  },
  { path: 'users/:id', action: _ => console.log('this is users'), children: [
    { path: 'manage', action: _ => console.log('this is user manage') },
    { path: 'view', action: _ => console.log('this is user view') },
    ],
  },
  { path: 'contact', action: _ => console.log('this is contact') },
  { path: 'contact', action: _ => console.log('this is contact') },
]


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


const router = new Router(route)
router.root = baseHref

router.navigate(window.location.pathname)

window.addEventListener('popstate', () => {
  router.navigate(window.location.pathname, true)
})

const activeRoutes = Array.from(document.querySelectorAll('[route]'))
activeRoutes.forEach((route) => route.addEventListener('click', (e) => {
  e.preventDefault()
  router.navigate(e.target.getAttribute('route'))
}, false))

