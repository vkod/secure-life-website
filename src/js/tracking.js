// User Interaction Tracking System

// Initialize tracking
(function() {
    'use strict';
    
    // Configuration
    const TRACKING_CONFIG = {
        enabled: true,
        debug: true, // Set to false in production
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        batchSize: 10, // Number of events to batch before sending
        endpoints: {
            analytics: '/api/analytics', // Replace with actual endpoint
            events: '/api/events' // Replace with actual endpoint
        }
    };
    
    // Session Management
    class SessionManager {
        constructor() {
            this.sessionId = this.getOrCreateSession();
            this.userId = this.getOrCreateUserId();
            this.startTime = Date.now();
            this.pageViews = 0;
            this.events = [];
        }
        
        getOrCreateSession() {
            let sessionId = sessionStorage.getItem('session_id');
            if (!sessionId) {
                sessionId = this.generateId();
                sessionStorage.setItem('session_id', sessionId);
                sessionStorage.setItem('session_start', Date.now().toString());
            }
            return sessionId;
        }
        
        getOrCreateUserId() {
            let userId = localStorage.getItem('user_id');
            if (!userId) {
                userId = this.generateId();
                localStorage.setItem('user_id', userId);
            }
            return userId;
        }
        
        generateId() {
            return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        
        getSessionData() {
            return {
                sessionId: this.sessionId,
                userId: this.userId,
                duration: Date.now() - this.startTime,
                pageViews: this.pageViews,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    // Event Tracking
    class EventTracker {
        constructor(session) {
            this.session = session;
            this.eventQueue = [];
            this.initializeTracking();
        }
        
        initializeTracking() {
            // Track page views
            this.trackPageView();
            
            // Track clicks
            this.trackClicks();
            
            // Track form interactions
            this.trackForms();
            
            // Track scroll depth
            this.trackScrollDepth();
            
            // Track time on page
            this.trackTimeOnPage();
            
            // Track viewport changes
            this.trackViewport();
            
            // Track element visibility
            this.trackElementVisibility();
            
            // Set up beforeunload handler
            window.addEventListener('beforeunload', () => this.flushEvents());
        }
        
        trackPageView() {
            this.session.pageViews++;
            this.logEvent('page_view', {
                url: window.location.href,
                title: document.title,
                referrer: document.referrer,
                screen: {
                    width: window.screen.width,
                    height: window.screen.height
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            });
        }
        
        trackClicks() {
            document.addEventListener('click', (e) => {
                const target = e.target.closest('[data-track-click]');
                if (target) {
                    const trackId = target.getAttribute('data-track-click');
                    this.logEvent('click', {
                        element: trackId,
                        text: target.textContent.trim().substring(0, 100),
                        tagName: target.tagName,
                        href: target.href || null,
                        position: {
                            x: e.clientX,
                            y: e.clientY
                        }
                    });
                }
            });
        }
        
        trackForms() {
            // Track form field interactions
            document.addEventListener('focus', (e) => {
                if (e.target.matches('[data-track-input], [data-track-select]')) {
                    const trackId = e.target.getAttribute('data-track-input') || 
                                  e.target.getAttribute('data-track-select');
                    this.logEvent('form_field_focus', {
                        field: trackId,
                        fieldType: e.target.type,
                        formId: e.target.form?.id
                    });
                }
            }, true);
            
            // Track form field changes
            document.addEventListener('change', (e) => {
                if (e.target.matches('[data-track-input], [data-track-select], [data-track-checkbox]')) {
                    const trackId = e.target.getAttribute('data-track-input') || 
                                  e.target.getAttribute('data-track-select') ||
                                  e.target.getAttribute('data-track-checkbox');
                    
                    let value = e.target.value;
                    // Don't track sensitive data
                    if (e.target.type === 'password' || e.target.name === 'ssn') {
                        value = '[REDACTED]';
                    }
                    
                    this.logEvent('form_field_change', {
                        field: trackId,
                        fieldType: e.target.type,
                        hasValue: !!value,
                        formId: e.target.form?.id
                    });
                }
            });
            
            // Track form submissions
            document.addEventListener('submit', (e) => {
                const form = e.target;
                if (form.hasAttribute('data-track-form')) {
                    const formId = form.getAttribute('data-track-form');
                    const formData = this.getFormMetadata(form);
                    
                    this.logEvent('form_submit', {
                        formId: formId,
                        fields: formData.fields,
                        filledFields: formData.filledFields,
                        totalFields: formData.totalFields
                    });
                }
            });
        }
        
        getFormMetadata(form) {
            const fields = form.querySelectorAll('input, select, textarea');
            let filledFields = 0;
            const fieldList = [];
            
            fields.forEach(field => {
                if (field.value && field.value.trim()) {
                    filledFields++;
                }
                fieldList.push({
                    name: field.name,
                    type: field.type,
                    required: field.required
                });
            });
            
            return {
                fields: fieldList,
                filledFields: filledFields,
                totalFields: fields.length
            };
        }
        
        trackScrollDepth() {
            let maxScroll = 0;
            let scrollTimer;
            
            const calculateScrollDepth = () => {
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
                
                if (scrollDepth > maxScroll) {
                    maxScroll = scrollDepth;
                    
                    // Track milestone depths
                    if ([25, 50, 75, 90, 100].includes(maxScroll)) {
                        this.logEvent('scroll_depth', {
                            depth: maxScroll,
                            page: window.location.pathname
                        });
                    }
                }
            };
            
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(calculateScrollDepth, 100);
            });
        }
        
        trackTimeOnPage() {
            const startTime = Date.now();
            let isActive = true;
            let activeTime = 0;
            let lastActiveTime = startTime;
            
            // Track active/inactive state
            const handleActivity = () => {
                if (!isActive) {
                    isActive = true;
                    lastActiveTime = Date.now();
                }
            };
            
            const handleInactivity = () => {
                if (isActive) {
                    isActive = false;
                    activeTime += Date.now() - lastActiveTime;
                }
            };
            
            // Activity events
            ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
                document.addEventListener(event, handleActivity, true);
            });
            
            // Inactivity after 30 seconds
            let inactivityTimer;
            const resetInactivityTimer = () => {
                clearTimeout(inactivityTimer);
                handleActivity();
                inactivityTimer = setTimeout(handleInactivity, 30000);
            };
            
            resetInactivityTimer();
            document.addEventListener('mousemove', resetInactivityTimer);
            document.addEventListener('keypress', resetInactivityTimer);
            
            // Log time on page when leaving
            window.addEventListener('beforeunload', () => {
                if (isActive) {
                    activeTime += Date.now() - lastActiveTime;
                }
                
                this.logEvent('time_on_page', {
                    totalTime: Date.now() - startTime,
                    activeTime: activeTime,
                    page: window.location.pathname
                });
            });
        }
        
        trackViewport() {
            let resizeTimer;
            
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    this.logEvent('viewport_resize', {
                        width: window.innerWidth,
                        height: window.innerHeight,
                        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
                    });
                }, 500);
            });
        }
        
        trackElementVisibility() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const element = entry.target;
                            const trackView = element.getAttribute('data-track-view');
                            
                            this.logEvent('element_view', {
                                element: trackView,
                                visibility: Math.round(entry.intersectionRatio * 100)
                            });
                            
                            // Stop observing once viewed
                            observer.unobserve(element);
                        }
                    });
                }, {
                    threshold: [0.5] // Trigger when 50% visible
                });
                
                // Observe all elements with data-track-view
                document.querySelectorAll('[data-track-view]').forEach(element => {
                    observer.observe(element);
                });
            }
        }
        
        logEvent(eventType, eventData) {
            const event = {
                type: eventType,
                data: eventData,
                timestamp: Date.now(),
                session: this.session.getSessionData(),
                page: {
                    url: window.location.href,
                    title: document.title
                }
            };
            
            this.eventQueue.push(event);
            
            if (TRACKING_CONFIG.debug) {
                console.log('🔍 Tracked Event:', eventType, eventData);
            }
            
            // Send events in batches
            if (this.eventQueue.length >= TRACKING_CONFIG.batchSize) {
                this.flushEvents();
            }
        }
        
        flushEvents() {
            if (this.eventQueue.length === 0) return;
            
            const events = [...this.eventQueue];
            this.eventQueue = [];
            
            // Store events locally
            this.storeEventsLocally(events);
            
            // In production, send to analytics endpoint
            if (!TRACKING_CONFIG.debug) {
                this.sendEventsToServer(events);
            }
        }
        
        storeEventsLocally(events) {
            const storedEvents = JSON.parse(localStorage.getItem('tracked_events') || '[]');
            storedEvents.push(...events);
            
            // Keep only last 1000 events
            if (storedEvents.length > 1000) {
                storedEvents.splice(0, storedEvents.length - 1000);
            }
            
            localStorage.setItem('tracked_events', JSON.stringify(storedEvents));
        }
        
        sendEventsToServer(events) {
            // Implementation for sending to actual analytics server
            fetch(TRACKING_CONFIG.endpoints.events, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    events: events,
                    session: this.session.getSessionData()
                })
            }).catch(error => {
                console.error('Failed to send tracking events:', error);
                // Store failed events for retry
                this.storeEventsLocally(events);
            });
        }
    }
    
    // Global tracking interface
    window.InsuranceTracking = {
        session: new SessionManager(),
        tracker: null,
        
        init() {
            if (TRACKING_CONFIG.enabled) {
                this.tracker = new EventTracker(this.session);
                console.log('📊 Tracking initialized');
            }
        },
        
        trackEvent(eventType, eventData) {
            if (this.tracker) {
                this.tracker.logEvent(eventType, eventData);
            }
        },
        
        getEvents() {
            return JSON.parse(localStorage.getItem('tracked_events') || '[]');
        },
        
        clearEvents() {
            localStorage.removeItem('tracked_events');
            console.log('Tracking events cleared');
        },
        
        getSession() {
            return this.session.getSessionData();
        }
    };
    
    // Initialize tracking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.InsuranceTracking.init();
        });
    } else {
        window.InsuranceTracking.init();
    }
    
    // Make trackEvent globally available
    window.trackEvent = function(eventType, eventData) {
        window.InsuranceTracking.trackEvent(eventType, eventData);
    };
})();