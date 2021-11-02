import { base_url } from "../../../config";
import { publishSubscribe } from "../../publishSubscribe";

const sidebarTemplate = document.createElement('template');
sidebarTemplate.innerHTML = `
    <style>
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
        #section-title{
            font-size: 20px;
            font-weight: 700;
        }
    </style>
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
`

const radioButtonTemplate = document.createElement('template');
radioButtonTemplate.innerHTML = `
    <input type='radio' name='product_category' value='all'>
    <label for='all'>All</label>
    <br>
`

export default class Sidebar extends HTMLElement{

    constructor(){
        super();
        this.attachShadow({mode : 'open'})
        this.type = "",
        this.category = "all",
        this.sort_by = "recommended",
        this.categories = []
    }

    static get observedAttributes() {
        return ['type'];
    }

    //hanlde sort by option change
    handleSortByOptionChange(option){
        if(this.sort_by != option){
            this.sort_by = option.toLowerCase().replaceAll(" ", "_");
            // publishing sort by change 
            publishSubscribe.publish('sortByChange', {
                "sort_by" : this.sort_by
            })
        }
    }

    // Handling the category option change
    handleCategoryChange(option){
        if(this.category != option.value){
            this.category = option.value;
             // publishing sort by change 
             publishSubscribe.publish('categoryChange', {
                "category" : this.category
            })
        }
    }

    // Fetching categories
    async getCategories(){
        let categories = []
        try{
            const response = await fetch(`${base_url}/${this.type}/products/categories`)
            const json = await response?.json()
            categories = json?.categories;
        }catch(err){
                console.log('Error Fetching the Categories', err)
        }
        return categories || [];
    }

    // get categories and creating them as radio buttons 
    async updateCategories(){
        this.categories = await this.getCategories();
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

    connectedCallback(){
        this.shadowRoot.appendChild(sidebarTemplate.content.cloneNode(true));
        const sortbyDropdown = this.shadowRoot.querySelector('#sort_by_select')
        sortbyDropdown.addEventListener('change', ()=>this.handleSortByOptionChange(sortbyDropdown.value))        
    }

    attributeChangedCallback(name, oldvalue, newvalue){
        // for attribute "type" changed
        if(name === "type"){
            this.type = this.getAttribute("type")
            this.shadowRoot.querySelector('#section-title').innerText = `${this.type.toUpperCase()} ZONE`
            this.updateCategories()
        } 
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

window.customElements.define('side-bar', Sidebar)