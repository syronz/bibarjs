class Route {
  constructor(path, handlers) {
    this.path = path
    this.handlers = handlers
  }
}

export class Router {
  constructor(arr) {
    this.arr = arr
    this.routes = []
    this.parse('',this.arr,[], 0)
    this.param = new Map()
    this.query = new Map()
  }

  add(route) {
    if ( route.module !== null ) {
      route.handlers.push( _ => {
        import(route.module).then(async (cl) => {
          const lazyClass = new cl.default(main)
          // const data = await lazyClass.getContent()
          // main.innerHTML = `<b>${data}</b>`

          // lazyClass.init()
          if (typeof lazyClass.firstLoad === 'function') {
            lazyClass.firstLoad()
          }
        })
      })
    }

    this.routes.push(route)
  }

  parse(parentPath, arr, parentHandlers, index) {
    console.log('arr[i] : ',parentPath + '/' + arr[index].path, [...parentHandlers, arr[index].action], index)
    let route = new Route
    if ( typeof arr[index].action === 'function') {
      route = {
        path: `${parentPath}/${arr[index].path}`, 
        handlers: [...parentHandlers, arr[index].action],
      }
    } else {
      route = {
        path: `${parentPath}/${arr[index].path}`, 
        handlers: [...parentHandlers],
      }
    }
    route.module = null
    if ( 'module' in arr[index] ) {
      route.module = arr[index].module
    }
    this.add(route)
    if ('children' in arr[index]) {
      if ( typeof arr[index].action === 'function') {
        this.parse(parentPath + '/' + arr[index].path, arr[index].children,[...parentHandlers, arr[index].action], 0)
      } else {
        this.parse(parentPath + '/' + arr[index].path, arr[index].children,[...parentHandlers], 0)
      }
    }
    
    if ( index < (arr.length - 1) ) {
      this.parse(parentPath, arr,[...parentHandlers], index + 1)
    }
  }



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
          console.log('>>>>>>.......>>>>>...>>>....>>>>>', x)
          x()
        })
      }
    })

    console.log('----------___________--', this.param, this.query)


    // console.log('******', this.routes[0].handlers)
    // this.routes[3].handlers.map( x => {
    //   x()
    // })

  }

}
