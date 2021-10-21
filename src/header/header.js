const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `
    <style>
        .header {
            height: 40px;
            padding: 20px 20px;
            border-bottom: 2px solid #eff3f6;
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            z-index: 101;
            background: #f5f8fa;
        }
        .header-title {
            color : green;
            font-size : 2rem;
            font-weight : 600;
        }
    </style>
    <div class='header'>
        <span class='header-title'> </span>
    </div>
`;

class Header extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode : 'open'})
    }

    connectedCallback(){
        this.shadowRoot.appendChild(headerTemplate.content.cloneNode(true));
        this.shadowRoot.querySelector(".header-title").innerText = this.getAttribute("title")
    }
}

window.customElements.define('app-header', Header);

