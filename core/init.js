import {Loader} from './utils/loader.js'

export default class Init {

  constructor(element, module) {
    this.element = element
    console.log("..........>>>>>>>>>>> this is init")
    this.loader = new Loader
    this.module = module
    this.render()
  }

  getContent = async () => {
    let content = await this.loader.getData(this.module)

    return content
  }

  async render(data) {
    console.log("data in init.js", data)
    let tmp = await this.getContent()
    console.log("this is render in init")

    var template = Handlebars.compile(tmp)
    tmp = template({ data: this.data})
    this.element.innerHTML = `<b>${tmp}</b>`

    const btns = Array.from(document.querySelectorAll(`.${this.module} [pOnclick]`))
    console.log(btns)
    btns.forEach((btn) => btn.addEventListener('click', (e) => {
      e.preventDefault()
      const f = `this.${e.target.getAttribute('pOnclick')}`
      eval(f)
    }, false ))

  }


}
