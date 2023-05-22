window.addEventListener('DOMContentLoaded', navigator, false); //false es por el modo bubble (captura el evento desde el interior de la función hacia el exterior)
window.addEventListener('hashchange', navigator, false);

searchFormBtn.addEventListener("click",(e)=>{
    const inputValueTrim = searchFormInput.value.replaceAll(" ",""); //elimnar espacios
    location.hash = "#search="+inputValueTrim; //para buscar según el valor del input
    e.preventDefault();
});

trendingBtn.addEventListener("click",()=>{
    location.hash = "#trends=";
});

arrowBtn.addEventListener("click",()=>{
    location.hash = window.history.back(); //para guardar las URL que visita el usuario se usa window.history y par regresar al anterior el método back()
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
    window.scrollTo({top:0});

    headerSection.style.cssText = 'background-image: url("../sources/banner-header.png"); height: 500px;';
    headerContainerIcons.classList.add("inactive");
    headerTitleBanner.classList.remove("inactive");
    arrowBtn.classList.add("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    searchFormInput.placeholder = "Inserte un nombre";
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
        getTrendingMoviesPreview(); //solo cargará cuando se encuentre en este hash
        getCategoriesMovies();
    }
}

function categoriesPage() {
    console.log("Categories!!");
    window.scrollTo({top:0});//para que al iniciar en una vista diferente, esta se posicione en la esquina superior izquierda

    headerSection.style.cssText = 'background-image: none; height: 80px;';
    headerContainerIcons.classList.remove("inactive");
    headerTitleBanner.classList.add("inactive");
    headerHome.classList.remove("inactive");
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerName.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add("inactive");
    relatedMovies.classList.add("inactive");
    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");

    //Obtener el id de la categoría //Ejemplo: http://127.0.0.1:5500/index.html#category=12-Adventure
    const split1 = location.hash.split("=");
    console.log(location.hash.split("=")); // ['#category', '12-Adventure']
    const split2 = split1[1].split("-");
    console.log(split1[1].split("-")); // ['12', 'Adventure']

    headerCategoryTitle.innerHTML = split2[1].replaceAll("%20"," ");
    getMoviesByCategory(split2[0]);
}

function movieDetailsPage() {
    console.log("Movie!!");
    window.scrollTo({top:0});

    headerTitleBanner.classList.add("inactive");
    headerContainerIcons.classList.remove("inactive");
    headerHome.classList.remove("inactive");
    relatedMovies.classList.remove("inactive");
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.add("header-arrow--white");
    headerName.classList.add("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.add("inactive");
    relatedMovies.classList.remove("inactive");
    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.add("inactive");
    movieDetailSection.classList.remove("inactive");

    const [_,idMovie] = location.hash.split("=");

    getMovieById(idMovie);
}

function searchPage() {
    console.log("Search!!");
    window.scrollTo({top:0});

    headerSection.style.cssText = 'background-image: none; height: 200px;';
    headerContainerIcons.classList.remove("inactive");
    headerHome.classList.remove("inactive");
    headerTitleBanner.classList.add("inactive");
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerName.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    headerCategoryTitle.style.cssText = 'margin-top: 32px;';
    searchForm.classList.remove("inactive");
    relatedMovies.classList.add("inactive");
    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");

    //Obtener el value del input de búsqueda //Ejemplo: http://127.0.0.1:5500/index.html#saearch=Pokemon
    const [_,valueInput] = location.hash.split("=");
    searchMovies(valueInput);
    headerCategoryTitle.innerHTML = "Resultados para: "+valueInput;
}

function trendsPage() {
    console.log("TRENDS!!");
    window.scrollTo({top:0});

    headerSection.style.cssText = 'background-image: none; height: 80px;';
    headerContainerIcons.classList.remove("inactive");
    headerHome.classList.remove("inactive");
    headerTitleBanner.classList.add("inactive");
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerName.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add("inactive");
    relatedMovies.classList.add("inactive");
    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");

    getTrendingMovies();
}