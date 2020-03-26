import {Loader} from './utils/loader.js'
import {Router} from './route/router.js'

export default class Init {

  constructor(element, module, html, css) {
    this.element = element
    this.loader = new Loader
    this.module = module
    this.html = html
    this.css = css
    // this.render()
  }

  getContent = async () => {
    let content = ''
    if (this.html) {
      content = this.loader.mergeCssHtml(this.css,this.module, this.html)
    } else {
      content = await this.loader.getData(this.module)
    }

    return content
  }

  async render(data) {
    console.log(".......... render happened!!", data)
    let tmp = await this.getContent()

    var template = Handlebars.compile(tmp)
    tmp = template({ data: this.data})
    this.element.innerHTML = `${tmp}`

    const btns = Array.from(document.querySelectorAll(`.${this.module} [pOnclick]`))
    btns.forEach((btn) => btn.addEventListener('click', (e) => {
      e.preventDefault()
      const f = `this.${e.target.getAttribute('pOnclick')}`
      eval(f)
    }, false ))

    const router = new Router(window.routes, window.baseHref)
    const activeRoutes = Array.from(document.querySelectorAll(`.${this.module} [route]`))
    activeRoutes.forEach((route) => route.addEventListener('click', (e) => {
      e.preventDefault()
      router.navigate(e.target.getAttribute('route'))
    }, false))

    // show icons
    feather.replace()

  }


}
