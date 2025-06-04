// Menu data
const menuItems = [
    {
        name: "Classic Tornado",
        description: "Our signature spiral potato with sea salt and black pepper",
        price: "$6"
    },
    {
        name: "Garlic Parmesan",
        description: "Tossed in garlic butter and grated parmesan cheese",
        price: "$7"
    },
    {
        name: "Spicy Cajun",
        description: "Seasoned with our special blend of cajun spices",
        price: "$7"
    },
    {
        name: "BBQ Ranch",
        description: "Drizzled with BBQ sauce and ranch seasoning",
        price: "$7"
    }
];

// Initialize PDF functionality
window.jsPDF = window.jspdf.jsPDF;

// Add loading overlay functionality
document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Only proceed if loadingOverlay exists
    if (loadingOverlay) {
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
    }

    // Load Facebook posts using Graph API
    loadFacebookPosts();

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
                menuItems.forEach(item => {
                    doc.setFontSize(16);
                    doc.text(`${item.name} - ${item.price}`, 20, yPosition);

                    doc.setFontSize(12);
                    doc.text(item.description, 20, yPosition + 7);

                    yPosition += 25;
                });

                // Add footer with contact information
                doc.setFontSize(10);
                const footerText = [
                    '123 Food Truck Lane, Portland, OR 97201',
                    'Phone: (503) 555-0123',
                    'Email: hello@tornadopotatoes.com',
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

/**
 * Loads Facebook posts using the Graph API with client-side authentication
 * This uses Facebook's recommended approach that doesn't require storing access tokens
 */
function loadFacebookPosts() {
    // Check if FB SDK is loaded
    if (typeof FB === 'undefined') {
        console.error('Facebook SDK not loaded');
        showFallbackContent();
        return;
    }
    
    const postsContainer = document.getElementById('fb-posts');
    
    try {
        // Get page ID from config
        const pageId = CONFIG.facebook.pageId;
        
        // Use FB.api without an access token for public page data
        // The SDK will handle authentication with just the app ID
        FB.api(
            `/${pageId}/posts`,
            'GET',
            {
                fields: 'message,created_time,full_picture,permalink_url',
                limit: 5
            },
            function(response) {
                if (response && !response.error) {
                    displayFacebookPosts(response.data, postsContainer);
                } else {
                    console.error('Error fetching Facebook posts:', response ? response.error : 'Unknown error');
                    showFallbackContent();
                }
            }
        );
    } catch (error) {
        console.error('Error in Facebook API call:', error);
        showFallbackContent();
    }
    
    // Add a timeout to show fallback if posts don't load
    setTimeout(() => {
        if (postsContainer && postsContainer.querySelector('.fb-post-card') === null) {
            showFallbackContent();
        }
    }, 7000); // 7 seconds timeout
}

/**
 * Displays Facebook posts in the container
 */
function displayFacebookPosts(posts, container) {
    if (!posts || posts.length === 0 || !container) {
        console.error('No posts or container');
        showFallbackContent();
        return;
    }
    
    // Clear loading indicator
    container.innerHTML = '';
    
    posts.forEach(post => {
        const postDate = new Date(post.created_time);
        const formattedDate = postDate.toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
        
        const postElement = document.createElement('div');
        postElement.className = 'fb-post-card border-bottom p-4';
        
        let postContent = `
            <div class="d-flex justify-content-between mb-3">
                <div>
                    <h4 class="h6 mb-0">Mooses Tornado Potatoes</h4>
                    <small class="text-muted">${formattedDate}</small>
                </div>
                <a href="${post.permalink_url}" target="_blank" rel="noopener noreferrer" 
                   class="text-decoration-none text-primary" aria-label="View on Facebook">
                    <i class="bi bi-facebook"></i>
                </a>
            </div>
        `;
        
        // Add message if available
        if (post.message) {
            postContent += `<p class="mb-3">${post.message}</p>`;
        }
        
        // Add image if available
        if (post.full_picture) {
            postContent += `
                <div class="mb-3">
                    <img src="${post.full_picture}" alt="Facebook post image" 
                         class="img-fluid rounded">
                </div>
            `;
        }
        
        // Add a link to view on Facebook
        postContent += `
            <div class="text-end">
                <a href="${post.permalink_url}" target="_blank" rel="noopener noreferrer" 
                   class="btn btn-sm btn-outline-primary">
                    View on Facebook
                </a>
            </div>
        `;
        
        postElement.innerHTML = postContent;
        container.appendChild(postElement);
    });
}

/**
 * Shows fallback content if Facebook posts cannot be loaded
 */
function showFallbackContent() {
    const fbContainer = document.getElementById('facebook-feed');
    const fallbackContent = document.getElementById('fallback-content');
    
    if (fbContainer && fallbackContent) {
        fbContainer.style.display = 'none';
        fallbackContent.classList.remove('d-none');
        console.log('Facebook fallback content displayed');
    }
}