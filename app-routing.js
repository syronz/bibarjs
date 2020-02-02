import {Router} from './core/route/router.js'


window.baseHref = 'http://localhost:3000'

const routes = [
  { path: 'home', module: _ => console.log('this is home') },
  { path: 'login', module: '/modules/login/login.mjs' },
  { path: 'about', module: '/modules/about/about.mjs', children: [
    {path: 'sub', module: _ => console.log('this is sub') },
    {path: 'location', module: _ => console.log('this is location') },
    {path: 'history/:year', module: _ => console.log('this is history'), children: [
      {path: 'sort', module: _ => console.log('this is sort') },
      ],
    },
  
    ],
  },
  { path: 'users', module: '/modules/user/user.mjs', children: [
    { path: ':id', module: '/modules/user-view/user-view.mjs', children: [
      { path: 'manage', module: _ => {console.log('this is users > 35 > manage'); return ['NEXT', 10]} },
      { path: 'view', module: _ => console.log('this is user view') },
    ]},
  ]},
  { path: 'contact', module: _ => console.log('this is contact') },
  { path: 'contact', module: _ => console.log('this is contact') },
]


const router = new Router(routes, window.baseHref)

const contactHandler = () => {
  const main = document.getElementById('main')
  main.innerHTML = 'contact works';
  console.log('contact works');
}

const homeHandler = () => {
  const main = document.getElementById('main')
  main.innerHTML = 'home';
}

router.navigate(window.location.pathname)

window.addEventListener('popstate', () => {
  router.navigate(window.location.pathname, true)
})

const activeRoutes = Array.from(document.querySelectorAll('[route]'))
activeRoutes.forEach((route) => route.addEventListener('click', (e) => {
  e.preventDefault()
  router.navigate(e.target.getAttribute('route'))
}, false))

