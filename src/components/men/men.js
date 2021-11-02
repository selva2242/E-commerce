import { base_url  } from "../../../config";
import { publishSubscribe } from "../../publishSubscribe";

const menTemplate = document.createElement('template');
menTemplate.innerHTML = `
    <style>
       .main-container{
           margin-top : 80px;
           height : 100vh;
           width : 100vw;
           background-color : #fff;
       }
       .products-container{
           margin-left : 200px;
       }
       .products-sub-container{
           display : flex;
           flex-wrap : wrap;
           overflow : auto;
       }
        #product-search{
            margin-top : 20px;
            cursor : pointer;
        }
        #section-categories{
            display : flex;
            justify-content : space-evenly;
            padding : 10px
        }
        #section-title{
            font-size: 20px;
            font-weight: 700;
        }
        .products-header{
            position : fixed;
            width : 100%
        }
        #products-info-bar{
            padding : 30px 0px;
            display : flex;
            justify-content : space-evenly;
        }
        .product-info-title{
            font-size : 18px;
            font-weight : 500;
            color : #4040a1;
        }
    </style>
    <div>
        <div class = 'side-bar' >
            <side-bar> </side-bar>
        </div>
        <div class = 'products-container'>
            <div id = 'products-info-bar'>   
                <div class = "product-info-title" id='available-product-count'>
                </div> 
                <div class = "product-info-title" id='current-category'>
                </div>  
                <div class = "product-info-title" id='current-sort-by'>
                </div> 
            </div>
            <div class = 'products-sub-container'>
            </div>
        </div>
    <div>
`;


export default class Men extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode : 'open'})
        this.products = []
        this.type = 'men';
        this.category = 'all';
        this.sort_by = 'recommended';
    }

    // Fetching Products
    async getProducts(){
        try{
            
            const response = await fetch(`${base_url}/${this.type}/products/${this.category}/${this.sort_by}`)
            const json = await response?.json()
            this.products = json?.products;
            this.displayProducts();
        }catch(err){
                console.log('Error Fetching the Products', err)
        }       
    }

    // Cards for all products
    displayProducts(){
        this.shadowRoot.querySelector('.products-sub-container').innerHTML = ``;
        this.products?.forEach(product => {
            const productCard = document.createElement('product-card');
            productCard.setAttribute('cost', product.cost);
            productCard.setAttribute('name', product.name);
            productCard.setAttribute('id', product.id)
            this.shadowRoot.querySelector('.products-sub-container')?.appendChild(productCard);       
       })
        this.shadowRoot.querySelector('#available-product-count').innerText = `AVAILABLE : ${this.products.length}`
        this.shadowRoot.querySelector('#current-category').innerText = `CATEGORY : ${this.category.charAt(0).toUpperCase() + this.category.slice(1)}`
        this.shadowRoot.querySelector('#current-sort-by').innerText = `SORT BY : ${this.sort_by.charAt(0).toUpperCase() + this.sort_by.slice(1)}`

    }

    handleCategoryChange(data){
        if(data && data.category && this.category!==data.category){
            this.category = data.category
            this.getProducts()
        }
    }

    handleSortByChange(data){
        if(data && data.sort_by && this.sort_by!==data.sort_by){
            this.sort_by = data.sort_by
            this.getProducts()
        }
    }

    connectedCallback(){
        this.shadowRoot.appendChild(menTemplate.content.cloneNode(true));
        this.shadowRoot.querySelector('side-bar').setAttribute("type", this.type)
        // subscribing to the publish subscribe 
        publishSubscribe.subscribe('categoryChange', (data) => this.handleCategoryChange(data))
        publishSubscribe.subscribe('sortByChange', (data) => this.handleSortByChange(data))
        this.getProducts();
    }

    disconnectedCallback(){
        // unsubscribing to the publish subscribe 
        publishSubscribe.unsubscribe('categoryChange', (data) => this.handleCategoryChange(data))
        publishSubscribe.unsubscribe('sortByChange', (data) => this.handleSortByChange(data))
    }
}

window.customElements.define('men-section', Men);