const breaking_news = document.querySelector("#breaking_news");
const main_story = document.querySelector('#main_story');
const searchedNews = document.querySelector('#user-search')
const newsSections = document.querySelector('#categories__dropdown');
const form = document.querySelector("#searchField");
const input = document.querySelector('#form-box__input');
const logo = document.querySelector('.nav-bar__title');

const apikey = "09cd5587d3d84d849544b0097b798326"
const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const topHeadlines = `https://newsapi.org/v2/top-headlines?country=gb&apiKey=${apikey}`;
const newsCategories = `https://newsapi.org/v2/sources?country=gb&apiKey=${apikey}`;

function eventListeners() {
  document.querySelector(".fa-bars").addEventListener("click", () => {
    document.querySelector("#categories__dropdown").classList.toggle('user-search')
  })
  document.querySelector(".fa-search").addEventListener("click", () => {
    document.querySelector(".form-container").classList.toggle('active')
  })

  form.addEventListener("submit", userSearch)

  document.querySelector('#close').addEventListener('click', () => {
    document.querySelector('.form-container').classList.toggle('active')
  })

  logo.addEventListener('click', refreshPage)
}

function parseMain(story) {
  const { title, url, urlToImage, description } = story;
  return `
        <div class="article">
          <div class="article__image">
            <img src="${urlToImage ? urlToImage : "No image"}"/>
          </div>
          <div class="article__content">
            <a href="${url}" class="article__title">${title}</a>
            <p class="article__description">${description ? description : "No description"} </p>
          </div>
        </div >`;
}

function parseNews(news) {
  const parsed = news.slice(1).map(feed => {
    const { title, url, urlToImage, description } = feed;
    return `
        <div class="highlights">
          <img src="${urlToImage ? urlToImage : "No image"}" class="highlights__image"/>
          <div class="highlights__content">
            <a href="${url}" class="highlights__title">${title} </a>
            <p class="highlights__description">${description ? description : "No description"}</p>
          </div>
        </div >`}).join("");
  return parsed;
}

function parseCategories(sources) {
  const links = sources.map(source => {
    const { category } = source;
    return `
        <li class="category">${category}</li>
        `}).join("");
  return links;
}

function parseNewsSearch(searched) {
  const parsed = searched.map(search => {
    const { title, url, urlToImage } = search;
    return `
        <div class="highlights">
          <img src="${urlToImage ? urlToImage : "No image"}" class="highlights__image"/>
          <a href="${url}" class="highlights__title">${title} </a>
        </div >`}).join("");
  return parsed;
}

function getLatestNews() {
  fetch(`${proxyUrl}${topHeadlines}`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      main_story.innerHTML = parseMain(data.articles[0])
      breaking_news.innerHTML = parseNews(data.articles);
    });
}

function newsByCategory() {
  fetch(`${proxyUrl}${newsCategories}`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      newsSections.innerHTML = parseCategories(data.sources)
    });
}

function userSearch(e) {
  e.preventDefault();
  const searchContent = input.value;
  const newsByUser = `https://newsapi.org/v2/top-headlines?q=${searchContent}&apiKey=${apikey}`;
  fetch(`${newsByUser}`)
    .then(res => res.json())
    .then(data => searchedNews.innerHTML = parseNewsSearch(data.articles));
  clearArea();
}

function clearArea() {
  document.getElementById('form-box__input').value = "";
}

function refreshPage() {
  location.reload();
}

eventListeners();
getLatestNews();
newsByCategory();

