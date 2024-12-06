document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user-added events from localStorage
    const userEvents = JSON.parse(localStorage.getItem('userEvents')) || [];

    // Predefined events
    const predefinedEvents = [
        {
            id: 1,
            date: '2024-12-15',
            title: 'Local Basketball Tournament',
            type: 'sports',
            time: '7:00 PM',
            description: 'Annual high school basketball championship',
            price: '$15',
            capacity: '80% Full'
        },
        {
            id: 2,
            date: '2024-12-18',
            title: 'Spring Band Concert',
            type: 'concert',
            time: '6:30 PM',
            description: 'Featuring school band and choir performances',
            price: '$10',
            capacity: '65% Full'
        },
        {
            id: 3,
            date: '2024-12-20',
            title: 'College Fair',
            type: 'trade-show',
            time: '3:00 PM',
            description: 'Meet representatives from 50+ colleges',
            price: 'Free',
            capacity: '45% Full'
        },
        {
            id: 4,
            date: '2024-12-22',
            title: 'Regional Volleyball Championship',
            type: 'sports',
            time: '5:00 PM',
            description: 'Final tournament of the season',
            price: '$12',
            capacity: '75% Full'
        },
        {
            id: 5,
            date: '2024-12-25',
            title: 'Community Theater Production',
            type: 'community',
            time: '7:30 PM',
            description: '"The Wizard of Oz" performed by local theater group',
            price: '$20',
            capacity: '60% Full'
        },
        {
            id: 6,
            date: '2024-12-28',
            title: 'Science & Technology Fair',
            type: 'trade-show',
            time: '9:00 AM',
            description: 'Annual student science project showcase',
            price: '$5',
            capacity: '40% Full'
        },
        {
            id: 7,
            date: '2024-12-30',
            title: 'Local Band Night',
            type: 'concert',
            time: '8:00 PM',
            description: 'Featuring three local rock bands',
            price: '$15',
            capacity: '70% Full'
        },
        {
            id: 8,
            date: '2025-01-02',
            title: 'Wrestling Tournament',
            type: 'sports',
            time: '6:00 PM',
            description: 'Regional wrestling championships',
            price: '$12',
            capacity: '55% Full'
        },
        {
            id: 9,
            date: '2025-01-05',
            title: 'Spring Art Exhibition',
            type: 'community',
            time: '4:00 PM',
            description: 'Showcasing local student artwork',
            price: 'Free',
            capacity: '30% Full'
        },
        {
            id: 10,
            date: '2025-01-08',
            title: 'Career Fair',
            type: 'trade-show',
            time: '10:00 AM',
            description: 'Meet local employers and explore opportunities',
            price: 'Free',
            capacity: '50% Full'
        }
    ];

    // Combine predefined events with user-added events
    const events = [...predefinedEvents, ...userEvents];

    // Function to save user events to localStorage
    function saveUserEvents() {
        localStorage.setItem('userEvents', JSON.stringify(userEvents));
    }

    let currentDate = new Date(2024, 11, 5);
    let selectedFilter = 'all';
    let currentView = 'month';
    let showingAllEvents = false;

    // Dark Mode Toggle Functionality
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Check localStorage for theme preference, default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    function calculateEventsPerRow() {
        const containerWidth = document.querySelector('.events-grid').offsetWidth;
        const minCardWidth = 300; // Minimum width of each card from CSS
        const gap = 24; // Gap between cards (1.5rem = 24px from CSS)
        return Math.floor((containerWidth + gap) / (minCardWidth + gap));
    }

    function updateEventsDisplay() {
        const eventsPerRow = calculateEventsPerRow();
        const INITIAL_ROWS = 2;
        const EVENTS_PER_PAGE = eventsPerRow * INITIAL_ROWS;
        return EVENTS_PER_PAGE;
    }

    // Function to display events (modified to include user-added events)
    function displayEvents(filteredEvents = events) {
        const eventsGrid = document.querySelector('.events-grid');
        eventsGrid.innerHTML = '';

        // Calculate how many events to show based on current screen width
        const eventsToShow = showingAllEvents
            ? filteredEvents
            : filteredEvents.slice(0, updateEventsDisplay());

        // Display events
        eventsToShow.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-card-content">
                    <span class="event-category">${capitalizeFirstLetter(event.type)}</span>
                    <h3>${event.title}</h3>
                    <div class="event-date">${new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })} at ${event.time}</div>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-ticket-alt"></i> ${event.price}</span>
                        <span><i class="fas fa-users"></i> ${event.capacity}</span>
                    </div>
                </div>
            `;
            eventsGrid.appendChild(eventCard);
        });

        // Add or remove "See More" button
        const existingButton = document.querySelector('.see-more-btn');
        if (existingButton) {
            existingButton.remove();
        }

        if (!showingAllEvents && filteredEvents.length > updateEventsDisplay()) {
            const seeMoreButton = document.createElement('button');
            seeMoreButton.className = 'see-more-btn';
            seeMoreButton.textContent = 'See More Events';
            seeMoreButton.onclick = () => {
                showingAllEvents = true;
                displayEvents(filteredEvents);
            };
            eventsGrid.parentElement.appendChild(seeMoreButton);
        } else if (showingAllEvents && filteredEvents.length > updateEventsDisplay()) {
            const seeLessButton = document.createElement('button');
            seeLessButton.className = 'see-more-btn';
            seeLessButton.textContent = 'Show Less';
            seeLessButton.onclick = () => {
                showingAllEvents = false;
                displayEvents(filteredEvents);
            };
            eventsGrid.parentElement.appendChild(seeLessButton);
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function renderCalendar() {
        if (currentView === 'month') {
            renderMonthView();
        } else if (currentView === 'list') {
            renderListView();
        }
    }

    function renderMonthView() {
        const calendar = document.getElementById('calendar');
        if (!calendar) return;

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid';

        // Add day headers
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Create calendar days
        const currentDateString = new Date().toISOString().split('T')[0];

        for (let date = new Date(startDate); date <= lastDay || date.getDay() !== 0; date.setDate(date.getDate() + 1)) {
            const dateString = date.toISOString().split('T')[0];
            const dayEvents = events.filter(event => event.date === dateString);

            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            if (date.getMonth() !== currentDate.getMonth()) {
                dayElement.classList.add('other-month');
            }
            if (dateString === currentDateString) {
                dayElement.classList.add('today');
            }

            dayElement.dataset.date = dateString;

            // Create the HTML for the day cell
            dayElement.innerHTML = `
                <span class="date">${date.getDate()}</span>
                ${dayEvents.length > 0 ? `
                    <div class="event-names">
                        ${dayEvents.map(event => `
                            <div class="event-name" style="color: ${getEventColor(event.type)}">
                                ${event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            `;

            calendarGrid.appendChild(dayElement);
        }

        calendar.innerHTML = '';
        calendar.appendChild(calendarGrid);
    }

    function getEventColor(type) {
        const colors = {
            'sports': '#ff4444',
            'concert': '#44ff44',
            'trade-show': '#4444ff',
            'community': '#ffaa44',
            'corporate': '#ffaa44', // Added 'corporate' type
            'other': '#888888' // Added 'other' type
        };
        return colors[type] || '#888888';
    }

    function renderListView() {
        const calendar = document.getElementById('calendar');
        calendar.style.display = 'block';

        // Group events by date
        const groupedEvents = events.reduce((acc, event) => {
            const date = event.date;
            if (!acc[date]) acc[date] = [];
            acc[date].push(event);
            return acc;
        }, {});

        // Render events in list format
        Object.entries(groupedEvents).forEach(([date, dayEvents]) => {
            const listItem = document.createElement('div');
            listItem.className = 'date-group';
            listItem.innerHTML = `
                <h3>${new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            })}</h3>
                ${dayEvents.map(event => `
                    <div class="event-card">
                        <h4>${event.title}</h4>
                        <div class="event-meta">
                            <span><i class="far fa-clock"></i> ${event.time}</span>
                            <span><i class="fas fa-ticket-alt"></i> ${event.price}</span>
                            <span><i class="fas fa-users"></i> ${event.capacity}</span>
                        </div>
                    </div>
                `).join('')}
            `;
            calendar.appendChild(listItem);
        });
    }

    // Event Listeners for View Buttons (Assuming they exist)
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            renderCalendar();
        });
    });

    // Add Event Form Functionality
    const addEventForm = document.getElementById('add-event-form');

    addEventForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Gather form data
        const title = document.getElementById('event-title').value.trim();
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const type = document.getElementById('event-type').value;
        const description = document.getElementById('event-description').value.trim();
        const price = document.getElementById('event-price').value.trim();
        const capacity = document.getElementById('event-capacity').value.trim();

        // Validate form data
        if (!title || !date || !time || !type || !description || !price || !capacity) {
            alert('Please fill out all required fields.');
            return;
        }

        // Create new event object with a unique ID
        const newEvent = {
            id: events.length + 1, // Simple ID assignment; consider using UUID for larger applications
            date,
            title,
            type,
            time,
            description,
            price,
            capacity
        };

        // Add to userEvents and events arrays
        userEvents.push(newEvent);
        events.push(newEvent);

        // Save to localStorage
        saveUserEvents();

        // Reset the form
        addEventForm.reset();

        // Re-render events and calendar
        displayEvents();
        renderCalendar();

        alert('Event added successfully!');
    });

    // Initialize
    displayEvents();
    renderCalendar();

    // Update display when window is resized
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!showingAllEvents) {
                displayEvents();
            }
        }, 250);
    });
});