const gallery = document.getElementById("gallery");
// Sample nature titles and descriptions
const natureTitles = [
    "Serenity Over the Mountains",
    "Whispers of the Forest",
    "Twilight on the Lake",
    "Desert Bloom",
    "Coastal Harmony"
];
const natureDescriptions = [
    "A tranquil mountain range under a golden sunrise.",
    "Dense woods alive with the songs of wildlife.",
    "A serene lake reflecting the colors of dusk.",
    "Vibrant flowers thriving in arid sands.",
    "Gentle waves caressing a peaceful shore."
];
// Replace with your Unsplash Access Key
const UNSPLASH_ACCESS_KEY = 'YOUR_ACCESS_KEY';
let currentPage = 1;
let isLoading = false;
// Fetch nature images from Unsplash API
async function fetchNatureImages(page) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=nature&page=${page}&per_page=10`, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });
        const data = await response.json();
        return data.results.map(img => ({
            url: img.urls.regular,
            alt: img.alt_description || "Nature Image",
            title: natureTitles[Math.floor(Math.random() * natureTitles.length)],
            description: natureDescriptions[Math.floor(Math.random() * natureDescriptions.length)]
        }));
    } catch (error) {
        console.error('Failed to fetch Unsplash images:', error);
        // Fallback images
        return Array(10).fill().map((_, i) => ({
            url: `https://picsum.photos/300/200?random=${page * 10 + i}`,
            alt: "Nature Fallback Image",
            title: natureTitles[Math.floor(Math.random() * natureTitles.length)],
            description: natureDescriptions[Math.floor(Math.random() * natureDescriptions.length)]
        }));
    }
}
// Generate gallery cards
async function loadGalleryCards() {
    if (isLoading) return;
    isLoading = true;
    const images = await fetchNatureImages(currentPage);
    images.forEach((image, index) => {
        const card = document.createElement("div");
        card.className = "card";
        const img = document.createElement("img");
        img.src = image.url;
        img.alt = image.alt;
        img.className = "";
        img.onerror = () => {
            console.error(`Failed to load image for card ${currentPage * 10 + index}: ${img.src}`);
            img.src = 'https://picsum.photos/300/200?random=4';
        };
        const content = document.createElement("div");
        content.className = "card-content";
        const title = document.createElement("h3");
        title.textContent = image.title;
        title.className = "";
        const description = document.createElement("p");
        description.textContent = image.description;
        description.className = "";
        content.appendChild(title);
        content.appendChild(description);
        card.appendChild(img);
        card.appendChild(content);
        gallery.appendChild(card);
    });
    currentPage++;
    isLoading = false;
    console.log(`Loaded page ${currentPage - 1}`);
}
// Infinite scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadGalleryCards();
    }
});
// Initial load
loadGalleryCards();