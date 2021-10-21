const footerTemplate = document.createElement('template');
footerTemplate.innerHTML = `
    <style>
        .footer {
            display : flex;
            justify-content : center;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            background: #fff;
        }
    </style> 
    <div class='footer'>
        <div> All rights reserved<h3>
    </div>
`

class Footer extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode : 'open'});
    }

    connectedCallback(){
      this.shadowRoot.appendChild(footerTemplate.content.cloneNode(true));
    }
}

window.customElements.define('app-footer', Footer);

