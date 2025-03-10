document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');
        this.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }
    });

    // Retrieve user-added events from localStorage
    const userEvents = JSON.parse(localStorage.getItem('userEvents')) || [];

    // Predefined events
    const predefinedEvents = [
        {
            id: 1,
            date: '2025-03-12',
            title: 'Local Football Tournament',
            type: 'sports',
            time: '7:00 PM',
            description: 'Annual high school Football championship',
            price: 'cost to attend: $15',
            capacity: '80% Full'
        },
        {
            id: 2,
            date: '2025-03-15',
            title: 'Spring Band Concert',
            type: 'concert',
            time: '6:30 PM',
            description: 'Featuring school band and choir performances',
            price: 'cost to attend: $10',
            capacity: '65% Full'
        },
        {
            id: 3,
            date: '2025-03-18',
            title: 'College Fair',
            type: 'trade-show',
            time: '3:00 PM',
            description: 'Meet representatives from 50+ colleges',
            price: 'cost to attend: Free',
            capacity: '45% Full'
        },
        {
            id: 4,
            date: '2025-03-21',
            title: 'Regional Volleyball Championship',
            type: 'sports',
            time: '5:00 PM',
            description: 'Final tournament of the season',
            price: 'cost to attend: $12',
            capacity: '75% Full'
        },
        {
            id: 5,
            date: '2025-03-24',
            title: 'Community Theater Production',
            type: 'community',
            time: '7:30 PM',
            description: '"The Wizard of Oz" performed by local theater group',
            price: 'cost to attend: $20',
            capacity: '60% Full'
        },
        {
            id: 6,
            date: '2025-03-27',
            title: 'Science & Technology Fair',
            type: 'trade-show',
            time: '9:00 AM',
            description: 'Annual student science project showcase',
            price: 'cost to attend: $5',
            capacity: '40% Full'
        },
        {
            id: 7,
            date: '2025-03-30',
            title: 'Local Band Night',
            type: 'concert',
            time: '8:00 PM',
            description: 'Featuring three local rock bands',
            price: 'cost to attend: $15',
            capacity: '70% Full'
        },
        {
            id: 8,
            date: '2025-04-01',
            title: 'Wrestling Tournament',
            type: 'sports',
            time: '6:00 PM',
            description: 'Regional wrestling championships',
            price: 'cost to attend: $12',
            capacity: '55% Full'
        },
        {
            id: 9,
            date: '2025-04-03',
            title: 'Spring Art Exhibition',
            type: 'community',
            time: '4:00 PM',
            description: 'Showcasing local student artwork',
            price: 'cost to attend: Free',
            capacity: '30% Full'
        },
        {
            id: 10,
            date: '2025-04-05',
            title: 'Career Fair',
            type: 'trade-show',
            time: '10:00 AM',
            description: 'Meet local employers and explore opportunities',
            price: 'cost to attend: Free',
            capacity: '50% Full'
        }
    ];

    // Combine predefined events with user-added events
    const events = [...predefinedEvents, ...userEvents];

    // Function to save user events to localStorage
    function saveUserEvents() {
        localStorage.setItem('userEvents', JSON.stringify(userEvents));
    }

    // Function to clear user events - make it globally accessible
    function clearUserEvents() {
        // This function will be properly defined when the page loads
        console.log("Page is still loading. Please try again in a moment.");
    }

    // Redefine the global clearUserEvents function with the proper implementation
    window.clearUserEvents = function() {
        userEvents.length = 0; // Clear the array
        localStorage.removeItem('userEvents'); // Remove from localStorage
        events.length = predefinedEvents.length; // Reset events array to only contain predefined events
        
        // Re-populate events with just the predefined events
        for (let i = 0; i < predefinedEvents.length; i++) {
            events[i] = predefinedEvents[i];
        }
        
        // Re-render events and calendar
        displayEvents();
        renderCalendar();
        
        return "All user-added events have been removed.";
    };

    // Registration system - store registrations in localStorage
    const registrations = JSON.parse(localStorage.getItem('eventRegistrations')) || [];

    // Function to save registrations to localStorage
    function saveRegistrations() {
        localStorage.setItem('eventRegistrations', JSON.stringify(registrations));
    }

    // Function to register for an event
    function registerForEvent(registration) {
        // Generate a unique ID for the registration
        registration.id = Date.now().toString();
        registration.timestamp = new Date().toISOString();
        
        // Add to registrations array
        registrations.push(registration);
        
        // Save to localStorage
        saveRegistrations();
        
        return registration.id;
    }

    // Function to get registrations for a specific event
    function getEventRegistrations(eventId) {
        return registrations.filter(reg => reg.eventId === eventId);
    }

    // Function to check if a user is already registered for an event
    function isUserRegistered(email, eventId) {
        return registrations.some(reg => reg.email === email && reg.eventId === eventId);
    }

    let currentDate = new Date(2025, 2, 10); // March 10, 2025 (months are 0-indexed in JavaScript)
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
            price: `cost to attend: $${price}`,
            capacity: `${capacity}% Full`
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

    // Testimonials Slider Functionality
    const slidesContainer = document.querySelector('.testimonials-slider .slides');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let testimonialInterval;

    const totalSlides = slides.length;

    function updateSlidePosition() {
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function nextTestimonial() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlidePosition();
    }

    function prevTestimonial() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlidePosition();
    }

    function startTestimonialSlider() {
        testimonialInterval = setInterval(nextTestimonial, 7500); // Change testimonial every 7.5 seconds
    }

    function resetTestimonialSlider() {
        clearInterval(testimonialInterval);
        startTestimonialSlider();
    }

    nextBtn.addEventListener('click', () => {
        nextTestimonial();
        resetTestimonialSlider();
    });

    prevBtn.addEventListener('click', () => {
        prevTestimonial();
        resetTestimonialSlider();
    });

    // Initialize Testimonials Slider
    if (totalSlides > 0) {
        updateSlidePosition();
        startTestimonialSlider();
    }

    // Filter functionality
    const filterChips = document.querySelectorAll('.chip');
    const searchInput = document.getElementById('eventSearch');

    // Add click event listeners to filter chips
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active class from all chips
            filterChips.forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            chip.classList.add('active');
            
            const filterValue = chip.dataset.filter;
            filterEvents(filterValue, searchInput.value);
        });
    });

    // Add search functionality
    searchInput.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.chip.active').dataset.filter;
        filterEvents(activeFilter, e.target.value);
    });

    // Function to filter events
    function filterEvents(filterValue, searchText = '') {
        let filteredEvents = events;
        
        // Filter by type
        if (filterValue !== 'all') {
            filteredEvents = events.filter(event => event.type === filterValue);
        }
        
        // Filter by search text
        if (searchText.trim() !== '') {
            const searchLower = searchText.toLowerCase();
            filteredEvents = filteredEvents.filter(event => 
                event.title.toLowerCase().includes(searchLower) ||
                event.description.toLowerCase().includes(searchLower)
            );
        }
        
        // Reset showing all events flag when filtering
        showingAllEvents = false;
        
        // Display filtered events
        displayEvents(filteredEvents);
    }

    // Metrics Toggle Functionality
    const metricsToggle = document.getElementById('metricsToggle');
    const metricsSection = document.getElementById('metrics');
    const closeMetrics = document.getElementById('closeMetrics');
    const metricsToggleLinks = document.querySelectorAll('.metrics-toggle');

    function openMetricsModal() {
        metricsSection.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeMetricsModal() {
        metricsSection.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Add event listeners to all .metrics-toggle elements
    metricsToggleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openMetricsModal();
        });
    });

    metricsToggle.addEventListener('click', openMetricsModal);

    closeMetrics.addEventListener('click', closeMetricsModal);

    // Close metrics when clicking outside
    metricsSection.addEventListener('click', (e) => {
        if (e.target === metricsSection) {
            closeMetricsModal();
        }
    });

    // Close metrics with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && metricsSection.classList.contains('show')) {
            closeMetricsModal();
        }
    });

    // Initialize the registration system
    function initializeRegistrationSystem() {
        const eventSelect = document.getElementById('registration-event');
        const selectedEventDetails = document.getElementById('selected-event-details');
        const registrationForm = document.getElementById('registration-form');
        const registrationSuccess = document.getElementById('registration-success');
        
        // Populate the event dropdown
        populateEventDropdown();
        
        // Event selection change handler
        eventSelect.addEventListener('change', function() {
            const selectedEventId = parseInt(this.value);
            
            if (selectedEventId) {
                // Find the selected event
                const selectedEvent = events.find(event => event.id === selectedEventId);
                
                if (selectedEvent) {
                    // Display event details
                    document.getElementById('reg-event-title').textContent = selectedEvent.title;
                    document.getElementById('reg-event-date').textContent = new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    document.getElementById('reg-event-time').textContent = selectedEvent.time;
                    document.getElementById('reg-event-type').textContent = capitalizeFirstLetter(selectedEvent.type);
                    document.getElementById('reg-event-description').textContent = selectedEvent.description;
                    document.getElementById('reg-event-price').textContent = selectedEvent.price;
                    document.getElementById('reg-event-capacity').textContent = selectedEvent.capacity;
                    
                    // Show event details and registration form
                    selectedEventDetails.classList.remove('hidden');
                    registrationForm.classList.remove('hidden');
                    registrationSuccess.classList.add('hidden');
                }
            } else {
                // Hide event details and registration form if no event is selected
                selectedEventDetails.classList.add('hidden');
                registrationForm.classList.add('hidden');
            }
        });
        
        // Registration form submission
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const selectedEventId = parseInt(eventSelect.value);
            const selectedEvent = events.find(event => event.id === selectedEventId);
            
            // Check if user is already registered
            const email = document.getElementById('reg-email').value;
            if (isUserRegistered(email, selectedEventId)) {
                alert('You are already registered for this event with this email address.');
                return;
            }
            
            // Create registration object
            const registration = {
                eventId: selectedEventId,
                eventTitle: selectedEvent.title,
                name: document.getElementById('reg-name').value,
                email: email,
                phone: document.getElementById('reg-phone').value,
                tickets: parseInt(document.getElementById('reg-tickets').value),
                specialRequests: document.getElementById('reg-requests').value,
                receiveUpdates: document.getElementById('reg-updates').checked
            };
            
            // Register for the event
            const registrationId = registerForEvent(registration);
            
            // Show success message
            document.getElementById('success-event-name').textContent = selectedEvent.title;
            document.getElementById('success-reg-id').textContent = registrationId;
            
            // Hide form and show success message
            registrationForm.classList.add('hidden');
            registrationSuccess.classList.remove('hidden');
            
            // Reset form
            registrationForm.reset();
        });
        
        // Register another event button
        document.getElementById('register-another').addEventListener('click', function() {
            // Reset the form and selection
            eventSelect.value = '';
            registrationForm.reset();
            
            // Hide success message and event details
            registrationSuccess.classList.add('hidden');
            selectedEventDetails.classList.add('hidden');
            registrationForm.classList.add('hidden');
        });
    }

    // Function to populate the event dropdown
    function populateEventDropdown() {
        const eventSelect = document.getElementById('registration-event');
        
        // Clear existing options except the first one
        while (eventSelect.options.length > 1) {
            eventSelect.remove(1);
        }
        
        // Add events to dropdown
        events.forEach(event => {
            const option = document.createElement('option');
            option.value = event.id;
            option.textContent = `${event.title} - ${new Date(event.date).toLocaleDateString()} at ${event.time}`;
            eventSelect.appendChild(option);
        });
    }

    // Initialize
    displayEvents();
    renderCalendar();
    initializeRegistrationSystem();

    // Update event dropdown when events change
    function updateEventDropdown() {
        populateEventDropdown();
    }

    // Update the displayEvents function to call updateEventDropdown
    const originalDisplayEvents = displayEvents;
    displayEvents = function(filteredEvents = events) {
        originalDisplayEvents(filteredEvents);
        updateEventDropdown();
    };
});