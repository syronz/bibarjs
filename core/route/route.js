export class Route {
  constructor(name, path, handler, loader) {
    this.name = name
    this.path = path
    this.handler = handler
    this.loader = loader
  }

  get name() {
    return this._name
  }
  set name(name) {
    this._name = name
  }

  get path() {
    return this._path
  }
  set path(path) {
    this._path = path
  }

  get handler() {
    return this._handler
  }
  set handler(handler) {
    this._handler = handler
  }
}
