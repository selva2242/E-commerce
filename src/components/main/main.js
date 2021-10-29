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

    static get observedAttributes() {
        return ['type'];
    }

    generatePage(type){
        this.shadowRoot.appendChild(mainTemplate.content.cloneNode(true));
        const pageFactory = new PageFactory();
        const page = pageFactory.createPage(type)
        const mainContainer = this.shadowRoot.querySelector('.main-container');
        mainContainer.innerHTML = ``;
        mainContainer.appendChild(page.element);
    }

    connectedCallback(){
        // this.generatePage();
    }

    attributeChangedCallback(){
        this.innerHTML = ``;
        const type = this.getAttribute('type');
        if(type){
            this.generatePage(type);
        }
    }
}

window.customElements.define('main-container', Main);