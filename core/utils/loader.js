export class Loader {
  static cache = new Map()

  constructor() {}
  generatePath = (str) => {
    const css = `./modules/${str}/${str}.css`
    const html = `./modules/${str}/${str}.html`
    return [css, html]
  }

  // getData is used for loading css and html and return back combine of them as union content
  getData = async (part) => {
    let data = this.constructor.cache.get(part)
    
    if (data === undefined) {
      const [css, html] = this.generatePath(part)
      const style = await fetch(css).then(stream => stream.text())
      data = await fetch(html).then(stream => stream.text())
      data = `<style>\n${style}</style>\n{{#with data}}${data}{{/with}}`


      this.constructor.cache.set(part, data)
    } 

    return data
  }
}
