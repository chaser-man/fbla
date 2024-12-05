document.addEventListener('DOMContentLoaded', function() {
    const events = [
        {
            id: 1,
            date: '2024-03-15',
            title: 'Local Basketball Tournament',
            type: 'sports',
            time: '7:00 PM',
            description: 'Annual high school basketball championship',
            price: '$15',
            capacity: '80% Full',
            location: 'Main Court'
        },
        {
            id: 2,
            date: '2024-03-18',
            title: 'Spring Band Concert',
            type: 'concert',
            time: '6:30 PM',
            description: 'Featuring school band and choir performances',
            price: '$10',
            capacity: '65% Full',
            location: 'Main Arena'
        },
        {
            id: 3,
            date: '2024-03-20',
            title: 'College Fair',
            type: 'trade-show',
            time: '3:00 PM',
            description: 'Meet representatives from 50+ colleges',
            price: 'Free',
            capacity: '45% Full',
            location: 'Exhibition Hall'
        },
        {
            id: 4,
            date: '2024-03-22',
            title: 'Regional Volleyball Championship',
            type: 'sports',
            time: '5:00 PM',
            description: 'Final tournament of the season',
            price: '$12',
            capacity: '75% Full',
            location: 'Main Court'
        },
        {
            id: 5,
            date: '2024-03-25',
            title: 'Community Theater Production',
            type: 'community',
            time: '7:30 PM',
            description: '"The Wizard of Oz" performed by local theater group',
            price: '$20',
            capacity: '60% Full',
            location: 'Main Arena'
        },
        {
            id: 6,
            date: '2024-03-28',
            title: 'Science & Technology Fair',
            type: 'trade-show',
            time: '9:00 AM',
            description: 'Annual student science project showcase',
            price: '$5',
            capacity: '40% Full',
            location: 'Exhibition Hall'
        },
        {
            id: 7,
            date: '2024-03-30',
            title: 'Local Band Night',
            type: 'concert',
            time: '8:00 PM',
            description: 'Featuring three local rock bands',
            price: '$15',
            capacity: '70% Full',
            location: 'Main Arena'
        },
        {
            id: 8,
            date: '2024-04-02',
            title: 'Wrestling Tournament',
            type: 'sports',
            time: '6:00 PM',
            description: 'Regional wrestling championships',
            price: '$12',
            capacity: '55% Full',
            location: 'Main Court'
        },
        {
            id: 9,
            date: '2024-04-05',
            title: 'Spring Art Exhibition',
            type: 'community',
            time: '4:00 PM',
            description: 'Showcasing local student artwork',
            price: 'Free',
            capacity: '30% Full',
            location: 'Exhibition Hall'
        },
        {
            id: 10,
            date: '2024-04-08',
            title: 'Career Fair',
            type: 'trade-show',
            time: '10:00 AM',
            description: 'Meet local employers and explore opportunities',
            price: 'Free',
            capacity: '50% Full',
            location: 'Exhibition Hall'
        }
    ];

    let currentDate = new Date();
    let selectedFilter = 'all';
    let currentView = 'month';

    let showingAllEvents = false;

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

    // Function to display events
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
                    <span class="event-category">${event.type}</span>
                    <h3>${event.title}</h3>
                    <div class="event-date">${new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })} at ${event.time}</div>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
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

    // Initial display
    displayEvents();

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

    // Update search functionality
    const searchInput = document.getElementById('eventSearch');
    searchInput.addEventListener('input', function() {
        showingAllEvents = false; // Reset to show less when searching
        const searchTerm = this.value.toLowerCase();
        const filteredEvents = events.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm)
        );
        displayEvents(filteredEvents);
    });

    // Update filter functionality
    const filterChips = document.querySelectorAll('.chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            showingAllEvents = false; // Reset to show less when filtering
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.dataset.filter;
            const filteredEvents = filterValue === 'all' 
                ? events 
                : events.filter(event => event.type === filterValue);
            
            displayEvents(filteredEvents);
        });
    });

    // Handle date selection
    function handleDateSelection(date) {
        const selectedDateDisplay = document.getElementById('selectedDateDisplay');
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        selectedDateDisplay.textContent = formattedDate;

        // Filter events for selected date
        const dayEvents = events.filter(event => event.date === date);
        displayEvents(dayEvents);
    }

    // Update calendar day click handlers
    function renderCalendar() {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';
        
        // Update month/year display with animation
        const monthYearDisplay = document.getElementById('currentMonthYear');
        monthYearDisplay.style.opacity = '0';
        setTimeout(() => {
            monthYearDisplay.textContent = new Date(currentDate).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
            monthYearDisplay.style.opacity = '1';
        }, 200);

        if (currentView === 'month') {
            renderMonthView();
        } else {
            renderListView();
        }

        // Add click handlers to calendar days
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', function() {
                const selectedDate = this.dataset.date;
                if (selectedDate) {
                    handleDateSelection(selectedDate);
                    // Remove previous selection
                    document.querySelectorAll('.calendar-day').forEach(d => 
                        d.classList.remove('selected'));
                    // Add selected class
                    this.classList.add('selected');
                }
            });
        });
    }

    function renderMonthView() {
        // Similar to before but with enhanced day rendering
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.innerHTML = `
            <span class="date">${day}</span>
            <div class="event-indicators">
                ${dayEvents.map(event => `
                    <span class="event-dot" style="background: ${getEventColor(event.type)}" 
                          title="${event.title}"></span>
                `).join('')}
            </div>
        `;
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
                            <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                            <span><i class="fas fa-users"></i> ${event.capacity}</span>
                        </div>
                    </div>
                `).join('')}
            `;
            calendar.appendChild(listItem);
        });
    }

    // Event Listeners
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            selectedFilter = this.dataset.filter;
            renderCalendar();
        });
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            renderCalendar();
        });
    });

    // Initialize
    renderCalendar();
});
