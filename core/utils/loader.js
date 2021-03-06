export class Loader {
  static cache = new Map()

  constructor() {}
  generatePath = (str) => {
    const css = `${window.baseHref}/modules/${str}/${str}.css`
    const html = `${window.baseHref}/modules/${str}/${str}.html`
    return [css, html]
  }

  // getData is used for loading css and html and return back combine of them as union content
  getData = async (part) => {
    let data = this.constructor.cache.get(part)
    
    if (data === undefined) {
      const [css, html] = this.generatePath(part)
      const style = await fetch(css).then(stream => stream.text())
      data = await fetch(html).then(stream => stream.text())
      data = this.mergeCssHtml(style, part, data)

      this.constructor.cache.set(part, data)
    } 

    return data
  }

  mergeCssHtml(style, part, data) {
    return `<style>\n${style}</style><div class="frame ${part}">\n{{#with data}}${data}{{/with}}</div>`
  }
}
