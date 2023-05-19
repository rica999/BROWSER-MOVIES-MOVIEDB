window.addEventListener('DOMContentLoaded', navigator, false); //false es por el modo bubble (captura el evento desde el interior de la función hacia el exterior)
window.addEventListener('hashchange', navigator, false);

searchFormBtn.addEventListener("click",()=>{
    location.hash = "#search=";
});

trendingBtn.addEventListener("click",()=>{
    location.hash = "#trends=";
});

arrowBtn.addEventListener("click",()=>{
    location.hash = "#home";
});

function navigator() {
    if (location.hash.startsWith("#trends")) { //propiedad de los strings que indica si empieza con el argumento
        trendsPage();
    } else if (location.hash.startsWith("#search=")) {
        searchPage();
    }
    else if (location.hash.startsWith("#movie=")) {
        movieDetailsPage();
    }
    else if (location.hash.startsWith("#category=")) {
        categoriesPage();
    }
    else {
        homePage();
    }
}

function homePage() {
    console.log("Home!!");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.add("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerName.classList.remove("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.remove("inactive");
    relatedMovies.classList.add("inactive");
    trendingPreviewSection.classList.remove("inactive");
    categoriesPreviewSection.classList.remove("inactive");
    genericSection.classList.add("inactive");
    movieDetailSection.classList.add("inactive");

    const childrenCategoriesPreview = Array.from(categoriesPreviewList.children);
    if(!childrenCategoriesPreview.length){ //para evitar volver a llamar a la API se evalua si existen nodos hijos en la seccion de categorias, en este caso si no tiene es porque es la primera carga y si llamará a la API
        getTrendingMovies(); //solo cargará cuando se encuentre en este hash
        getCategoriesMovies();
    }
}

function categoriesPage() {
    console.log("Categories!!");
    window.scroll(0,0); //para que al iniciar en una vista diferente, esta se posicione en la esquina superior izquierda

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerName.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");

    //Obtener el id de la categoría //Ejemplo: http://127.0.0.1:5500/index.html#category=12-Adventure
    const split1 = location.hash.split("=");
    console.log(location.hash.split("=")); // ['#category', '12-Adventure']
    const split2 = split1[1].split("-");
    console.log(split1[1].split("-")); // ['12', 'Adventure']

    getMoviesByCategory(split2[0]);
}

function movieDetailsPage() {
    console.log("Movie!!");

    headerSection.classList.remove("header-container--long");
    //headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.add("header-arrow--white");
    headerName.classList.add("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.add("inactive");
    movieDetailSection.classList.remove("inactive");
}

function searchPage() {
    console.log("Search!!");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerName.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.remove("inactive");

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");
}

function trendsPage() {
    console.log("TRENDS!!");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerName.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");
}