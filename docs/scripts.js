// Menu data - will be loaded from JSON
let menuData = {};
let historyData = {};
let eventsData = {};
let facebookPostsData = {};

// Function to load menu from JSON file
async function loadMenu() {
    try {
        const response = await fetch('./menu.json');
        menuData = await response.json();
        renderMenu();
    } catch (error) {
        console.error('Error loading menu:', error);
        // Fallback menu data
        menuData = {
            menu: {
                potatoes: [
                    {
                        name: "Plain",
                        description: "Like a french fry - good with ketchup, salt, malt vinegar",
                        price: 9,
                        image: "https://ik.imagekit.io/Potato/menu/plain-potato.jpg"
                    },
                    {
                        name: "Loaded",
                        description: "Sour cream, cheese, bacon & chives on a spiral potato",
                        price: 10,
                        image: "https://ik.imagekit.io/Potato/menu/loaded-potato.jpg"
                    }
                ]
            }
        };
        renderMenu();
    }
}

// Function to load history from JSON file
async function loadHistory() {
    try {
        const response = await fetch('./history.json');
        historyData = await response.json();
        renderHistory();
    } catch (error) {
        console.error('Error loading history:', error);
        // Fallback history data
        historyData = {
            history: [
                {
                    year: "2020",
                    title: "The Beginning",
                    description: "Mooses Tornado Potatoes officially launched in Chardon Square.",
                    image: "https://ik.imagekit.io/Potato/history/launch-2020.jpg"
                }
            ]
        };
        renderHistory();
    }
}

// Function to load events from JSON file
async function loadEvents() {
    console.log('loadEvents() called');
    try {
        console.log('Fetching events.json...');
        const response = await fetch('./events.json');
        console.log('Fetch response:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        eventsData = await response.json();
        console.log('Events data loaded:', eventsData);
        renderEvents();
    } catch (error) {
        console.error('Error loading events:', error);
        // Fallback events data
        eventsData = {
            events: [
                {
                    name: "FOREVER SEGER",
                    location: "Mentor Civic Amphitheater (8600 Munson Rd)",
                    date: "2026-06-02",
                    displayDate: "June 2",
                    time: "7:00 PM - 9:00 PM",
                    description: "Bob Seger tribute",
                    status: "upcoming"
                }
            ]
        };
        console.log('Using fallback events data:', eventsData);
        renderEvents();
    }
}

// Function to load curated Facebook post highlights
async function loadFacebookPosts() {
    try {
        const response = await fetch('./facebook-posts.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        facebookPostsData = await response.json();
        renderFacebookPosts();
    } catch (error) {
        console.error('Error loading Facebook post highlights:', error);
        facebookPostsData = {
            posts: [
                {
                    category: "Facebook",
                    title: "Catch the latest updates",
                    description: "Follow Mooses Tornado Potatoes for locations, photos, and fresh menu news.",
                    link: "https://www.facebook.com/profile.php?id=100094510050087",
                    icon: "bi-facebook",
                    featured: true
                }
            ]
        };
        renderFacebookPosts();
    }
}

// Function to render events
function renderEvents() {
    try {
        console.log('renderEvents() called');
        console.log('eventsData:', eventsData);
        
        const eventsContainer = document.getElementById('events-container');
        console.log('eventsContainer found:', !!eventsContainer);
        
        if (!eventsContainer) {
            console.error('Events container not found!');
            return;
        }
        
        if (!eventsData || !eventsData.events || eventsData.events.length === 0) {
            console.log('No events data available');
            eventsContainer.innerHTML = '<p class="text-muted">No upcoming events at this time.</p>';
            return;
        }

        let eventsHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const parseEventDate = (dateValue) => {
            if (!dateValue) return null;
            const [year, month, day] = dateValue.split('-').map(Number);
            if (!year || !month || !day) return null;
            return new Date(year, month - 1, day);
        };

        // Filter upcoming events by status and date
        const upcomingEvents = eventsData.events
            .filter(event => {
                const eventDate = parseEventDate(event.date);
                return event.status === 'upcoming' && eventDate && eventDate >= today;
            });
        
        if (upcomingEvents.length === 0) {
            eventsHTML = '<p class="text-muted">No upcoming events at this time.</p>';
        } else {
            // Group events by location
            const eventsByLocation = {};
            
            upcomingEvents.forEach(event => {
                const location = event.location || 'Unknown Location';
                if (!eventsByLocation[location]) {
                    eventsByLocation[location] = [];
                }
                eventsByLocation[location].push(event);
            });
            
            // Sort events within each location chronologically
            Object.keys(eventsByLocation).forEach(location => {
                eventsByLocation[location].sort((a, b) => {
                    const dateA = parseEventDate(a.date);
                    const dateB = parseEventDate(b.date);
                    return dateA - dateB;
                });
            });
            
            console.log('Events grouped by location:', eventsByLocation);
            
            eventsHTML = '';
            
            // Render each location group
            Object.keys(eventsByLocation).sort().forEach(location => {
                eventsHTML += `<div class="mb-5">
                    <h4 class="h5 mb-3 text-primary"><i class="bi bi-geo-alt me-2"></i>${location}</h4>
                    <div class="list-group list-group-flush">`;
                
                eventsByLocation[location].forEach(event => {
                    const displayDate = event.displayDate || event.date;
                    const featuredClass = event.featured ? ' border-warning' : '';
                    const recurringBadge = event.recurring ? `<span class="badge bg-success rounded-pill me-2 small">Weekly</span>` : '';
                    const websiteLink = event.website ? `<a href="${event.website}" target="_blank" class="small text-primary text-decoration-none"><i class="bi bi-link-45deg me-1"></i>Event Website</a>` : '';
                    
                    eventsHTML += `
                        <div class="list-group-item px-0${featuredClass}">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="flex-grow-1">
                                    <h5 class="h6 mb-1">${event.name}</h5>
                                    <p class="small text-muted mb-1"><i class="bi bi-clock me-1"></i>${event.time}</p>
                                    <p class="small text-success mb-1">
                                        <i class="bi bi-info-circle me-1"></i>
                                        ${event.description}
                                    </p>
                                    ${websiteLink ? `<p class="mb-0">${websiteLink}</p>` : ''}
                                </div>
                                <div class="text-end">
                                    ${recurringBadge}
                                    <span class="badge bg-primary rounded-pill">${displayDate}</span>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                eventsHTML += '</div></div>';
            });
        }

        console.log('Setting eventsContainer innerHTML');
        eventsContainer.innerHTML = eventsHTML;
        console.log('Events rendered successfully');
    } catch (error) {
        console.error('Error rendering events:', error);
    }
}

// Function to render menu items
function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    let menuHTML = '';

    // Render Potatoes section
    if (menuData.menu && menuData.menu.potatoes) {
        menuHTML += '<div class="col-12"><h3 class="h4 mb-4 text-primary">Tornado Potatoes</h3></div>';
        menuData.menu.potatoes.forEach(item => {
            menuHTML += renderMenuItem(item);
        });
    }

    // Render Hot Dogs section if it exists
    if (menuData.menu && menuData.menu.hotDogs) {
        menuHTML += '<div class="col-12 mt-5"><h3 class="h4 mb-4 text-primary">Hot Dogs</h3></div>';
        menuData.menu.hotDogs.forEach(item => {
            menuHTML += renderMenuItem(item);
        });
    }

    // Render Drinks section if it exists
    if (menuData.drinks) {
        menuHTML += '<div class="col-12 mt-5"><h3 class="h4 mb-4 text-primary">Drinks</h3></div>';
        menuData.drinks.forEach(item => {
            menuHTML += renderMenuItem(item);
        });
    }

    menuContainer.innerHTML = menuHTML;
}

// Function to render Facebook post highlights
function renderFacebookPosts() {
    const postsContainer = document.getElementById('facebook-posts-container');
    if (!postsContainer) return;

    const posts = facebookPostsData.posts || [];

    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="facebook-post-card facebook-post-card-featured">
                <div class="facebook-card-icon"><i class="bi bi-facebook"></i></div>
                <h3 class="h5 mb-2">Follow Mooses on Facebook</h3>
                <p class="text-muted mb-3">See the latest truck updates, photos, and event chatter.</p>
                <a href="https://www.facebook.com/profile.php?id=100094510050087" target="_blank" rel="noopener noreferrer" class="stretched-link">Open Facebook</a>
            </div>
        `;
        return;
    }

    postsContainer.innerHTML = posts.map(post => {
        const featuredClass = post.featured ? ' facebook-post-card-featured' : '';
        const icon = post.icon || 'bi-facebook';
        const link = post.link || 'https://www.facebook.com/profile.php?id=100094510050087';

        return `
            <article class="facebook-post-card${featuredClass}">
                <div class="facebook-card-topline">
                    <span>${post.category || 'Facebook'}</span>
                    <i class="bi ${icon}" aria-hidden="true"></i>
                </div>
                <h3 class="h5 mb-2">${post.title}</h3>
                <p class="text-muted mb-4">${post.description}</p>
                <a href="${link}" target="_blank" rel="noopener noreferrer" class="facebook-card-link">
                    View on Facebook <i class="bi bi-arrow-up-right ms-1" aria-hidden="true"></i>
                </a>
            </article>
        `;
    }).join('');
}

// Function to render history carousel
function renderHistory() {
    try {
        console.log('Attempting to render history carousel');
        const carouselInner = document.getElementById('historyCarouselInner');
        const indicators = document.getElementById('historyIndicators');
        
        if (!carouselInner || !indicators) {
            console.log('Carousel elements not found');
            return;
        }
        
        if (!historyData.history) {
            console.log('No history data available');
            return;
        }

        let carouselHTML = '';
        let indicatorsHTML = '';
        const placeholderImage = 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=400&fit=crop';

        historyData.history.forEach((item, index) => {
            const isActive = index === 0 ? 'active' : '';
            const imageUrl = item.image || placeholderImage;

            // Create carousel slide
            carouselHTML += `
                <div class="carousel-item ${isActive}">
                    <div class="row g-4 align-items-center">
                        <div class="col-md-6">
                            <img src="${imageUrl}" 
                                 class="d-block w-100 rounded shadow-sm" 
                                 alt="${item.title} - ${item.year}"
                                 style="height: 300px; object-fit: cover;"
                                 loading="lazy"
                                 onerror="this.src='${placeholderImage}'">
                        </div>
                        <div class="col-md-6">
                            <div class="p-4">
                                <span class="badge bg-primary fs-6 mb-3">${item.year}</span>
                                <h4 class="h3 mb-3">${item.title}</h4>
                                <p class="text-muted fs-5">${item.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Create indicator
            indicatorsHTML += `
                <button type="button" data-bs-target="#historyCarousel" data-bs-slide-to="${index}" 
                        ${isActive ? 'class="active" aria-current="true"' : ''} 
                        aria-label="Slide ${index + 1}"></button>
            `;
        });

        carouselInner.innerHTML = carouselHTML;
        indicators.innerHTML = indicatorsHTML;
        console.log('History carousel rendered successfully');
    } catch (error) {
        console.error('Error rendering history carousel:', error);
    }
}

// Function to render individual menu item
function renderMenuItem(item) {
    const placeholderImage = 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop';
    const imageUrl = item.image || placeholderImage;
    
    let ingredientsHTML = '';
    if (item.ingredients && item.ingredients.length > 0) {
        ingredientsHTML = `<p class="small text-muted mt-2">
            <strong>Ingredients:</strong> ${item.ingredients.join(', ')}
        </p>`;
    }

    let optionsHTML = '';
    if (item.options && item.options.length > 0) {
        optionsHTML = `<p class="small text-info mt-2">
            <strong>Options:</strong> ${item.options.join(', ')}
        </p>`;
    }

    return `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm">
                <img src="${imageUrl}" 
                     class="card-img-top" 
                     alt="${item.name}"
                     style="height: 200px; object-fit: cover;"
                     loading="lazy"
                     onerror="this.src='${placeholderImage}'">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h3 class="h5 mb-0">${item.name}</h3>
                        <span class="text-primary fw-bold fs-5">$${item.price}</span>
                    </div>
                    <p class="text-muted flex-grow-1">${item.description}</p>
                    ${ingredientsHTML}
                    ${optionsHTML}
                </div>
            </div>
        </div>
    `;
}

// Initialize PDF functionality safely
if (typeof window.jspdf !== 'undefined') {
    window.jsPDF = window.jspdf.jsPDF;
}

// Add loading overlay functionality
document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Function to hide loading overlay
    function hideLoadingOverlay() {
        console.log('Attempting to hide loading overlay');
        if (loadingOverlay) {
            console.log('Loading overlay found, hiding it');
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                console.log('Loading overlay hidden');
            }, 500);
        } else {
            console.log('Loading overlay not found');
        }
    }

    // Initialize everything when DOM is ready
    function initializeContent() {
        console.log('Initializing content...');
        
        // Load menu, Facebook highlights, and events from JSON files
        console.log('Starting to load menu, Facebook highlights, and events');
        try {
            loadMenu();
            loadFacebookPosts();
            loadEvents();
            console.log('Menu, Facebook highlights, and events loading initiated');
        } catch (error) {
            console.error('Error initiating content load:', error);
        }

        // Hide loading overlay after a reasonable time
        console.log('Setting timeout to hide overlay in 1.5 seconds');
        setTimeout(hideLoadingOverlay, 1500);
    }

    // Wait for DOM to be ready before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeContent);
    } else {
        initializeContent();
    }

    // Also hide on window load as backup
    window.addEventListener('load', () => {
        console.log('Window loaded, hiding overlay');
        setTimeout(hideLoadingOverlay, 100);
    });

    // Add smooth transition for the overlay
    if (loadingOverlay) {
        loadingOverlay.style.transition = 'opacity 0.5s ease-in-out';
        console.log('Transition added to loading overlay');
    }

    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (downloadBtn) {
        const buttonText = downloadBtn.querySelector('.button-text');
        const spinner = downloadBtn.querySelector('.spinner-potato');

        downloadBtn.addEventListener('click', async () => {
            // Show loading state
            downloadBtn.disabled = true;
            buttonText.textContent = 'Preparing PDF...';
            spinner.classList.remove('d-none');
            console.log('Spinner shown');

            try {
                // Add artificial delay to see the loading state
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Create new PDF document
                const doc = new jsPDF();

                // Add title
                doc.setFontSize(24);
                doc.text('Tornado Potatoes', 105, 20, { align: 'center' });

                // Add subtitle
                doc.setFontSize(14);
                doc.text('Menu', 105, 30, { align: 'center' });

                // Add menu items
                let yPosition = 50;
                
                // Add Potatoes section
                if (menuData.menu && menuData.menu.potatoes) {
                    doc.setFontSize(18);
                    doc.text('Tornado Potatoes', 20, yPosition);
                    yPosition += 15;
                    
                    menuData.menu.potatoes.forEach(item => {
                        doc.setFontSize(14);
                        doc.text(`${item.name} - $${item.price}`, 20, yPosition);
                        doc.setFontSize(10);
                        doc.text(item.description, 20, yPosition + 7);
                        yPosition += 20;
                    });
                }
                
                // Add Hot Dogs section if it exists
                if (menuData.menu && menuData.menu.hotDogs) {
                    yPosition += 10;
                    doc.setFontSize(18);
                    doc.text('Hot Dogs', 20, yPosition);
                    yPosition += 15;
                    
                    menuData.menu.hotDogs.forEach(item => {
                        doc.setFontSize(14);
                        doc.text(`${item.name} - $${item.price}`, 20, yPosition);
                        doc.setFontSize(10);
                        doc.text(item.description, 20, yPosition + 7);
                        yPosition += 20;
                    });
                }
                
                // Add Drinks section if it exists
                if (menuData.drinks) {
                    yPosition += 10;
                    doc.setFontSize(18);
                    doc.text('Drinks', 20, yPosition);
                    yPosition += 15;
                    
                    menuData.drinks.forEach(item => {
                        doc.setFontSize(14);
                        doc.text(`${item.name} - $${item.price}`, 20, yPosition);
                        doc.setFontSize(10);
                        doc.text(item.description, 20, yPosition + 7);
                        yPosition += 20;
                    });
                }

                // Add footer with contact information
                doc.setFontSize(10);
                const footerText = [
                    'Chardon Square, Chardon, OH 44024',
                    'Phone: (440) 339-1278',
                    'Email: hello@moosestornadopotatoes.com',
                    'Hours: Mon-Thu 11AM-8PM, Fri-Sat 11AM-10PM, Sun 12PM-6PM'
                ];

                yPosition += 20;
                footerText.forEach(text => {
                    doc.text(text, 105, yPosition, { align: 'center' });
                    yPosition += 5;
                });

                // Save the PDF
                doc.save('tornado-potatoes-menu.pdf');
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Sorry, there was an error generating the PDF. Please try again.');
            } finally {
                console.log('Resetting button state');
                // Reset button state
                downloadBtn.disabled = false;
                buttonText.textContent = 'Download Menu (PDF)';
                spinner.classList.add('d-none');
            }
        });
    }
});
