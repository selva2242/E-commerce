const productCardTemplate = document.createElement('template');
productCardTemplate.innerHTML = `
    <style>
        .card-container {
            display: flex;
            flex-direction : column;
            align-items : center;
            height: 250px;
            width : 200px;
            margin: 20px;
            background: #eff3f6;
            border-radius : 10px;
            border: 2px solid #eff3f6;

        }
        .product-img {
            margin-top : 10px;
            margin-bottom : 10px;
            width : 150px;
            height : 150px;
            border-radius : 5px;
        }
        #view-product-details-button{
            cursor : pointer;
        }
        #product-info{
            display : none;
        }
        #product-name{
            padding-top : 10px;
            padding-bottom : 10px;
        }
    </style> 
    <div class='card-container'>
        <div id='product-name'>  </div>
        <img src='https://picsum.photos/id/1/200/300' class='product-img'></img>
        <button id='view-product-details-button'> View Cost </button>
        <div id='product-info'>
            <div id='product-cost'>  </div>  
        </div>
    </div>
`

export default class ProductCard extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode : 'open'});
        this.showProductInfo = false;
    }

    toggleView(){
        this.showProductInfo = !this.showProductInfo;
        const productInfo = this.shadowRoot.querySelector('#product-info');
        const button      = this.shadowRoot.querySelector('#view-product-details-button');

        if(this.showProductInfo){
            productInfo.style.display = 'block';
            button.innerText = 'Hide Cost';
        }
        else{
            productInfo.style.display = 'none';
            button.innerText = 'View Cost';
        }
    }

    connectedCallback(){
      this.shadowRoot.appendChild(productCardTemplate.content.cloneNode(true));
      this.shadowRoot.querySelector('#view-product-details-button')
      ?.addEventListener('click', () => this.toggleView());
      this.shadowRoot.querySelector('#product-name').innerText = this.getAttribute('name');
      this.shadowRoot.querySelector('#product-cost').innerText = this.getAttribute('cost');
      this.shadowRoot.querySelector('.product-img').setAttribute('src', `https://picsum.photos/id/${this.getAttribute('id')}/200/300`);

    }

    disconnectedCallback(){
        this.shadowRoot.querySelector('#view-product-details-button')?.removeEventListener('click', () => this.toggleView());
    }

}

window.customElements.define('product-card', ProductCard)
