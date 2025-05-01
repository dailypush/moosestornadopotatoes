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

    const downloadBtn = document.getElementById('downloadPdfBtn');
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
});