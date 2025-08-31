// Life Insurance Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeLifeInsurancePage();
});

function initializeLifeInsurancePage() {
    // Initialize plan selection
    initializePlanSelection();
    
    // Initialize coverage calculator
    initializeCoverageCalculator();
    
    // Initialize life insurance application form
    initializeLifeApplicationForm();
    
    // Track page-specific interactions
    trackLifeInsuranceInteractions();
}

// Plan Selection Handler
function selectPlan(planType) {
    // Track plan selection
    trackEvent('plan_selected', {
        page: 'life_insurance',
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
            switch(planType) {
                case 'term-life':
                    planSelect.value = 'term';
                    break;
                case 'whole-life':
                    planSelect.value = 'whole';
                    break;
                case 'universal-life':
                    planSelect.value = 'universal';
                    break;
            }
            
            // Show/hide term length field
            toggleTermLengthField(planSelect.value);
            
            // Highlight the selected field
            planSelect.style.border = '2px solid #2563eb';
            setTimeout(() => {
                planSelect.style.border = '';
            }, 2000);
        }
    }
}

// Initialize Plan Selection
function initializePlanSelection() {
    // Add hover tracking for plan cards
    document.querySelectorAll('.plan-card').forEach(card => {
        let hoverStartTime;
        
        card.addEventListener('mouseenter', function() {
            hoverStartTime = Date.now();
        });
        
        card.addEventListener('mouseleave', function() {
            const hoverDuration = Date.now() - hoverStartTime;
            const planName = this.querySelector('h3').textContent;
            
            if (hoverDuration > 1000) { // Only track if hovered for more than 1 second
                trackEvent('plan_card_hover', {
                    page: 'life_insurance',
                    plan_name: planName,
                    hover_duration: hoverDuration
                });
            }
        });
    });
}

// Coverage Calculator
function calculateCoverage() {
    const annualIncome = parseFloat(document.getElementById('annual-income').value) || 0;
    const yearsReplace = parseFloat(document.getElementById('years-replace').value) || 10;
    const debts = parseFloat(document.getElementById('debts').value) || 0;
    const futureExpenses = parseFloat(document.getElementById('future-expenses').value) || 0;
    
    // Calculate recommended coverage
    const incomeReplacement = annualIncome * yearsReplace;
    const totalCoverage = incomeReplacement + debts + futureExpenses;
    
    // Display result
    const resultDiv = document.getElementById('calc-result');
    const coverageAmount = resultDiv.querySelector('.coverage-amount');
    
    if (totalCoverage > 0) {
        coverageAmount.textContent = '$' + totalCoverage.toLocaleString();
        resultDiv.style.display = 'block';
        
        // Track calculation
        trackEvent('coverage_calculated', {
            page: 'life_insurance',
            annual_income: annualIncome,
            years_to_replace: yearsReplace,
            debts: debts,
            future_expenses: futureExpenses,
            recommended_coverage: totalCoverage
        });
        
        // Animate the result
        resultDiv.style.animation = 'slideIn 0.5s ease';
    }
}

function applyForCoverage() {
    const coverageAmount = document.querySelector('.coverage-amount').textContent;
    
    // Track apply button click from calculator
    trackEvent('apply_from_calculator', {
        page: 'life_insurance',
        calculated_amount: coverageAmount
    });
    
    // Scroll to application form
    const applicationSection = document.getElementById('apply');
    if (applicationSection) {
        applicationSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pre-fill coverage amount if possible
        const coverageSelect = document.querySelector('select[name="coverageAmount"]');
        if (coverageSelect) {
            const amount = parseInt(coverageAmount.replace(/\D/g, ''));
            
            // Find closest coverage option
            const options = Array.from(coverageSelect.options);
            let closestOption = options[1]; // Default to first real option
            
            options.forEach(option => {
                if (option.value && parseInt(option.value) <= amount) {
                    closestOption = option;
                }
            });
            
            coverageSelect.value = closestOption.value;
            
            // Highlight the field
            coverageSelect.style.border = '2px solid #10b981';
            setTimeout(() => {
                coverageSelect.style.border = '';
            }, 2000);
        }
    }
}

// Initialize Coverage Calculator
function initializeCoverageCalculator() {
    const calculatorInputs = document.querySelectorAll('.calculator-form input');
    
    calculatorInputs.forEach(input => {
        // Track calculator input interactions
        input.addEventListener('focus', function() {
            trackEvent('calculator_field_focus', {
                page: 'life_insurance',
                field: this.id
            });
        });
        
        // Auto-calculate on input change
        input.addEventListener('input', function() {
            // Debounce calculation
            clearTimeout(this.calcTimeout);
            this.calcTimeout = setTimeout(() => {
                const allInputs = document.querySelectorAll('.calculator-form input');
                const hasValues = Array.from(allInputs).some(input => input.value);
                
                if (hasValues) {
                    calculateCoverage();
                }
            }, 500);
        });
    });
}

// Life Insurance Application Form
function initializeLifeApplicationForm() {
    const form = document.getElementById('lifeApplicationForm');
    if (!form) return;
    
    // Handle plan type change
    const planTypeSelect = form.querySelector('select[name="planType"]');
    if (planTypeSelect) {
        planTypeSelect.addEventListener('change', function() {
            toggleTermLengthField(this.value);
        });
    }
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateLifeInsuranceForm(this)) {
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Track form submission
            trackEvent('life_insurance_application', {
                plan_type: data.planType,
                coverage_amount: data.coverageAmount,
                term_length: data.termLength || null,
                tobacco_use: data.tobacco,
                has_health_conditions: !!data.healthConditions
            });
            
            // Store application
            storeLifeApplication(data);
            
            // Show success message
            showApplicationSuccess(data);
            
            // Reset form
            this.reset();
        }
    });
    
    // Add field validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateLifeInsuranceField(this);
        });
    });
}

function toggleTermLengthField(planType) {
    const termLengthDiv = document.getElementById('termLength');
    if (termLengthDiv) {
        if (planType === 'term') {
            termLengthDiv.style.display = 'block';
            termLengthDiv.querySelector('select').setAttribute('required', 'required');
        } else {
            termLengthDiv.style.display = 'none';
            termLengthDiv.querySelector('select').removeAttribute('required');
        }
    }
}

function validateLifeInsuranceForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateLifeInsuranceField(field)) {
            isValid = false;
        }
    });
    
    // Additional validation for date of birth
    const dobField = form.querySelector('input[name="dob"]');
    if (dobField && dobField.value) {
        const dob = new Date(dobField.value);
        const age = calculateAge(dob);
        
        if (age < 18 || age > 85) {
            showFieldError(dobField.closest('.form-group'), 'Age must be between 18 and 85');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateLifeInsuranceField(field) {
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

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

function storeLifeApplication(data) {
    // Get existing applications
    let applications = JSON.parse(localStorage.getItem('life_insurance_applications') || '[]');
    
    // Add timestamp and ID
    data.timestamp = new Date().toISOString();
    data.applicationId = 'LIFE_' + Date.now();
    data.status = 'pending_review';
    
    // Add to applications
    applications.push(data);
    
    // Store back to localStorage
    localStorage.setItem('life_insurance_applications', JSON.stringify(applications));
    
    console.log('Life insurance application stored:', data);
}

function showApplicationSuccess(data) {
    // Create detailed success message
    const message = `
        <div style="text-align: left;">
            <h3 style="color: white; margin-bottom: 10px;">Application Submitted Successfully!</h3>
            <p style="margin: 5px 0;">Application ID: ${data.applicationId || 'LIFE_' + Date.now()}</p>
            <p style="margin: 5px 0;">Plan: ${data.planType?.toUpperCase()} Life Insurance</p>
            <p style="margin: 5px 0;">Coverage: $${parseInt(data.coverageAmount).toLocaleString()}</p>
            <p style="margin: 10px 0 0 0;">Our team will contact you within 24-48 hours.</p>
        </div>
    `;
    
    const successDiv = document.createElement('div');
    successDiv.innerHTML = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #10b981;
        color: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after 7 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 7000);
}

// Track Life Insurance Page Interactions
function trackLifeInsuranceInteractions() {
    // Track time spent on different sections
    let sectionTimers = {};
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.id || entry.target.className;
            
            if (entry.isIntersecting) {
                sectionTimers[sectionId] = Date.now();
            } else if (sectionTimers[sectionId]) {
                const timeSpent = Date.now() - sectionTimers[sectionId];
                
                trackEvent('section_time_spent', {
                    page: 'life_insurance',
                    section: sectionId,
                    time_spent: timeSpent
                });
                
                delete sectionTimers[sectionId];
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe main sections
    document.querySelectorAll('.plans-section, .calculator-section, .application-section').forEach(section => {
        observer.observe(section);
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectPlan,
        calculateCoverage,
        applyForCoverage,
        validateLifeInsuranceForm
    };
}