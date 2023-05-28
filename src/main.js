//Uso de AXIOS
const api = axios.create({
    baseURL : 'https://api.themoviedb.org/3/', //URL que siempre va a repetirse
    headers: { //misma función que en fetch
        'Content-Type': 'application/json; charset=utf-8',
    },
    params: { //query parameters
        'api_key': API_KEY,
    }
});

//Verificar si existe una película como favorito
function isMovieFavorite() {
    const item = JSON.parse(localStorage.getItem("liked_movies"));
    let movie;
    if (item) {
        movie = item;
    }
    else{
        movie = {};
    }
    return movie;
}

//Insertar películas a favoritos
function likedMovies(movie) {
    const listMoviesFavorite = isMovieFavorite();
    if(!listMoviesFavorite[movie.id]){
        listMoviesFavorite[movie.id] = movie;
    }
    else{
        listMoviesFavorite[movie.id]=undefined;
    }
    localStorage.setItem("liked_movies",JSON.stringify(listMoviesFavorite));
}


//Creación de listas de películas
function createListMovies(arrayMovies,container,{clean=true}={}){
    if (clean) {
        container.innerHTML = "";
    }
    //por cada película obtenido se imprimirá su poster
    arrayMovies.forEach(movie => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");
        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt",movie.overview);
        movieImg.addEventListener("click",()=>{//por cada película se redirigirá a la vista de movie
            location.hash="#movie="+movie.id;
        });
        const favoriteButton = document.createElement("button");
        favoriteButton.classList.add("btn-favorite");
        isMovieFavorite()[movie.id] && favoriteButton.classList.toggle('btn-favorite-liked');
        favoriteButton.addEventListener("click",()=>{
            favoriteButton.classList.toggle("btn-favorite-liked"); //quitara o agregará esa clase cuando se seleccione el boton de favorito
            likedMovies(movie);
            getFavoriteMovies();
        })

        if (!movie.poster_path){
            movieContainer.style.display = "none";
        }
        else{
            movieImg.setAttribute("src","https://image.tmdb.org/t/p/w300/" + movie.poster_path);
            movieImg.setAttribute('loading', 'lazy');
            movieContainer.append(movieImg,favoriteButton);
        }
        container.appendChild(movieContainer);
    });
}

//Obtener la lista de películas en tendencia por día
async function getTrendingMoviesPreview() {
    /*const response = await fetch ("https://api.themoviedb.org/3/trending/movie/day?api_key=" + API_KEY);
    const data = await response.json();*/

    //Con axios lo anterior sería:
    const {data} = await api("trending/movie/day"); //{} porque es un objeto

    const moviesTrending = data.results;

    createListMovies(moviesTrending,trendingMoviesPreviewList);
}

//Obtener la lista de categorías
async function getCategoriesMovies() {
    /*const response = await fetch ("https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY);
    const data = await response.json();*/

    //Con axios lo anterior sería:
    const {data} = await api("genre/movie/list"); //{} porque es un objeto

    const categoriesMovies = data.genres;

    createCategoriesByMovie(categoriesMovies,categoriesPreviewList);
}

//Obtener lista de películas por categoría

/*const buttonLoadMoreMovies = document.createElement("button");
buttonLoadMoreMovies.textContent="Cargar más";*/

async function getMoviesByCategory() {
    const {data} = await api("discover/movie",{
        params:{
            with_genres:split2[0]
        }
    });

    const moviesByCategory = data.results;
    createListMovies(moviesByCategory,genericSection);

    maxPages = data.total_pages;
    //Paginación por medio de un botón
    /*genericSection.appendChild(buttonLoadMoreMovies);
    buttonLoadMoreMovies.addEventListener("click",()=>{
        page=page+1;
        getMoreMovies(id,page);
        genericSection.removeChild(buttonLoadMoreMovies);
    });*/

}

let page = 2; //a partir de la página 2

//Obtener más películas
async function getMoreMovies(){
    const {data} = await api("discover/movie",{
        params:{
            with_genres:split2[0],
            page
        }
    });

    const pageIsNotMax = page <= maxPages; //para que no se esceda en páginas el usuario
    //Scroll infinito
    const {scrollTop,clientHeight,scrollHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight-15);
    if (scrollIsBottom && pageIsNotMax) {
        page=page+1;
        const moviesByCategory = data.results;
        createListMovies(moviesByCategory,genericSection,{clean:false});
    }
    //genericSection.appendChild(buttonLoadMoreMovies);
}

//Buscar películas
async function searchMovies() {

    const {data} = await api("search/movie",{
        params:{
            query:valueInputSearch
        }
    });

    const moviesBySearch = data.results;
    createListMovies(moviesBySearch,genericSection);

    maxPages = data.total_pages;
}

//Obtener más películas de búsqueda

async function searchMoreMovies() {

    const {data} = await api("search/movie",{
        params:{
            query:valueInputSearch,
            page
        }
    });

    const pageIsNotMax = page <= maxPages; //para que no se esceda en páginas el usuario

    //Scroll infinito
    const {scrollTop,clientHeight,scrollHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight-15);
    if (scrollIsBottom && pageIsNotMax) {
        page=page+1;
        const moviesByCategory = data.results;
        createListMovies(moviesByCategory,genericSection,{clean:false});
    }
}

//Mostrar las tendencias en la vista de tendencias
async function getTrendingMovies() {
    const {data} = await api("trending/movie/day"); //{} porque es un objeto

    const moviesTrending = data.results;

    headerCategoryTitle.innerHTML = "Tendencias";
    createListMovies(moviesTrending,genericSection);

    maxPages = data.total_pages;
}

//Obtener más tendencias
async function getMoreTrendingMovies(){
    const {data} = await api("trending/movie/day",{
        params:{
            page
        }
    });

    const pageIsNotMax = page <= maxPages; //para que no se esceda en páginas el usuario

    //Scroll infinito
    const {scrollTop,clientHeight,scrollHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight-15);
    if (scrollIsBottom && pageIsNotMax) {
        page=page+1;
        const moviesByCategory = data.results;
        createListMovies(moviesByCategory,genericSection,{clean:false});
    }
}

//Crear la lista de categorías según la película seleccionado
function createCategoriesByMovie(arrayCategories,container) {
    container.innerHTML = "";
    //por cada película obtenido se imprimirá su poster
    arrayCategories.forEach(movie => {
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add("category-container");
        const categoryImg = document.createElement("img");
        categoryImg.setAttribute("src","./sources/" + movie.name + ".png");
        categoryImg.setAttribute('loading', 'lazy');
        const nameCategory = document.createElement("h3");
        nameCategory.classList.add("category-title");
        nameCategory.textContent=movie.name;
        categoryContainer.append(categoryImg,nameCategory);
        categoryContainer.addEventListener("click",()=>{
            location.hash="#category="+movie.id+"-"+movie.name;
        })
        container.appendChild(categoryContainer);
    });
}

//Obtener los datos de una película
async function getMovieById(id) {
    const {data:movie} = await api("movie/"+id); //renombar a data por movie

    movieDetailTitle.innerHTML = movie.title;
    movieDetailDescription.innerHTML = movie.overview;
    movieDetailScore.innerHTML = "⭐"+movie.vote_average.toFixed(2);
    movieDetailImg.innerHTML="";
    const imgMovie = document.createElement("img");
    imgMovie.setAttribute("src","https://image.tmdb.org/t/p/w500/" + movie.poster_path);
    imgMovie.setAttribute('loading', 'lazy');
    movieDetailImg.appendChild(imgMovie);
    headerSection.style.cssText = `background-image: url(https://image.tmdb.org/t/p/w500/${movie.backdrop_path}); height: 500px;`;
    createCategoriesByMovie(movie.genres,movieDetailCategoriesList);
    createSimilarMovies(id);
}

async function createSimilarMovies(id) {
    const {data} = await api("movie/"+id+"/similar");
    const similarMovies = data.results;
    createListMovies(similarMovies,relatedMoviesContainer);
}

headerHome.addEventListener("click",()=>{
    location.hash = "home";
})

//Insertar películas en la lista de favoritos
function getFavoriteMovies() {
    const moviesLiked = isMovieFavorite();
    const arrayMovies = Object.values(moviesLiked);

    createListMovies(arrayMovies,favoriteMoviesContainer);
}