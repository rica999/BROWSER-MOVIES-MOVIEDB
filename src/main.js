//Uso de AXIOS
const api = axios.create({
    baseURL : 'https://api.themoviedb.org/3/', //URL que siempre va a repetirse
    headers: { //misma función que en fetch
        'Content-Type': 'application/json; charset=utf-8',
    },
    params: { //query parameters
        'api_key': API_KEY,
    },
});

//Obtener la lista de películas en tendencia por día
async function getTrendingMovies() {
    /*const response = await fetch ("https://api.themoviedb.org/3/trending/movie/day?api_key=" + API_KEY);
    const data = await response.json();*/

    //Con axios lo anterior sería:
    const {data} = await api("trending/movie/day"); //{} porque es un objeto

    const moviesTrending = data.results;
    //por cada película obtenido se imprimirá su poster
    moviesTrending.forEach(movie => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");
        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt",movie.overview);
        movieImg.setAttribute("src","https://image.tmdb.org/t/p/w300" + movie.poster_path);
        movieContainer.appendChild(movieImg);
        trendingMoviesPreviewList.appendChild(movieContainer);
    });
}

//Obtener la lista de categorías
async function getCategoriesMovies() {
    /*const response = await fetch ("https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY);
    const data = await response.json();*/

    //Con axios lo anterior sería:
    const {data} = await api("genre/movie/list"); //{} porque es un objeto

    const categoriesMovies = data.genres;
    //por cada categoría obtenida se imprimirá su nombre
    categoriesMovies.forEach(category => {
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add("category-container");
        const categoryImg = document.createElement("img");
        categoryImg.setAttribute("src","./sources/" + category.name + ".png");
        const categoryName = document.createElement("h3");
        categoryName.classList.add("category-title");
        categoryName.textContent = category.name;
        categoryContainer.append(categoryImg,categoryName);
        categoriesPreviewList.appendChild(categoryContainer);
    });
}