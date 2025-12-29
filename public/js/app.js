/**
 * Logika Frontend - THE READING SOUNDTRACK
 */
const API_BASE_URL = '/api';

const state = {
    page: 1,
    search: '',
    genre: '',
    topRated: false,
    selectedId: null
};

const dom = {
    bookGrid: document.getElementById('bookGrid'),
    catalogView: document.getElementById('catalogView'),
    detailView: document.getElementById('detailView'),
    globalBackBtn: document.getElementById('globalBackBtn'),
    loader: document.getElementById('loader'),
    searchBox: document.querySelector('.search-box'),
    genreSelect: document.getElementById('genreSelect'),
    topRatedToggle: document.querySelector('.top-rated-toggle'),
    pagination: document.querySelector('.pagination')
};

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi state history awal
    if (!history.state) {
        history.replaceState({ view: 'catalog' }, 'Catalog', '');
    }
    loadBooks();

    dom.bookGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.book-item');
        if (card) {
            const bookId = card.getAttribute('data-id');
            if (bookId) {
                openBookDetail(bookId);
            }
        }
    });
});

// Listener untuk Tombol Back Bawaan Browser
window.onpopstate = function(event) {
    if (event.state && event.state.view === 'catalog') {
        showCatalogUI();
    } else if (event.state && event.state.view === 'detail') {
        openBookDetail(event.state.id, false); // false agar tidak pushState lagi
    }
};

async function loadBooks() {
    showLoader("Fetching books...");
    try {
        const params = new URLSearchParams({
            name: state.search,
            page: state.page,
            genre: state.genre
        });

        if (state.topRated) {
            params.append('top_rated', 'true');
        }

        const res = await fetch(`${API_BASE_URL}/search-books?${params.toString()}`);
        const contentType = res.headers.get('content-type');
        
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned HTML instead of JSON. Check Vercel logs.');
        }
        
        const result = await res.json();
        
        if (result.success) {
            renderCatalog(result.data);
            document.getElementById('pageLabel').textContent = `Page ${state.page}`;
        }
    } catch (err) {
        console.error("Gagal load buku:", err);
    } finally {
        hideLoader();
    }
}

function renderCatalog(books) {
    if (!books || books.length === 0) {
        dom.bookGrid.innerHTML = '<p style="color:white; grid-column: 1/-1; text-align:center;">No books found.</p>';
        return;
    }

    dom.bookGrid.innerHTML = books.map(book => `
        <div class="book-item" data-id="${book.id}" style="cursor:pointer">
            ${book.rating > 4.5 ? '<div class="badge-top">⭐ Top Rated</div>' : ''}
            <div class="book-cover-placeholder"><span>📖</span></div>
            <h4 class="book-item-title">${book.title}</h4>
            <p class="book-item-author">by ${book.author}</p>
            <p style="font-size: 11px; color: var(--primary); margin: 4px 0;">${book.genre || ''}</p>
            <div class="book-item-rating">⭐ ${book.rating ? Number(book.rating).toFixed(2) : '0.00'}</div>
        </div>
    `).join('');
}

async function openBookDetail(id, pushHistory = true) { 
    state.selectedId = id;
    showLoader("Loading book details...");
    try {
        const res = await fetch(`${API_BASE_URL}/search-book/${id}`);
        const result = await res.json();

        if (!result.success) throw new Error(result.error);
        const book = result.data;

        // Fill UI
        document.getElementById('detTitle').textContent = book.title;
        document.getElementById('detAuthor').textContent = book.author;
        document.getElementById('detGenre').textContent = book.genre || 'N/A';
        document.getElementById('detRating').textContent = `(${Number(book.rating).toFixed(2)})`;
        document.getElementById('detLang').textContent = book.language;
        document.getElementById('detYear').textContent = book.pub_year;
        document.getElementById('detPages').textContent = book.page_count;
        document.getElementById('detAge').textContent = book.age_category;
        document.getElementById('detDesc').textContent = book.description;
        
        const tagsHtml = (book.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
        document.getElementById('detTags').innerHTML = tagsHtml;
        document.getElementById('aiReasoning').textContent = "Click the button to let Gemini AI analyze the atmosphere...";
        document.getElementById('trackList').innerHTML = "";

        // Browser History Logic
        if (pushHistory) {
            history.pushState({ view: 'detail', id: id }, book.title, `#book-${id}`);
        }

        // Tampilkan View Detail
        dom.catalogView.classList.add('hidden');
        dom.detailView.classList.remove('hidden');
        dom.pagination.classList.add('hidden');
        dom.searchBox.style.display = 'none';
        dom.genreSelect.style.display = 'none';
        dom.topRatedToggle.style.display = 'none';
        dom.globalBackBtn.classList.remove('hidden');
        dom.globalBackBtn.style.display = 'block';

        window.scrollTo(0, 0); 
    } catch (err) {
        console.error('Error:', err);
        alert("Failed to load details");
    } finally {
        hideLoader();
    }
}

// Fungsi Pusat untuk Kembali ke Katalog
function showCatalogUI() {
    dom.catalogView.classList.remove('hidden');
    dom.detailView.classList.add('hidden');
    dom.pagination.classList.remove('hidden');
    dom.globalBackBtn.classList.add('hidden');
    dom.searchBox.style.display = 'block';
    dom.genreSelect.style.display = 'block';
    dom.topRatedToggle.style.display = 'flex';
    window.scrollTo(0, 0);
}

dom.globalBackBtn.onclick = () => {
    history.back(); // Memicu onpopstate
};

async function generateAI() {
    showLoader("Gemini AI is analyzing the vibe...");
    try {
        console.log('Calling API:', `${API_BASE_URL}/recommend/${state.selectedId}`);
        
        const res = await fetch(`${API_BASE_URL}/recommend/${state.selectedId}`);
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            console.error('Received HTML instead of JSON:', text.substring(0, 500));
            throw new Error('Server returned HTML instead of JSON');
        }
        
        const result = await res.json();
        
        if (!result.success) throw new Error(result.error);

        document.getElementById('aiReasoning').textContent = result.data.musicProfile.reasoning;
        
        const trackHtml = result.data.recommendations.map(t => `
            <div class="track-item">
                <div style="width:40px; height:40px; background:var(--primary); border-radius:4px; display:flex; align-items:center; justify-content:center">🎵</div>
                <div>
                    <div style="font-weight:600">${t.track_name || t.name}</div>
                    <div style="font-size:12px; color:var(--text-dim)">${t.artists || 'Unknown Artist'}</div>
                </div>
            </div>
        `).join('');
        document.getElementById('trackList').innerHTML = trackHtml;
    } catch (err) {
        console.error('Error generating AI recommendations:', err);
        alert("Error: " + err.message);
    } finally {
        hideLoader();
    }
}

dom.globalBackBtn.onclick = () => {
    dom.catalogView.classList.remove('hidden');
    dom.detailView.classList.add('hidden');
    dom.pagination.classList.remove('hidden');
    dom.globalBackBtn.classList.add('hidden');
    
    dom.searchBox.style.display = 'block';
    dom.genreSelect.style.display = 'block';
    dom.topRatedToggle.style.display = 'flex';
    dom.globalBackBtn.style.width = 'auto';
};

document.getElementById('aiActionBtn').onclick = generateAI;

document.getElementById('genreSelect').onchange = (e) => {
    state.genre = e.target.value; 
    state.page = 1; 
    loadBooks();
};

document.getElementById('topRatedCheck').onchange = (e) => {
    state.topRated = e.target.checked; 
    state.page = 1; 
    loadBooks();
};

document.getElementById('searchInput').onkeypress = (e) => {
    if(e.key === 'Enter') { 
        state.search = e.target.value; 
        state.page = 1; 
        loadBooks(); 
    }
};

document.getElementById('prevBtn').onclick = () => {
    if (state.page > 1) {
        state.page--;
        loadBooks();
        window.scrollTo(0, 0);
    }
};

document.getElementById('nextBtn').onclick = () => {
    state.page++;
    loadBooks();
    window.scrollTo(0, 0);
};

function showLoader(text) { 
    dom.loader.classList.remove('hidden'); 
    document.getElementById('loaderText').textContent = text;
}

function hideLoader() { 
    dom.loader.classList.add('hidden'); 
}