// Plan Details Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePlanDetails();
});

function initializePlanDetails() {
    // Initialize FAQ accordion
    initializeFAQ();
    
    // Initialize premium calculator
    initializePremiumCalculator();
    
    // Track page interactions
    trackPlanPageInteractions();
    
    // Initialize comparison tool
    initializeComparisonTool();
}

// FAQ Accordion
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            // Track FAQ interaction
            trackEvent('faq_interaction', {
                question: question.querySelector('h3').textContent,
                action: item.classList.contains('active') ? 'opened' : 'closed',
                page: window.location.pathname
            });
        });
    });
}

// Premium Calculator
function calculatePremium(planType) {
    const age = parseInt(document.getElementById('calc-age').value);
    const gender = document.getElementById('calc-gender').value;
    const health = document.getElementById('calc-health').value;
    const coverage = parseInt(document.getElementById('calc-coverage').value);
    const tobacco = document.getElementById('calc-tobacco').value;
    
    let basePremium = 0;
    
    // Base calculation based on plan type
    if (planType === 'term-life') {
        const term = parseInt(document.getElementById('calc-term').value);
        basePremium = (coverage / 10000) * 0.5; // Base rate
        
        // Age factor
        if (age < 30) basePremium *= 0.8;
        else if (age < 40) basePremium *= 1;
        else if (age < 50) basePremium *= 1.5;
        else if (age < 60) basePremium *= 2.5;
        else basePremium *= 4;
        
        // Term factor
        if (term === 10) basePremium *= 0.8;
        else if (term === 20) basePremium *= 1;
        else basePremium *= 1.3;
    } else if (planType === 'whole-life') {
        basePremium = (coverage / 10000) * 2; // Higher base for whole life
        
        // Age factor (more aggressive for whole life)
        if (age < 30) basePremium *= 1;
        else if (age < 40) basePremium *= 1.5;
        else if (age < 50) basePremium *= 2.5;
        else basePremium *= 4;
    }
    
    // Gender factor
    if (gender === 'male') basePremium *= 1.2;
    
    // Health factor
    if (health === 'excellent') basePremium *= 0.9;
    else if (health === 'good') basePremium *= 1;
    else basePremium *= 1.4;
    
    // Tobacco factor
    if (tobacco === 'yes') basePremium *= 2.5;
    
    // Round to nearest dollar
    basePremium = Math.round(basePremium);
    
    // Display result
    displayPremiumResult(basePremium);
    
    // Track calculation
    trackEvent('premium_calculated', {
        plan_type: planType,
        age: age,
        coverage: coverage,
        premium: basePremium,
        page: window.location.pathname
    });
}

function displayPremiumResult(premium) {
    const resultDiv = document.getElementById('premium-result');
    const amountDiv = resultDiv.querySelector('.premium-amount');
    
    // Animate the premium display
    resultDiv.style.display = 'block';
    let currentValue = 0;
    const increment = premium / 20;
    
    const animation = setInterval(() => {
        currentValue += increment;
        if (currentValue >= premium) {
            currentValue = premium;
            clearInterval(animation);
        }
        amountDiv.textContent = '$' + Math.round(currentValue);
    }, 50);
}

function applyWithCalculatedPremium() {
    const premium = document.querySelector('.premium-amount').textContent;
    
    // Track apply action
    trackEvent('apply_with_premium', {
        calculated_premium: premium,
        page: window.location.pathname
    });
    
    // Store calculated data
    const calculatorData = {
        age: document.getElementById('calc-age').value,
        gender: document.getElementById('calc-gender').value,
        health: document.getElementById('calc-health').value,
        coverage: document.getElementById('calc-coverage').value,
        tobacco: document.getElementById('calc-tobacco').value,
        premium: premium
    };
    
    sessionStorage.setItem('calculator_data', JSON.stringify(calculatorData));
    
    // Redirect to application
    startApplication(window.location.pathname.split('/').pop().replace('.html', ''));
}

// Initialize Premium Calculator
function initializePremiumCalculator() {
    const calculatorInputs = document.querySelectorAll('.calc-input input, .calc-input select');
    
    calculatorInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Track calculator input
            trackEvent('calculator_input_changed', {
                field: this.id,
                value: this.value,
                page: window.location.pathname
            });
        });
    });
}

// Start Application
function startApplication(planType) {
    // Track application start
    trackEvent('application_started', {
        plan_type: planType,
        source: 'plan_details_page',
        page: window.location.pathname
    });
    
    // Create application modal
    createApplicationModal(planType);
}

function createApplicationModal(planType) {
    const modal = document.createElement('div');
    modal.className = 'application-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Start Your Application</h2>
            <p>You're about to begin your ${planType.replace('-', ' ')} insurance application.</p>
            
            <div class="app-options">
                <div class="app-option">
                    <h3>🚀 Quick Application</h3>
                    <p>Complete in 5 minutes</p>
                    <ul>
                        <li>Basic information only</li>
                        <li>Instant quote</li>
                        <li>No medical exam for amounts under $500K</li>
                    </ul>
                    <button class="btn btn-primary" onclick="startQuickApp('${planType}')">Start Quick App</button>
                </div>
                
                <div class="app-option">
                    <h3>📋 Full Application</h3>
                    <p>Complete in 15 minutes</p>
                    <ul>
                        <li>Detailed health questions</li>
                        <li>Best rates available</li>
                        <li>Higher coverage limits</li>
                    </ul>
                    <button class="btn btn-secondary" onclick="startFullApp('${planType}')">Start Full App</button>
                </div>
            </div>
            
            <div class="app-footer">
                <p>Need help? Call <strong>1-800-SECURE-1</strong> or <a href="#" onclick="openGPTChat()">chat with SecureLife GPT</a></p>
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
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
    
    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 700px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    `;
    
    const appOptions = modal.querySelector('.app-options');
    appOptions.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin: 2rem 0;
    `;
    
    const appOption = modal.querySelectorAll('.app-option');
    appOption.forEach(option => {
        option.style.cssText = `
            border: 1px solid #e5e7eb;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
        `;
    });
    
    document.body.appendChild(modal);
}

function startQuickApp(planType) {
    window.location.href = `/quick-application.html?plan=${planType}`;
}

function startFullApp(planType) {
    window.location.href = `/full-application.html?plan=${planType}`;
}

// Schedule Consultation
function scheduleConsultation(planType) {
    // Track consultation request
    trackEvent('consultation_requested', {
        plan_type: planType,
        page: window.location.pathname
    });
    
    // Create consultation modal
    const modal = document.createElement('div');
    modal.className = 'consultation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Schedule a Free Consultation</h2>
            <p>Our insurance experts are ready to help you find the perfect coverage.</p>
            
            <form class="consultation-form">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>Phone *</label>
                    <input type="tel" required>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" required>
                </div>
                <div class="form-group">
                    <label>Preferred Date</label>
                    <input type="date" min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>Preferred Time</label>
                    <select>
                        <option>Morning (9AM - 12PM)</option>
                        <option>Afternoon (12PM - 5PM)</option>
                        <option>Evening (5PM - 8PM)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Topics to Discuss</label>
                    <textarea rows="3" placeholder="What would you like to discuss?"></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Schedule Consultation</button>
            </form>
        </div>
    `;
    
    modal.style.cssText = `
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
    
    document.body.appendChild(modal);
    
    // Handle form submission
    modal.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        this.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="color: #10b981;">✓ Consultation Scheduled!</h3>
                <p>We'll call you within 24 hours to confirm your appointment.</p>
                <button class="btn btn-primary" onclick="this.closest('.consultation-modal').remove()">Close</button>
            </div>
        `;
        
        // Track submission
        trackEvent('consultation_scheduled', {
            plan_type: planType
        });
    });
}

// Comparison Tool
function initializeComparisonTool() {
    // Create comparison button if on a plan page
    if (window.location.pathname.includes('/plans/')) {
        const compareBtn = document.createElement('div');
        compareBtn.className = 'compare-float-btn';
        compareBtn.innerHTML = `
            <span>⚖️</span>
            <span>Compare Plans</span>
        `;
        compareBtn.onclick = openComparisonTool;
        compareBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: #2563eb;
            color: white;
            padding: 12px 20px;
            border-radius: 30px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 999;
            transition: all 0.3s;
        `;
        
        compareBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        compareBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(compareBtn);
    }
}

function openComparisonTool() {
    // Track comparison tool open
    trackEvent('comparison_tool_opened', {
        page: window.location.pathname
    });
    
    // For now, redirect to a comparison page
    // In a real implementation, this would open a modal or side-by-side comparison
    alert('Comparison tool will open here. You can compare different insurance plans side by side.');
}

// Track Plan Page Interactions
function trackPlanPageInteractions() {
    // Track rider hover
    document.querySelectorAll('.rider-card').forEach(card => {
        let hoverStart;
        
        card.addEventListener('mouseenter', function() {
            hoverStart = Date.now();
        });
        
        card.addEventListener('mouseleave', function() {
            const duration = Date.now() - hoverStart;
            if (duration > 1000) {
                trackEvent('rider_hover', {
                    rider: this.querySelector('h3').textContent,
                    duration: duration,
                    page: window.location.pathname
                });
            }
        });
        
        card.addEventListener('click', function() {
            trackEvent('rider_clicked', {
                rider: this.querySelector('h3').textContent,
                page: window.location.pathname
            });
            
            // Show rider details
            alert(`${this.querySelector('h3').textContent}\n\n${this.querySelector('p').textContent}\n\nCost: ${this.querySelector('.rider-cost').textContent}`);
        });
    });
    
    // Track time on page sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.dataset.viewStart = Date.now();
            } else if (entry.target.dataset.viewStart) {
                const viewDuration = Date.now() - parseInt(entry.target.dataset.viewStart);
                
                trackEvent('section_view_time', {
                    section: entry.target.className,
                    duration: viewDuration,
                    page: window.location.pathname
                });
                
                delete entry.target.dataset.viewStart;
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe main sections
    document.querySelectorAll('.plan-details > div').forEach(section => {
        observer.observe(section);
    });
}

// Open Chat with Plan Context
function openChatGPT(planType) {
    if (typeof openGPTChat === 'function') {
        openGPTChat();
        
        // Send context message after a short delay
        setTimeout(() => {
            if (typeof gptChat !== 'undefined' && gptChat.sendSuggestion) {
                gptChat.sendSuggestion(`Tell me more about ${planType.replace('-', ' ')} insurance`);
            }
        }, 500);
    }
}