// Menu data - will be loaded from JSON
let menuData = {};
let historyData = {};
let eventsData = {};

// Global error handler to suppress Facebook console spam and CORB errors
window.addEventListener('error', function(event) {
    const message = event.message || '';
    const source = event.filename || '';
    
    // Suppress Facebook-related errors and CORB errors
    if (message.includes('Could not find element') || 
        message.includes('fburl.com') || 
        message.includes('__elem_') ||
        message.includes('Cross-Origin Read Blocking') ||
        message.includes('CORB') ||
        message.includes('Content Security Policy') ||
        message.includes('unsafe-eval') ||
        source.includes('facebook.com') ||
        source.includes('fbcdn.net')) {
        event.preventDefault();
        return false;
    }
});

// Suppress unhandled promise rejections from Facebook
window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason || '';
    if (typeof reason === 'string' && 
        (reason.includes('Could not find element') || 
         reason.includes('fburl.com') || 
         reason.includes('__elem_') ||
         reason.includes('Cross-Origin Read Blocking') ||
         reason.includes('CORB') ||
         reason.includes('Content Security Policy') ||
         reason.includes('unsafe-eval'))) {
        event.preventDefault();
    }
});

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
                    name: "Mentor Rocks",
                    location: "Mentor Civic Amphitheater", 
                    date: "2025-07-27",
                    displayDate: "July 27",
                    time: "5:00 PM - 10:00 PM",
                    description: "Serving starts at 5pm, Concert at 7pm",
                    status: "upcoming"
                }
            ]
        };
        console.log('Using fallback events data:', eventsData);
        renderEvents();
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
        
        // Filter and sort upcoming events chronologically
        const upcomingEvents = eventsData.events
            .filter(event => event.status === 'upcoming')
            .sort((a, b) => {
                // Parse dates for comparison (handle both ISO format and fallback)
                const dateA = new Date(a.date || a.displayDate);
                const dateB = new Date(b.date || b.displayDate);
                return dateA - dateB;
            });
        
        console.log('Upcoming events (sorted):', upcomingEvents);
        
        if (upcomingEvents.length === 0) {
            eventsHTML = '<p class="text-muted">No upcoming events at this time.</p>';
        } else {
            eventsHTML = '<div class="list-group list-group-flush">';
            
            upcomingEvents.forEach(event => {
                // Use displayDate if available, otherwise fall back to date
                const displayDate = event.displayDate || event.date;
                const featuredClass = event.featured ? ' border-warning' : '';
                const recurringBadge = event.recurring ? `<span class="badge bg-success rounded-pill me-2 small">Weekly</span>` : '';
                const websiteLink = event.website ? `<a href="${event.website}" target="_blank" class="small text-primary text-decoration-none"><i class="bi bi-link-45deg me-1"></i>Event Website</a>` : '';
                
                eventsHTML += `
                    <div class="list-group-item px-0${featuredClass}">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h5 class="h6 mb-1">${event.name}</h5>
                                <p class="small text-muted mb-1"><i class="bi bi-geo-alt me-1"></i>${event.location}</p>
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
            
            eventsHTML += '</div>';
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
    // Suppress Facebook console errors and CORB messages
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.error = function(...args) {
        const message = args.join(' ');
        // Filter out Facebook-related errors and CORB messages
        if (message.includes('Could not find element') || 
            message.includes('fburl.com') || 
            message.includes('__elem_') ||
            message.includes('Cross-Origin Read Blocking') ||
            message.includes('CORB blocked') ||
            message.includes('Module "__elem_') ||
            message.includes('Content Security Policy') ||
            message.includes('unsafe-eval')) {
            return; // Don't log these errors
        }
        originalConsoleError.apply(console, args);
    };
    
    console.warn = function(...args) {
        const message = args.join(' ');
        // Filter out CORB warnings and CSP warnings
        if (message.includes('Cross-Origin Read Blocking') ||
            message.includes('CORB blocked') ||
            message.includes('facebook.com') ||
            message.includes('fbcdn.net') ||
            message.includes('Content Security Policy') ||
            message.includes('unsafe-eval')) {
            return; // Don't log these warnings
        }
        originalConsoleWarn.apply(console, args);
    };

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
        
        // Load menu, history, and events from JSON files
        console.log('Starting to load menu, history, and events');
        try {
            loadMenu();
            loadHistory();
            loadEvents();
            console.log('Menu, history, and events loading initiated');
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

    // Check if Facebook iframe loaded properly with better error handling
    setTimeout(function() {
        try {
            const fbContainer = document.querySelector('#fb-container');
            const fbIframe = fbContainer ? fbContainer.querySelector('iframe') : null;
            
            if (!fbIframe || fbIframe.offsetHeight === 0) {
                console.log('Facebook iframe failed to load, showing fallback');
                const fallbackContent = document.getElementById('fallback-content');
                if (fallbackContent && fbContainer) {
                    fbContainer.style.display = 'none';
                    fallbackContent.classList.remove('d-none');
                }
            } else {
                console.log('Facebook iframe loaded successfully');
            }
        } catch (error) {
            console.log('Facebook iframe check failed, showing fallback');
            const fallbackContent = document.getElementById('fallback-content');
            const fbContainer = document.querySelector('#fb-container');
            if (fallbackContent && fbContainer) {
                fbContainer.style.display = 'none';
                fallbackContent.classList.remove('d-none');
            }
        }
    }, 5000); // 5 seconds timeout for Facebook iframe to load

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