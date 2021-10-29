const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `
    <style>
        .header {
            display: flex;
            align-items : center;
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
            padding-right : 25px;
        }
    </style>
    <div class='header'>
        <span class='header-title'> </span>
        <div class='header-types-container'> 
        </div>
    </div>
`;

const typeTemplate = document.createElement('template');
typeTemplate.innerHTML = `
    <style>
        .header-types-title{
            padding : 0px 25px;
            font-size : 1.5rem;
            cursor : pointer;
        }
    </style>
    <span class='header-types-title'>  </span>
`

export default class Header extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode : 'open'})
        this.pageTypes = [ "Men", "Women", "Kid"]
    }

    connectedCallback(){
        this.shadowRoot.appendChild(headerTemplate.content.cloneNode(true));
        this.shadowRoot.querySelector(".header-title").innerText = this.getAttribute("title");
        // adding pages in the header bar
        const typesContainer = this.shadowRoot.querySelector('.header-types-container');
        this.pageTypes.forEach(pageType => {
            const typeTemplateClone = typeTemplate.content.cloneNode(true);
            const titleSpan = typeTemplateClone.querySelector('.header-types-title')
            titleSpan.innerHTML = pageType;
            titleSpan.addEventListener('click', ()=>this.changeType(pageType));
            typesContainer.appendChild(typeTemplateClone);
        })
    }

    disconnectedCallback(){
        // removing event listeners for page change
        this.shadowRoot.querySelectorAll(".header-types-title").forEach( titleElement => {
            titleElement.removeEventListener('click', ()=>this.changeType(pageType));
        })
    }

    changeType(pageType){
        // Setting active page
        try{
            this.shadowRoot.querySelectorAll(".header-types-title").forEach( titleElement => {
                if(titleElement.innerText == pageType){
                    titleElement.setAttribute("style", "color: blue;");
                }
                else{
                    titleElement.setAttribute("style", "color: black;");
                }
            })
            const mainContainer = document.querySelector("main-container");
            if(pageType.toLowerCase() != mainContainer.getAttribute("type")){
                mainContainer.setAttribute("type", pageType.toLowerCase())
            }
        }catch(err){
            console.log("Unable to swich page", err)
        }
        
    }
}

window.customElements.define('app-header', Header);