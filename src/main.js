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
        if (!movie.poster_path){
            movieContainer.style.display = "none";
        }
        else{
            movieImg.setAttribute("src","https://image.tmdb.org/t/p/w300/" + movie.poster_path);
            movieImg.setAttribute('loading', 'lazy');
            movieContainer.appendChild(movieImg);
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

const buttonLoadMoreMovies = document.createElement("button");
buttonLoadMoreMovies.textContent="Cargar más";

async function getMoviesByCategory(id) {

    const {data} = await api("discover/movie",{
        params:{
            with_genres:id
        }
    });

    const moviesByCategory = data.results;
    createListMovies(moviesByCategory,genericSection);

    //Paginación por medio de un botón
    let page = 1;
    genericSection.appendChild(buttonLoadMoreMovies);
    buttonLoadMoreMovies.addEventListener("click",()=>{
        page=page+1;
        getMoreMovies(id,page);
        genericSection.removeChild(buttonLoadMoreMovies);
    });
}

//Obtener más películas
async function getMoreMovies(id,page){
    const {data} = await api("discover/movie",{
        params:{
            with_genres:id,
            page
        }
    });

    const moviesByCategory = data.results;
    createListMovies(moviesByCategory,genericSection,{clean:false});
    genericSection.appendChild(buttonLoadMoreMovies);
}

//Buscar películas
async function searchMovies(value) {

    const {data} = await api("search/movie",{
        params:{
            query:value
        }
    });

    const moviesBySearch = data.results;
    createListMovies(moviesBySearch,genericSection);
}

//Mostrar las tendencias en la vista de tendencias
async function getTrendingMovies() {
    const {data} = await api("trending/movie/day"); //{} porque es un objeto

    const moviesTrending = data.results;

    headerCategoryTitle.innerHTML = "Tendencias";
    createListMovies(moviesTrending,genericSection);
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