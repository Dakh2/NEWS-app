const apiKey = 'ed569a1631d742b1beb54722c2755d78'; 
let currentPage = 1;
let totalResults = 0;

const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const countryFilter = document.getElementById('country-filter');
const categoryFilter = document.getElementById('category-filter');
const newsContainer = document.getElementById('news-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentPageDisplay = document.getElementById('current-page');

async function fetchNews(query = '', country = 'us', category = '', page = 1) {
    const pageSize = 10;
    const url = `https://newsapi.org/v2/top-headlines?q=${query}&country=${country}&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
    
    console.log("Fetching news with URL: ", url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.status === "ok") {
            totalResults = data.totalResults;
            displayNews(data.articles);
            updatePagination(page);
        } else {
            console.error("Error fetching news: ", data.message);
            newsContainer.innerHTML = `<p>No news found. Please try again later.</p>`;
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = `<p>There was an error fetching news. Please check your internet connection or try again later.</p>`;
    }
}


function displayNews(articles) {
    newsContainer.innerHTML = ''; 
    if (articles.length === 0) {
        newsContainer.innerHTML = "<p>No articles found for this search.</p>";
    } else {
        articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('news-item');
            articleElement.innerHTML = `
                <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                <p>${article.description || "Description not available"}</p>
                <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}" />
                <p><strong>Published on:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>
            `;
            newsContainer.appendChild(articleElement);
        });
    }
}

function updatePagination(currentPage) {
    const totalPages = Math.ceil(totalResults / 10);
    const pageNumbersContainer = document.getElementById("page-numbers");
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    pageNumbersContainer.innerHTML = "";
    const maxVisiblePages = 5;
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(currentPage + 2, totalPages);

    if (currentPage <= 2) {
        endPage = Math.min(maxVisiblePages, totalPages);
    } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(totalPages - (maxVisiblePages - 1), 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("div");
        pageButton.textContent = i;
        pageButton.className = "page-number" + (i === currentPage ? " active" : "");
        pageButton.addEventListener("click", () => {
            currentPage = i;
            fetchNews(searchBar.value, countryFilter.value, categoryFilter.value, currentPage);
        });
        pageNumbersContainer.appendChild(pageButton);
    }
}


searchBtn.addEventListener('click', () => {
    currentPage = 1;
    fetchNews(searchBar.value, countryFilter.value, categoryFilter.value, currentPage);
});

searchBar.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        currentPage = 1;
        fetchNews(searchBar.value, countryFilter.value, categoryFilter.value, currentPage);
    }
});

countryFilter.addEventListener('change', () => {
    currentPage = 1;
    fetchNews(searchBar.value, countryFilter.value, categoryFilter.value, currentPage);
});

categoryFilter.addEventListener('change', () => {
    currentPage = 1;
    fetchNews(searchBar.value, countryFilter.value, categoryFilter.value, currentPage);
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchNews(searchBar.value, countryFilter.value, categoryFilter.value, currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(totalResults / 10);
    if (currentPage < totalPages) {
        currentPage++;
        fetchNews(searchBar.value, countryFilter.value, categoryFilter.value, currentPage);
    }
});

fetchNews('', 'us', '', currentPage);