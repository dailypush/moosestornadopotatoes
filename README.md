# moosestornadopotatoes

## Accessing the Static Website

The static website for Moose's Tornado Potatoes is hosted on GitHub Pages. You can access it by visiting the following URL:

[https://dailypush.github.io/moosestornadopotatoes/](https://dailypush.github.io/moosestornadopotatoes/)

The website contains information about Moose's Tornado Potatoes and will be updated regularly with new content.

## Managing Events

The website features a dynamic "Upcoming Events" section that loads from `docs/events.json`. Events are automatically sorted chronologically and displayed with enhanced formatting.

### Adding New Events

To add new events from Facebook or other sources, follow these steps:

1. **Open** `docs/events.json`
2. **Add** new event objects to the `events` array
3. **Maintain** chronological order (events are auto-sorted by date)
4. **Use** the template below for consistency

### Event Template

Copy this template for each new event:

```json
{
    "name": "Event Name from Facebook",
    "location": "Event Location", 
    "date": "2025-MM-DD",
    "displayDate": "Month Day",
    "time": "Start Time - End Time",
    "description": "Event description from Facebook post",
    "status": "upcoming"
}
```

### Optional Event Properties

You can enhance events with these optional properties:

```json
{
    "name": "Special Event",
    "location": "Event Location", 
    "date": "2025-MM-DD",
    "displayDate": "Month Day",
    "time": "Start Time - End Time",
    "description": "Event description",
    "status": "upcoming",
    "website": "https://event-website.com",
    "featured": true,
    "recurring": "weekly"
}
```

**Property Descriptions:**
- `website`: Link to event website (displays as clickable link)
- `featured`: Set to `true` for important events (adds warning border)
- `recurring`: Set to `"weekly"` for regular events (adds "Weekly" badge)

### Event Status Options

- `"upcoming"`: Event will be displayed in the events section
- `"past"`: Event will be hidden from display
- `"cancelled"`: Event will be hidden from display

### Date Format Requirements

- **`date`**: ISO format (YYYY-MM-DD) for proper sorting
- **`displayDate`**: Human-readable format for display (e.g., "July 27", "April 26-28, 2026")

### Example Complete Event

```json
{
    "name": "Chardon Maple Festival",
    "location": "Chardon Square",
    "date": "2026-04-26",
    "displayDate": "April 26-27, 2026",
    "time": "10:00 AM - 6:00 PM",
    "description": "Annual maple syrup celebration - Chardon's biggest festival!",
    "status": "upcoming",
    "featured": true,
    "website": "https://chardonmaplefest.com"
}
```

## Managing Menu Items

The website features a dynamic menu section that loads from `docs/menu.json`. Menu items are displayed in a responsive grid with images and pricing.

### Adding New Menu Items

To add new menu items, follow these steps:

1. **Open** `docs/menu.json`
2. **Add** new item objects to the `items` array
3. **Upload images** to ImageKit.io or update image URLs
4. **Use** the template below for consistency

### Menu Item Template

Copy this template for each new menu item:

```json
{
    "name": "Menu Item Name",
    "description": "Brief description of the item",
    "price": "$X.XX",
    "image": "https://ik.imagekit.io/Potato/menu/item-image.jpg",
    "category": "main"
}
```

### Menu Item Categories

- `"main"`: Primary tornado potato items
- `"sides"`: Side dishes and extras  
- `"drinks"`: Beverages
- `"specials"`: Limited time or featured items

### Example Complete Menu Item

```json
{
    "name": "Classic Tornado Potato",
    "description": "Spiral-cut potato on a stick, perfectly seasoned and fried to golden perfection",
    "price": "$6.00",
    "image": "https://ik.imagekit.io/Potato/menu/classic-tornado.jpg",
    "category": "main"
}
```

## Managing History Timeline

The website features a dynamic history carousel that loads from `docs/history.json`. History items are displayed in chronological order with images and descriptions.

### Adding New History Items

To add new history milestones, follow these steps:

1. **Open** `docs/history.json`
2. **Add** new milestone objects to the `milestones` array
3. **Maintain** chronological order by year
4. **Use** the template below for consistency

### History Item Template

Copy this template for each new history milestone:

```json
{
    "year": "2025",
    "title": "Milestone Title",
    "description": "Description of what happened during this time period",
    "image": "https://ik.imagekit.io/Potato/history/milestone-image.jpg",
    "imageAlt": "Descriptive alt text for the image"
}
```

### Example Complete History Item

```json
{
    "year": "2020",
    "title": "The Beginning",
    "description": "Mooses Tornado Potatoes was founded with a simple mission: bring authentic Korean street food to Chardon, Ohio. Starting with a single food trailer and a passion for spiral-cut potatoes.",
    "image": "https://ik.imagekit.io/Potato/history/2020-founding.jpg",
    "imageAlt": "Original food trailer setup in 2020"
}
```

### History Display Features

- **Automatic carousel**: Items rotate automatically with manual controls
- **Responsive images**: All images are optimized for different screen sizes
- **Chronological order**: Items are displayed by year from oldest to newest
- **Bootstrap carousel**: Uses Bootstrap's carousel component for smooth transitions

## SEO Best Practices

To improve the SEO of the static website, the following best practices have been implemented:

- Meta tags for description, keywords, and author have been added to the `docs/index.html` file.
- The website content is structured using appropriate HTML tags (e.g., headings, paragraphs, lists) to ensure proper indexing by search engines.
- Descriptive and keyword-rich alt attributes have been added to images.
- The website URL structure is clean and user-friendly.

## Accessibility Best Practices

To ensure the website is accessible to all users, the following best practices have been implemented:

- Semantic HTML elements (e.g., header, nav, main, footer) have been used to provide a clear structure.
- ARIA (Accessible Rich Internet Applications) attributes have been added to enhance the accessibility of interactive elements.
- Text alternatives (e.g., alt attributes for images) have been provided for non-text content.
- The website has been tested using screen readers to ensure compatibility.

## Mobile Viewing Best Practices

To ensure the website is optimized for mobile viewing, the following best practices have been implemented:

- The viewport meta tag has been added to the `docs/index.html` file to control the layout on mobile browsers.
- Bootstrap's responsive grid system and utilities have been used to create a flexible layout that adapts to different screen sizes.
- Media queries have been added to apply different styles for different screen sizes.
- Images and other media have been made responsive using CSS to set a maximum width of 100%.
