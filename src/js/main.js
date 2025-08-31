// Main JavaScript for Insurance Website

// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form handlers
    initializeLeadForm();
    initializeQuickQuoteForm();
    initializeMobileMenu();
    initializeScrollEffects();
});

// Lead Form Handler
function initializeLeadForm() {
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // Track form submission
                trackEvent('form_submit', {
                    form_id: 'leadForm',
                    form_type: 'main_lead',
                    insurance_type: data.insuranceType,
                    coverage_amount: data.coverage
                });
                
                // Simulate form submission
                console.log('Lead Form Submitted:', data);
                
                // Store lead data
                storeLead(data);
                
                // Show success message
                showSuccessMessage('Thank you! We\'ll contact you within 24 hours.');
                
                // Reset form
                this.reset();
            }
        });
        
        // Add real-time validation
        const inputs = leadForm.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

// Quick Quote Form Handler
function initializeQuickQuoteForm() {
    const quickQuoteForm = document.getElementById('quickQuoteForm');
    if (quickQuoteForm) {
        quickQuoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // Track form submission
                trackEvent('form_submit', {
                    form_id: 'quickQuoteForm',
                    form_type: 'quick_quote',
                    insurance_type: data.quickType
                });
                
                // Store lead data
                storeLead(data);
                
                // Show success message
                showSuccessMessage('Quote request received! Check your email.');
                
                // Close modal
                closeQuoteModal();
                
                // Reset form
                this.reset();
            }
        });
    }
}

// Form Validation
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    // Reset error state
    formGroup.classList.remove('error');
    if (errorMessage) {
        errorMessage.textContent = '';
    }
    
    // Check if field is empty
    if (!field.value.trim()) {
        showFieldError(formGroup, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showFieldError(formGroup, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel') {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(field.value) || field.value.replace(/\D/g, '').length < 10) {
            showFieldError(formGroup, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Age validation
    if (field.name === 'age') {
        const age = parseInt(field.value);
        if (age < 18 || age > 100) {
            showFieldError(formGroup, 'Age must be between 18 and 100');
            return false;
        }
    }
    
    return true;
}

function showFieldError(formGroup, message) {
    formGroup.classList.add('error');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}

// Modal Functions
function openQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Track modal open
        trackEvent('modal_open', {
            modal_id: 'quoteModal',
            modal_type: 'quick_quote'
        });
    }
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Track modal close
        trackEvent('modal_close', {
            modal_id: 'quoteModal',
            modal_type: 'quick_quote'
        });
    }
}

// Click outside modal to close
window.onclick = function(event) {
    const modal = document.getElementById('quoteModal');
    if (event.target === modal) {
        closeQuoteModal();
    }
}

// Mobile Menu and Dropdown Management
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Track mobile menu toggle
            trackEvent('mobile_menu_toggle', {
                action: navMenu.classList.contains('active') ? 'open' : 'close'
            });
        });
    }
    
    // Initialize dropdown menu management
    initializeDropdownMenu();
}

// Dropdown Menu Management
function initializeDropdownMenu() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const navLinks = document.querySelectorAll('.nav-menu > li > a');
    let isDropdownOpen = false;
    let hoverTimeout;
    
    if (dropdown && dropdownContent) {
        // Handle dropdown toggle on click (for mobile/tablet)
        const dropdownToggle = dropdown.querySelector('a');
        
        dropdownToggle.addEventListener('click', function(e) {
            // Only prevent default and toggle on mobile/tablet
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                isDropdownOpen = !isDropdownOpen;
                dropdown.classList.toggle('show');
            }
        });
        
        // Close dropdown when clicking any nav item (including Home)
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // If it's not the Products dropdown toggle or if it's an anchor link
                if (!link.parentElement.classList.contains('dropdown') || link.getAttribute('href').startsWith('#')) {
                    dropdown.classList.remove('show');
                    isDropdownOpen = false;
                    
                    // Force close the dropdown by removing hover state
                    clearTimeout(hoverTimeout);
                    dropdownContent.style.opacity = '0';
                    dropdownContent.style.visibility = 'hidden';
                    dropdownContent.style.pointerEvents = 'none';
                    
                    // Reset after transition
                    setTimeout(() => {
                        dropdownContent.style.opacity = '';
                        dropdownContent.style.visibility = '';
                        dropdownContent.style.pointerEvents = '';
                    }, 300);
                }
            });
        });
        
        // Also close when clicking dropdown menu items
        const dropdownLinks = dropdownContent.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                dropdown.classList.remove('show');
                isDropdownOpen = false;
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
                isDropdownOpen = false;
            }
        });
        
        // Handle hover for desktop with delay
        if (window.innerWidth > 1024) {
            dropdown.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                dropdown.classList.add('show');
            });
            
            dropdown.addEventListener('mouseleave', function() {
                // Add a small delay before closing
                hoverTimeout = setTimeout(() => {
                    dropdown.classList.remove('show');
                }, 100);
            });
            
            // Keep dropdown open when hovering over the content
            dropdownContent.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
            });
            
            dropdownContent.addEventListener('mouseleave', function() {
                hoverTimeout = setTimeout(() => {
                    dropdown.classList.remove('show');
                }, 100);
            });
        }
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Track anchor click
                trackEvent('anchor_click', {
                    target: this.getAttribute('href')
                });
            }
        });
    });
    
    // Navbar shadow on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

// Helper function to scroll to products
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Success Message
function showSuccessMessage(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 5000);
}

// Store Lead Data (Simulation)
function storeLead(data) {
    // Get existing leads from localStorage
    let leads = JSON.parse(localStorage.getItem('insurance_leads') || '[]');
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    data.id = Date.now().toString();
    
    // Add to leads array
    leads.push(data);
    
    // Store back to localStorage
    localStorage.setItem('insurance_leads', JSON.stringify(leads));
    
    console.log('Lead stored:', data);
    console.log('Total leads:', leads.length);
}

// Get stored leads (for testing)
function getStoredLeads() {
    return JSON.parse(localStorage.getItem('insurance_leads') || '[]');
}

// Clear stored leads (for testing)
function clearStoredLeads() {
    localStorage.removeItem('insurance_leads');
    console.log('All leads cleared');
}