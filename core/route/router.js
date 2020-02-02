class Route {
  constructor(path, handlers) {
    this.path = path
    this.handlers = handlers
  }
}

// Router is main class for manage navigation between pages
export class Router {
  constructor(arr) {
    this.arr = arr
    this.routes = []
    this.parse('',this.arr,[], 0)
    this.param = new Map()
    this.query = new Map()
  }

  add(route) {
    this.routes.push(route)
  }

  // parse the arr and set module for each route, it support parent module which in same 
  // time a path can has more than one handler. Module can be string of an mjs file for
  // loading dynamic or a regular function
  parse(parentPath, arr, parentHandlers, index) {

    let handler

    // check if the module is path of mjs file or a function, function can be used as a 
    // middleware or guard
    switch (typeof arr[index].module) {
      case 'string':
        handler = _ => {
          import(arr[index].module).then(async (cl) => {
            const lazyClass = new cl.default(main)
            if (typeof lazyClass.firstLoad === 'function') {
              lazyClass.firstLoad()
            }
          })
        }
        break
      case 'function':
        handler = arr[index].module
        break
      default :
        console.warn('module should be string or function!!!',typeof arr[index].module, arr[index].module)
    }


    // add current route to the router.arrays
    this.add(new Route(`${parentPath}/${arr[index].path}`, [...parentHandlers, handler]))

    // in case of the route has children, the method recursivly parse it
    if ('children' in arr[index]) {
      this.parse(parentPath + '/' + arr[index].path, arr[index].children,[...parentHandlers, handler], 0)
    }

    // condition for stop parsing per level, level holded by index
    if ( index < (arr.length - 1) ) {
      this.parse(parentPath, arr,[...parentHandlers], index + 1)
    }
  }

  // navigate will activate when user click on route button or history browser buttons
  // (back, forward) clicked or for first load of page. this method getting help from
  // regex and string functions, url encode not supported yet
  navigate(url) {
    this.param = new Map()
    this.query = new Map()

    const urlArr = url.split('?')
    url = urlArr[0]
    const queryStr = urlArr[1]


    this.routes.map( route => {
      const params = []
      let preparedReg = route.path.replace(/:(\w+)/g, (_, paramName) => {
        params.push(paramName)
        return '(\\w+)'
      })

      preparedReg += '$'

      const regPattern = new RegExp(preparedReg)
      let mArr = url.match(regPattern)
      if (mArr !== null) {
        for ( let i = 0, k = 1; i < params.length; i++, k++) {
          this.param.set(params[i], mArr[k])
        }

        if ( queryStr !== undefined ) {
          queryStr.split('&').map(x => {
            const parts = x.split('=')
            this.query.set(parts[0], parts[1])
          })
        }

        route.handlers.map( x => {
          x()
        })

        this.location(route.path) 
      }
    })


  }

  location(route) {
    window.history.pushState(null, null,  route)
  }

}
