import { base_url  } from "../../../config";

const womenTemplate = document.createElement('template');
womenTemplate.innerHTML = `
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
       #available-product-count{
            font-size : 18px;
            font-weight : 500;
            margin-left : 20px;
       }
       .sidebar-container {
            position : fixed;
            width : 150px;
            left : 0;
            height : 100%;
            border-right: 2px solid #eff3f6;
            background: #f5f8fa;
            padding : 20px;
        }
        .sort_by{
            padding : 10px 0;
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
        #available-product-count{
            padding-top : 20px
        }
    </style>
    <div class = 'main-container'>
        <div class = 'side-bar' >
            <div class = 'sidebar-container'>
                <span id="section-title" ></span>
                <div class='sort_by'>
                    <h4> Sort By </h4>
                    <select name='sort_by' id='sort_by_select'>
                        <option name='recommended'>Recommended</option>
                        <option name='popular'>Popular</option>
                        <option name='price_low_to_high'>Price Low to High</option>
                    </select>
                </div>    
                <div class = 'product_category'>
                    <h4> Category </h4>
                    <form id='category-form'>
                        
                    </form>
                    
                </div>   
            </div>
        </div>
        <div class = 'products-container'>
            <div id='available-product-count'>
                    
            </div>
            <div class = 'products-sub-container'>
            </div>
        </div>
    <div>
`;

const radioButtonTemplate = document.createElement('template');
radioButtonTemplate.innerHTML = `
    <input type='radio' name='product_category' value='all'>
    <label for='all'>All</label>
    <br>
`
export default class Women extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode : 'open'})
        this.products = []
        this.categories = []
        this.type = 'women';
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

    // Fetching products
    async getCategories(){
        try{
            const response = await fetch(`${base_url}/${this.type}/products/categories`)
            const json = await response?.json()
            this.categories = json?.categories;
            this.displayCategories();
        }catch(err){
                console.log('Error Fetching the Categories', err)
        }
    }

    displayCategories(){
        
        // creating radio buttons based on categories  
        this.categories.forEach(category => {
            const categoryNode = this.shadowRoot.querySelector('#category-form');
            let clone = radioButtonTemplate.content.cloneNode(true);
            clone.querySelector('input').setAttribute( 'value', category.toLowerCase());
            clone.querySelector('label').innerText = category;
            categoryNode.appendChild(clone);  
        })

        // adding event listener to radio buttons
        this.shadowRoot.querySelectorAll("input[name='product_category']").forEach((option) => {
            option.addEventListener('change', () => this.handleCategoryChange(option));
        });
    }
    
    // Handling the category option change
    handleCategoryChange(option){
        if(this.category != option.value){
            this.category = option.value;
            this.getProducts();
        }
    }

    //hanlde sort by option change
    handleSortByOptionChange(option){
        if(this.sort_by != option){
            this.sort_by = option.toLowerCase().replaceAll(" ", "_");
            this.getProducts();
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
        this.shadowRoot.querySelector('#available-product-count').innerText = `Available Products : ${this.products.length}`
    }

    connectedCallback(){
        this.shadowRoot.appendChild(womenTemplate.content.cloneNode(true));
        this.shadowRoot.querySelector('#section-title').innerText = `${this.type.toUpperCase()} ZONE`
        const sortbyDropdown = this.shadowRoot.querySelector('#sort_by_select')
        sortbyDropdown.addEventListener('change', ()=>this.handleSortByOptionChange(sortbyDropdown.value))        
        this.getCategories();
        this.getProducts();
    }

    disconnectedCallback(){
        // removing eventlistners to the radio buttons
        this.shadowRoot.querySelectorAll("input[name='product_category']").forEach((option) => {
            option.removeEventListener('change', () => this.handleCategoryChange(option));
        });
        const sortbyDropdown = this.shadowRoot.querySelector('#sort_by_select')
        sortbyDropdown.addEventListener('change', ()=>this.handleSortByOptionChange(sortbyDropdown.value))
    }
}

window.customElements.define('women-section', Women);