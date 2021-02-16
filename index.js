const breaking_news = document.querySelector("#breaking_news");
const main_story = document.querySelector('#main_story');
const searchedNews = document.querySelector('#user-search')
const newsSections = document.querySelector('#categories__dropdown');
const form = document.querySelector("#searchField");
const input = document.querySelector('#form-box__input');
const logo = document.querySelector('.nav-bar__title');
const apikey = config.API_KEY

const topHeadlines = `https://content.guardianapis.com/search?api-key=${apikey}&show-fields=thumbnail`;
const newsCategories = `http://content.guardianapis.com/editions?q=uk&api-key=${apikey}`

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
  const { webTitle, sectionName, fields, webUrl } = story;
  return `
        <div class="article">
        <div class="article__image">
        <p class="article__title">${sectionName}</p>
        <img src="${fields.thumbnail ? fields.thumbnail : "No image"}"/>
      </div>
          <div class="article__content">
            <a href="${webUrl}" class="article__title">${webTitle}</a>
            <p class="article__description">${webTitle ? webTitle : "No description"} </p>
          </div>
      </div >`;
}

function parseNews(news) {
  const parsed = news.slice(1).map(feed => {
    const { webTitle, webUrl, fields, sectionName } = feed;
    return `
        <div class="highlights">
          <img src="${fields.thumbnail ? fields.thumbnail : "No image"}" class="highlights__image"/>
          <div class="highlights__content">
            <a href="${webUrl}" class="highlights__title">${webTitle} </a>
            <p class="highlights__description">${sectionName}</p>
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
    console.log("parsed ", searched)
    const { webTitle, webUrl, fields } = search;
    return `
        <div class="highlights">
          <img src="${fields.thumbnail ? fields.thumbnail : "No image"}" class="highlights__image"/>
          <a href="${webUrl}" class="highlights__title">${webTitle} </a>
        </div >`}).join("");
  return parsed;
}

function getLatestNews() {
  fetch(`${topHeadlines}`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      main_story.innerHTML = parseMain(data.response.results[0])
      breaking_news.innerHTML = parseNews(data.response.results);
    });
}

function newsByCategory() {
  fetch(`${newsCategories}`)
    .then(res => {
      return res.json()
    })
    .then(data => {

      newsSections.innerHTML = parseCategories(data.response.results)
    });
}

function userSearch(e) {
  e.preventDefault();
  const searchContent = input.value;
  console.log("search content ", searchContent)
  const newsByUser = `https://content.guardianapis.com/search?q=${searchContent}&order-by=relevance&api-key=93a5184c-0048-49b2-8f1c-202174fd3523&show-fields=thumbnail`

  fetch(`${newsByUser}`)
    .then(res => res.json())
    .then(data => searchedNews.innerHTML = parseNewsSearch(data.response.results));

  clearArea();
  toggleContent();
}

function clearArea() {
  document.getElementById('form-box__input').value = "";
}

function refreshPage() {
  location.reload();
}

function toggleContent() {
  document.getElementById('main_story').style.display = 'none',
    document.getElementById('breaking_news').style.display = 'none'
}
eventListeners();
getLatestNews();
newsByCategory();

