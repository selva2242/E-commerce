import PageFactory from "../../pageFactory";

const mainTemplate = document.createElement('template');
mainTemplate.innerHTML = `
    <style>
       .main-container{
           margin-top : 80px;
           height : 100vh;
           width : 100vw;
           background-color : #fff;
       }
    </style>
    <div class = 'main-container'>
    </div>
`;

export default class Main extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode : "open"})
    }

    connectedCallback(){
        const type = this.getAttribute('type');
        this.shadowRoot.appendChild(mainTemplate.content.cloneNode(true));
        const pageFactory = new PageFactory();
        const page = pageFactory.createPage(type)
        this.shadowRoot.querySelector('.main-container').appendChild(page.element);
    }
}

window.customElements.define('main-container', Main);