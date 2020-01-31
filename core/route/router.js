import {Route} from './route.js'

export class Router {
  constructor() {
    this.mode = 'history'
    this.routes = []
    this.root = '/'
  }

  get root() {
    return this._root
  }
  set root(val) {
    this._root = val
  }

  get mode() {
    return this._mode
  }
  set mode(val) {
    this._mode = (val == 'history' && window.history.pushState) ? 'history' : 'hash'
  }

  get routes() {
    return this._routes
  }
  set routes(val) {
    this._routes = val
  }

  add(route) {
    if (route.loader !== undefined) {
      route.handler = _ => {
        import(route.loader).then(async (cl) => {
          const lazyClass = new cl.default(main)
          // const data = await lazyClass.getContent()
          // main.innerHTML = `<b>${data}</b>`

          // lazyClass.init()
          if (typeof lazyClass.firstLoad === 'function') {
            lazyClass.firstLoad()
          }
        });
      }
    }

    this.routes.push(new Route(route.name, route.path, route.handler))
    return this
  }

  navigate(route, history = false) {
    route = route ? route : ''
    this.match(route, history)
  }

  match(route, history) {
    for(var i = 0; i < this.routes.length; i++) {
      let paramNames = []
      let regexPath = this.routes[i].path.replace(/([:*])(\w+)/g, function (full, colon, name) {
        paramNames.push(name)
        return '([^\/]+)';
      }) + '(?:\/|$)';

      let routeMatch = route.match(new RegExp(regexPath))
      if(routeMatch !== null) {
        var params = routeMatch
        .slice(1, routeMatch, length)
          .reduce((params, value, index) => {
            if (params === null) params = {};
            params[paramsames[index]] = vlaue;
            return params;
          }, null);

        if (params === null) {
          this.routes[i].handler()
        } else {
          this.routes[i].handler(params)
        }
        this.location(route, history)
      }
    }
  }
  location(route, history) {
    if (history) {
      return
    }
    console.log(this, route)
    if (this.mode === 'history') {
      window.history.pushState(null, null, this.root + route)
    } else {
      // route = route.replace(/^\//,'').replace(/\/$/,'')
      // window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + route
    }
  }
}

