const breaking_news = document.querySelector("#breaking_news");
const main_story = document.querySelector('#main_story');
const newsSections = document.querySelector('#categories__dropdown')

document.querySelector(".fa-bars").addEventListener("click", () => {
  document.querySelector("#categories__dropdown").classList.toggle('active')
})

document.querySelector(".fa-search").addEventListener("click", () => {
  document.querySelector(".form-container").classList.toggle('active')
})

const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const topHeadlines = "https://newsapi.org/v2/top-headlines?country=gb&apiKey=09cd5587d3d84d849544b0097b798326";
const newsCategories = "https://newsapi.org/v2/sources?country=gb&apiKey=09cd5587d3d84d849544b0097b798326";

function handleSubmit(e) {
  event.preventDefault()
  const userInput = document.querySelector(".inputValue").value;
  console.log("userText", userInput);
  return userInput;
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
    const { title, url, urlToImage } = feed;
    return `
        <div class="highlights">
          <img src="${urlToImage ? urlToImage : "No image"}" class="highlights__image"/>
          <a href="${url}" class="highlights__title">${title} </a>
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

getLatestNews();
newsByCategory();
