import {Loader} from './utils/loader.js'

export default class Init {

  constructor(element, module, html, css) {
    this.element = element
    this.loader = new Loader
    this.module = module
    this.html = html
    this.css = css
  }

  getContent = async () => {
    return this.loader.mergeCssHtml(this.css,this.module, this.html)
  }

  async render() {
    let tmp = await this.getContent()

    var template = Handlebars.compile(tmp)
    tmp = template({ data: this.data})
    this.element.innerHTML = `${tmp}`
  }


}
