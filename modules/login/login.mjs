import Init from '../../core/init.js'

export default class Login extends Init {
  constructor(element) {
    super(element, 'login')
    this.data = {}
  }

  sayHello() {
    console.log('hello mahmoud')
  }

  alert() {
    alert("this is an alert")
  }

  submit() {
    console.log('hello form')
  }

  async middleware() {
    await this.render()
    return [null, null]
  }

}
