import MenPage from "./pages/menpage";
import WomenPage from "./pages/womenpage";
import KidPage from "./pages/kidpage";

export default class PageFactory{
    
    createPage(type){
        switch(type){
            case "men" : 
                return new MenPage();
            case "women" :
                return new WomenPage();
            case "kid" : 
                return new KidPage();
        }
    }
}

