import {Router} from './core/route/router.js'


window.baseHref = 'http://localhost:3000'

window.routes = [
  // { path: 'dashboard', module: _ => { console.log('this is home'); return ['NEXT', 10] } },
  { path: '', module: _ => { window.location.pathname = '/dashboard' } },
    // window.history.pushState(null, null,  route)
  { path: 'dashboard', module: '/modules/dashboard/dashboard.mjs', children: [
    { path: 'about', module: '/modules/about/about.mjs', children: [
      {path: 'sub', module: _ => { console.log('this is sub'); return ['NEXT', 10] } },
      {path: 'location', module: _ => { console.log('this is location'); return ['NEXT', 10] } },
      {path: 'history/:year', module: _ => { console.log('this is history'); return ['NEXT', 10] }, children: [
        {path: 'sort', module: _ => { console.log('this is sort'); return ['NEXT', 10] } },
        ],
      },
    
      ],
    },
    { path: 'users', module: '/modules/user/user.mjs', children: [
      { path: ':id', module: '/modules/user-view/user-view.mjs', children: [
        { path: 'manage', module: _ => {console.log('this is users > 35 > manage'); return ['NEXT', 10]} },
        { path: 'view', module: _ => { console.log('this is user view'); return ['NEXT', 10] } },
      ]},
    ]},
    { path: 'contact', module: _ => { console.log('this is contact'); return ['NEXT', 10] } },
  ]},
  { path: 'login', module: '/modules/login/login.mjs' },
]


const router = new Router(window.routes, window.baseHref)

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

// const activeRoutes = Array.from(document.querySelectorAll('[route]'))
// activeRoutes.forEach((route) => route.addEventListener('click', (e) => {
//   e.preventDefault()
//   router.navigate(e.target.getAttribute('route'))
// }, false))

