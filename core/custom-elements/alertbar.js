class AlertBar extends HTMLElement {
  constructor() {
    super();

    const container = document.createElement('div');
    const level = this.getAttribute('level');
    const code = this.getAttribute('code');
    const domain = this.getAttribute('domain');
    const message = this.getAttribute('message');
    const original_error = this.getAttribute('original_error');
    const title = this.getAttribute('title');
    const type = this.getAttribute('type');


    container.innerHTML = `
      <style>
        .container {
          position: relative;
          padding: .5rem 1rem;
          margin-bottom: 1rem;
          border: 1px solid transparent;
          border-radius: .25rem;
        }
        .danger {
          color: #721c24;
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }

        code {
          display: block;
        }
      </style>

      <div class="container ${level}">
        <details>
          <summary>${title} - ${message}</summary>
          <code><di-ct>code</di-ct>: ${code}</code>
          <code><di-ct>domain</di-ct>: ${domain}</code>
          <code><di-ct>original error</di-ct>: ${original_error}</code>
          <code><di-ct>detail</di-ct>: <a href="${type}" target="_blank">${type.split('#')[1]}</a></code>
          <p>Epcot is a theme park at Walt Disney World Resort featuring exciting attractions, international pavilions, award-winning fireworks and seasonal special events.</p>
        </details>


      </div>
    `;

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(container);



  }
}

customElements.define('alert-bar', AlertBar);
