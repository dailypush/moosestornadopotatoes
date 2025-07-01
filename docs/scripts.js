// Menu data - will be loaded from YAML
let menuData = {};

// Function to load menu from YAML file
async function loadMenu() {
    try {
        const response = await fetch('./menu.yaml');
        const yamlText = await response.text();
        menuData = jsyaml.load(yamlText);
        renderMenu();
    } catch (error) {
        console.error('Error loading menu:', error);
        // Fallback menu data
        menuData = {
            Menu: {
                Potatoes: [
                    {
                        name: "Plain",
                        description: "Like a french fry - good with ketchup, salt, malt vinegar",
                        price: 9,
                        image: "./assets/images/menu/plain-potato.jpg"
                    },
                    {
                        name: "Loaded",
                        description: "Sour cream, cheese, bacon & chives on a spiral potato",
                        price: 10,
                        image: "./assets/images/menu/loaded-potato.jpg"
                    }
                ]
            }
        };
        renderMenu();
    }
}

// Function to render menu items
function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    let menuHTML = '';

    // Render Potatoes section
    if (menuData.Menu && menuData.Menu.Potatoes) {
        menuHTML += '<div class="col-12"><h3 class="h4 mb-4 text-primary">Tornado Potatoes</h3></div>';
        menuData.Menu.Potatoes.forEach(item => {
            menuHTML += renderMenuItem(item);
        });
    }

    // Render Hot Dogs section if it exists
    if (menuData.Menu && menuData.Menu.HotDogs) {
        menuHTML += '<div class="col-12 mt-5"><h3 class="h4 mb-4 text-primary">Hot Dogs</h3></div>';
        menuData.Menu.HotDogs.forEach(item => {
            menuHTML += renderMenuItem(item);
        });
    }

    // Render Drinks section if it exists
    if (menuData.Drinks) {
        menuHTML += '<div class="col-12 mt-5"><h3 class="h4 mb-4 text-primary">Drinks</h3></div>';
        menuData.Drinks.forEach(item => {
            menuHTML += renderMenuItem(item);
        });
    }

    menuContainer.innerHTML = menuHTML;
}

// Function to render individual menu item
function renderMenuItem(item) {
    const placeholderImage = 'https://images.unsplash.com/photo-1642676763422-3b0864e65626?w=400&h=300&fit=crop';
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

// Initialize PDF functionality
window.jsPDF = window.jspdf.jsPDF;

// Add loading overlay functionality
document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Load menu from YAML file
    loadMenu();

    // Hide loading overlay after content is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }, 1500); // Show loading for at least 1.5 seconds
    });

    // Add smooth transition for the overlay
    loadingOverlay.style.transition = 'opacity 0.5s ease-in-out';

    // Check if Facebook iframe loaded properly
    setTimeout(function() {
        const fbIframe = document.querySelector('#fb-container iframe');
        if (!fbIframe || fbIframe.offsetHeight === 0) {
            const fallbackContent = document.getElementById('fallback-content');
            if (fallbackContent) {
                document.querySelector('#fb-container').style.display = 'none';
                fallbackContent.classList.remove('d-none');
                console.log('Facebook fallback content displayed');
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
                if (menuData.Menu && menuData.Menu.Potatoes) {
                    doc.setFontSize(18);
                    doc.text('Tornado Potatoes', 20, yPosition);
                    yPosition += 15;
                    
                    menuData.Menu.Potatoes.forEach(item => {
                        doc.setFontSize(14);
                        doc.text(`${item.name} - $${item.price}`, 20, yPosition);
                        doc.setFontSize(10);
                        doc.text(item.description, 20, yPosition + 7);
                        yPosition += 20;
                    });
                }
                
                // Add Hot Dogs section if it exists
                if (menuData.Menu && menuData.Menu.HotDogs) {
                    yPosition += 10;
                    doc.setFontSize(18);
                    doc.text('Hot Dogs', 20, yPosition);
                    yPosition += 15;
                    
                    menuData.Menu.HotDogs.forEach(item => {
                        doc.setFontSize(14);
                        doc.text(`${item.name} - $${item.price}`, 20, yPosition);
                        doc.setFontSize(10);
                        doc.text(item.description, 20, yPosition + 7);
                        yPosition += 20;
                    });
                }
                
                // Add Drinks section if it exists
                if (menuData.Drinks) {
                    yPosition += 10;
                    doc.setFontSize(18);
                    doc.text('Drinks', 20, yPosition);
                    yPosition += 15;
                    
                    menuData.Drinks.forEach(item => {
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
                    'Phone: (440) 555-0123',
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