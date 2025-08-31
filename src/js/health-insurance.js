// Health Insurance Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeHealthInsurancePage();
});

function initializeHealthInsurancePage() {
    // Initialize plan selection
    initializeHealthPlanSelection();
    
    // Initialize provider search
    initializeProviderSearch();
    
    // Initialize health insurance application form
    initializeHealthApplicationForm();
    
    // Track page-specific interactions
    trackHealthInsuranceInteractions();
}

// Health Plan Selection
function selectHealthPlan(planType) {
    // Track plan selection
    trackEvent('health_plan_selected', {
        page: 'health_insurance',
        plan_type: planType,
        timestamp: new Date().toISOString()
    });
    
    // Scroll to application form
    const applicationSection = document.getElementById('apply');
    if (applicationSection) {
        applicationSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pre-select the plan in the form
        const planSelect = document.querySelector('select[name="planType"]');
        if (planSelect) {
            planSelect.value = planType;
            
            // Highlight the selected field
            planSelect.style.border = '2px solid #10b981';
            setTimeout(() => {
                planSelect.style.border = '';
            }, 2000);
        }
    }
}

// Initialize Health Plan Selection
function initializeHealthPlanSelection() {
    // Add comparison tracking
    const planCards = document.querySelectorAll('.plan-card');
    let comparedPlans = [];
    
    planCards.forEach(card => {
        let hoverStartTime;
        
        card.addEventListener('mouseenter', function() {
            hoverStartTime = Date.now();
            const planName = this.querySelector('h3').textContent;
            
            if (!comparedPlans.includes(planName)) {
                comparedPlans.push(planName);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const hoverDuration = Date.now() - hoverStartTime;
            const planName = this.querySelector('h3').textContent;
            
            if (hoverDuration > 2000) { // Track if hovered for more than 2 seconds
                trackEvent('health_plan_comparison', {
                    page: 'health_insurance',
                    plan_name: planName,
                    hover_duration: hoverDuration,
                    plans_compared: comparedPlans.length
                });
            }
        });
        
        // Track feature clicks within plan cards
        const features = card.querySelectorAll('.plan-features li');
        features.forEach(feature => {
            feature.style.cursor = 'pointer';
            feature.addEventListener('click', function(e) {
                e.stopPropagation();
                
                trackEvent('plan_feature_clicked', {
                    page: 'health_insurance',
                    plan: card.querySelector('h3').textContent,
                    feature: this.textContent
                });
                
                // Visual feedback
                this.style.background = '#e0e7ff';
                setTimeout(() => {
                    this.style.background = '';
                }, 300);
            });
        });
    });
}

// Provider Search
function initializeProviderSearch() {
    const searchButton = document.querySelector('.provider-search button');
    const searchInput = document.querySelector('.provider-search input');
    const providerTypeSelect = document.querySelector('.provider-search select');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const location = searchInput?.value || '';
            const providerType = providerTypeSelect?.value || 'all';
            
            performProviderSearch(location, providerType);
        });
    }
    
    // Track search input interactions
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            trackEvent('provider_search_focus', {
                page: 'health_insurance'
            });
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const providerType = providerTypeSelect?.value || 'all';
                performProviderSearch(this.value, providerType);
            }
        });
    }
}

function performProviderSearch(location, providerType) {
    if (!location) {
        alert('Please enter a location to search for providers');
        return;
    }
    
    // Track search
    trackEvent('provider_search', {
        page: 'health_insurance',
        location: location,
        provider_type: providerType
    });
    
    // Simulate search results
    showProviderSearchResults(location, providerType);
}

function showProviderSearchResults(location, providerType) {
    // Create results modal
    const resultsModal = document.createElement('div');
    resultsModal.className = 'provider-results-modal';
    resultsModal.innerHTML = `
        <div class="results-content">
            <span class="close-results" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3>Provider Search Results</h3>
            <p>Showing ${providerType === 'all' ? 'all providers' : providerType} near ${location}</p>
            
            <div class="results-list">
                <div class="provider-result">
                    <h4>City Medical Center</h4>
                    <p>📍 2.3 miles away</p>
                    <p>⭐ 4.8 rating (523 reviews)</p>
                    <p>✓ In-network</p>
                </div>
                <div class="provider-result">
                    <h4>Regional Health Clinic</h4>
                    <p>📍 3.7 miles away</p>
                    <p>⭐ 4.6 rating (341 reviews)</p>
                    <p>✓ In-network</p>
                </div>
                <div class="provider-result">
                    <h4>Community Care Center</h4>
                    <p>📍 5.1 miles away</p>
                    <p>⭐ 4.7 rating (287 reviews)</p>
                    <p>✓ In-network</p>
                </div>
            </div>
            
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Close Results</button>
        </div>
    `;
    
    // Add styles
    resultsModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const content = resultsModal.querySelector('.results-content');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    const closeBtn = resultsModal.querySelector('.close-results');
    closeBtn.style.cssText = `
        position: absolute;
        right: 1rem;
        top: 1rem;
        font-size: 2rem;
        cursor: pointer;
        color: #6b7280;
    `;
    
    const resultsList = resultsModal.querySelector('.results-list');
    resultsList.style.cssText = `
        margin: 2rem 0;
    `;
    
    const providerResults = resultsModal.querySelectorAll('.provider-result');
    providerResults.forEach(result => {
        result.style.cssText = `
            border: 1px solid #e5e7eb;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.3s;
        `;
        
        result.addEventListener('mouseenter', function() {
            this.style.background = '#f9fafb';
        });
        
        result.addEventListener('mouseleave', function() {
            this.style.background = 'white';
        });
        
        result.addEventListener('click', function() {
            const providerName = this.querySelector('h4').textContent;
            trackEvent('provider_selected', {
                page: 'health_insurance',
                provider: providerName,
                location: location
            });
            
            alert(`Selected: ${providerName}\nCall 1-800-SECURE-1 to schedule an appointment`);
        });
    });
    
    document.body.appendChild(resultsModal);
}

// Health Insurance Application Form
function initializeHealthApplicationForm() {
    const form = document.getElementById('healthApplicationForm');
    if (!form) return;
    
    // Handle coverage type change
    const coverageTypeSelect = form.querySelector('select[name="coverageType"]');
    if (coverageTypeSelect) {
        coverageTypeSelect.addEventListener('change', function() {
            toggleDependentsField(this.value);
        });
    }
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateHealthInsuranceForm(this)) {
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Track form submission
            trackEvent('health_insurance_application', {
                plan_type: data.planType,
                coverage_type: data.coverageType,
                dependents: data.dependents || 0,
                current_insurance: data.currentInsurance,
                has_conditions: !!data.conditions,
                state: data.state
            });
            
            // Store application
            storeHealthApplication(data);
            
            // Show success message
            showHealthApplicationSuccess(data);
            
            // Reset form
            this.reset();
        }
    });
    
    // Add SSN formatting
    const ssnField = form.querySelector('input[name="ssn"]');
    if (ssnField) {
        ssnField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 4 && value.length <= 6) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            } else if (value.length > 6) {
                value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5, 9);
            }
            e.target.value = value;
        });
    }
    
    // Add field validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateHealthInsuranceField(this);
        });
    });
}

function toggleDependentsField(coverageType) {
    const dependentsField = document.querySelector('input[name="dependents"]');
    if (dependentsField) {
        const formGroup = dependentsField.closest('.form-group');
        
        if (coverageType === 'family' || coverageType === 'couple') {
            formGroup.style.display = 'block';
            if (coverageType === 'family') {
                dependentsField.setAttribute('required', 'required');
            }
        } else {
            formGroup.style.display = 'none';
            dependentsField.removeAttribute('required');
            dependentsField.value = '';
        }
    }
}

function validateHealthInsuranceForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateHealthInsuranceField(field)) {
            isValid = false;
        }
    });
    
    // Validate SSN format
    const ssnField = form.querySelector('input[name="ssn"]');
    if (ssnField && ssnField.value) {
        const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
        if (!ssnRegex.test(ssnField.value)) {
            showFieldError(ssnField.closest('.form-group'), 'Please enter a valid SSN (XXX-XX-XXXX)');
            isValid = false;
        }
    }
    
    // Validate ZIP code
    const zipField = form.querySelector('input[name="zip"]');
    if (zipField && zipField.value) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(zipField.value)) {
            showFieldError(zipField.closest('.form-group'), 'Please enter a valid ZIP code');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateHealthInsuranceField(field) {
    const formGroup = field.closest('.form-group');
    
    // Reset error state
    if (formGroup) {
        formGroup.classList.remove('error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) errorMsg.textContent = '';
    }
    
    // Check required fields
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(formGroup, 'This field is required');
        return false;
    }
    
    return true;
}

function storeHealthApplication(data) {
    // Get existing applications
    let applications = JSON.parse(localStorage.getItem('health_insurance_applications') || '[]');
    
    // Add timestamp and ID
    data.timestamp = new Date().toISOString();
    data.applicationId = 'HEALTH_' + Date.now();
    data.status = 'pending_verification';
    
    // Mask SSN for storage
    if (data.ssn) {
        data.ssn = '***-**-' + data.ssn.slice(-4);
    }
    
    // Add to applications
    applications.push(data);
    
    // Store back to localStorage
    localStorage.setItem('health_insurance_applications', JSON.stringify(applications));
    
    console.log('Health insurance application stored:', data);
}

function showHealthApplicationSuccess(data) {
    // Create detailed success message
    const planNames = {
        'bronze': 'Bronze',
        'silver': 'Silver',
        'gold': 'Gold'
    };
    
    const coverageTypes = {
        'individual': 'Individual',
        'couple': 'Individual + Spouse',
        'family': 'Family'
    };
    
    const message = `
        <div style="text-align: left;">
            <h3 style="color: white; margin-bottom: 10px;">Health Insurance Application Received!</h3>
            <p style="margin: 5px 0;">Application ID: ${data.applicationId || 'HEALTH_' + Date.now()}</p>
            <p style="margin: 5px 0;">Plan: ${planNames[data.planType] || data.planType} Plan</p>
            <p style="margin: 5px 0;">Coverage: ${coverageTypes[data.coverageType] || data.coverageType}</p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.3);">
                <h4 style="color: white; margin-bottom: 10px;">Next Steps:</h4>
                <ol style="margin-left: 20px;">
                    <li>Verification call within 24 hours</li>
                    <li>Coverage can start as soon as next month</li>
                    <li>Check your email for plan documents</li>
                </ol>
            </div>
        </div>
    `;
    
    const successDiv = document.createElement('div');
    successDiv.innerHTML = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 450px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after 10 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 10000);
}

// Track Health Insurance Page Interactions
function trackHealthInsuranceInteractions() {
    // Track network stats interactions
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const statLabel = this.querySelector('.stat-label').textContent;
            const statNumber = this.querySelector('.stat-number').textContent;
            
            trackEvent('network_stat_clicked', {
                page: 'health_insurance',
                stat_type: statLabel,
                stat_value: statNumber
            });
            
            // Visual feedback
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });
    
    // Track section visibility and time
    let sectionTimers = {};
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.className;
            
            if (entry.isIntersecting) {
                sectionTimers[sectionId] = Date.now();
                
                trackEvent('section_entered', {
                    page: 'health_insurance',
                    section: sectionId
                });
            } else if (sectionTimers[sectionId]) {
                const timeSpent = Date.now() - sectionTimers[sectionId];
                
                if (timeSpent > 1000) { // Only track if spent more than 1 second
                    trackEvent('section_time_spent', {
                        page: 'health_insurance',
                        section: sectionId,
                        time_spent: timeSpent
                    });
                }
                
                delete sectionTimers[sectionId];
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe main sections
    document.querySelectorAll('.plans-section, .network-section, .application-section').forEach(section => {
        observer.observe(section);
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectHealthPlan,
        performProviderSearch,
        validateHealthInsuranceForm,
        storeHealthApplication
    };
}