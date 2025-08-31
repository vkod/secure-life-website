// Page template generator for remaining insurance plan pages

const pageTemplates = {
    // Health Insurance Pages
    'family-health': {
        title: 'Family Health Insurance',
        tagline: 'Complete healthcare coverage for your entire family',
        badge: 'Family Coverage',
        highlights: ['Coverage for all ages', 'Pediatric care included', 'Family deductibles'],
        image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600',
        details: 'Comprehensive family health plans starting at $450/month'
    },
    'senior-health': {
        title: 'Senior Health Insurance',
        tagline: 'Specialized healthcare for ages 65+',
        badge: 'Medicare Supplement',
        highlights: ['Medicare coordination', 'Prescription coverage', 'Chronic care management'],
        image: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600',
        details: 'Enhanced coverage beyond Medicare'
    },
    'dental-vision': {
        title: 'Dental & Vision Insurance',
        tagline: 'Complete oral and eye care coverage',
        badge: 'Supplemental Coverage',
        highlights: ['Dental cleanings', 'Eye exams', 'Frames & lenses'],
        image: 'https://images.unsplash.com/photo-1609207825181-52d3214556dd?w=600',
        details: 'Affordable dental and vision plans from $25/month'
    },
    
    // Auto Insurance Pages
    'comprehensive-auto': {
        title: 'Comprehensive Auto Insurance',
        tagline: 'Full protection for your vehicle',
        badge: 'Complete Coverage',
        highlights: ['Collision & comprehensive', 'Liability protection', 'Roadside assistance'],
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600',
        details: 'Complete auto protection with all coverage types'
    },
    'collision': {
        title: 'Collision Coverage',
        tagline: 'Protection for accident damage',
        badge: 'Accident Protection',
        highlights: ['Accident damage', 'Hit and run', 'Single car accidents'],
        image: 'https://images.unsplash.com/photo-1582624267249-037e18e6f3e6?w=600',
        details: 'Coverage for damage from collisions'
    },
    'liability': {
        title: 'Liability Insurance',
        tagline: 'Required coverage for all drivers',
        badge: 'State Required',
        highlights: ['Bodily injury', 'Property damage', 'Legal protection'],
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600',
        details: 'Minimum required auto insurance'
    },
    'uninsured': {
        title: 'Uninsured Motorist Coverage',
        tagline: 'Protection from uninsured drivers',
        badge: 'Extra Protection',
        highlights: ['Hit and run coverage', 'Underinsured drivers', 'Medical payments'],
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600',
        details: 'Protection when other drivers lack insurance'
    },
    
    // Home Insurance Pages
    'homeowners': {
        title: 'Homeowners Insurance',
        tagline: 'Complete protection for your home',
        badge: 'Homeowner Protection',
        highlights: ['Dwelling coverage', 'Personal property', 'Liability protection'],
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600',
        details: 'Comprehensive coverage for homeowners'
    },
    'renters': {
        title: 'Renters Insurance',
        tagline: 'Affordable protection for renters',
        badge: 'Tenant Coverage',
        highlights: ['Personal property', 'Liability coverage', 'Additional living expenses'],
        image: 'https://images.unsplash.com/photo-1565183928294-7d21b36c9c24?w=600',
        details: 'Protect your belongings from $15/month'
    },
    'condo': {
        title: 'Condo Insurance',
        tagline: 'Specialized coverage for condo owners',
        badge: 'Condo Protection',
        highlights: ['Unit coverage', 'HOA gap coverage', 'Personal property'],
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
        details: 'Coverage designed for condo living'
    },
    'flood': {
        title: 'Flood Insurance',
        tagline: 'Protection from water damage',
        badge: 'Flood Protection',
        highlights: ['Flood damage', 'Storm surge', 'Groundwater backup'],
        image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600',
        details: 'Essential coverage for flood-prone areas'
    },
    
    // Travel Insurance Pages
    'international': {
        title: 'International Travel Insurance',
        tagline: 'Worldwide travel protection',
        badge: 'Global Coverage',
        highlights: ['Medical emergencies', 'Trip cancellation', 'Lost luggage'],
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
        details: 'Coverage for international travel'
    },
    'domestic': {
        title: 'Domestic Travel Insurance',
        tagline: 'Protection for trips within the country',
        badge: 'Domestic Coverage',
        highlights: ['Trip interruption', 'Medical coverage', 'Rental car protection'],
        image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600',
        details: 'Coverage for domestic travel'
    },
    'medical': {
        title: 'Travel Medical Insurance',
        tagline: 'Emergency medical coverage abroad',
        badge: 'Medical Focus',
        highlights: ['Emergency medical', 'Medical evacuation', 'Repatriation'],
        image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600',
        details: 'Medical-focused travel protection'
    },
    'cancellation': {
        title: 'Trip Cancellation Insurance',
        tagline: 'Protection for non-refundable trips',
        badge: 'Cancellation Coverage',
        highlights: ['Trip cancellation', 'Trip interruption', 'Cancel for any reason'],
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600',
        details: 'Protect your travel investment'
    },
    
    // Business Insurance Pages
    'general-liability': {
        title: 'General Liability Insurance',
        tagline: 'Essential business protection',
        badge: 'Business Essential',
        highlights: ['Third-party injuries', 'Property damage', 'Legal defense'],
        image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600',
        details: 'Core liability coverage for businesses'
    },
    'professional-liability': {
        title: 'Professional Liability Insurance',
        tagline: 'Errors & omissions coverage',
        badge: 'E&O Coverage',
        highlights: ['Professional mistakes', 'Negligence claims', 'Legal costs'],
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
        details: 'Protection for professional services'
    },
    'business-property': {
        title: 'Business Property Insurance',
        tagline: 'Protect your business assets',
        badge: 'Property Protection',
        highlights: ['Buildings', 'Equipment', 'Inventory'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
        details: 'Coverage for business property'
    },
    'workers-comp': {
        title: 'Workers Compensation',
        tagline: 'Employee injury protection',
        badge: 'Employee Coverage',
        highlights: ['Medical expenses', 'Lost wages', 'Disability benefits'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
        details: 'Required coverage for employees'
    }
};

// Function to generate HTML for each page type
function generatePageHTML(key, data) {
    const folder = key.includes('health') ? 'health' : 
                  key.includes('auto') || key.includes('collision') || key.includes('liability') || key.includes('uninsured') ? 'auto' :
                  key.includes('home') || key.includes('renters') || key.includes('condo') || key.includes('flood') ? 'home' :
                  key.includes('travel') || key.includes('international') || key.includes('domestic') || key.includes('medical') || key.includes('cancellation') ? 'travel' :
                  'business';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} - SecureLife Insurance</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="stylesheet" href="../../css/plan-details.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar" data-track="navigation">
        <div class="container">
            <div class="nav-wrapper">
                <div class="logo">
                    <a href="../../index.html" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <circle cx="20" cy="20" r="18" stroke="#2563eb" stroke-width="2"/>
                            <path d="M20 10V30M10 20H30" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <span>SecureLife</span>
                    </a>
                </div>
                <ul class="nav-menu">
                    <li><a href="../../index.html">Home</a></li>
                    <li><a href="../../index.html#products">Products</a></li>
                    <li><a href="../../index.html#gpt">SecureLife GPT</a></li>
                    <li><a href="../../index.html#contact">Contact</a></li>
                    <li><a href="#" class="btn-quote" onclick="openQuoteModal()">Get Quote</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Plan Hero Section -->
    <section class="plan-hero" data-track-view="${key}-hero">
        <div class="container">
            <div class="plan-hero-content">
                <div class="plan-hero-text">
                    <div class="plan-badge">${data.badge}</div>
                    <h1>${data.title}</h1>
                    <p class="plan-tagline">${data.tagline}</p>
                    <div class="plan-highlights">
                        ${data.highlights.map(h => `
                        <div class="highlight-item">
                            <span class="highlight-icon">✓</span>
                            <span>${h}</span>
                        </div>`).join('')}
                    </div>
                    <div class="hero-actions">
                        <button class="btn btn-primary btn-lg" onclick="startApplication('${key}')" data-track-click="start-${key}-app">Apply Now</button>
                        <button class="btn btn-secondary btn-lg" onclick="downloadBrochure('${key}')" data-track-click="download-${key}-brochure">
                            <span>📥</span> Download Brochure
                        </button>
                        <button class="btn btn-outline btn-lg" onclick="scheduleConsultation('${key}')" data-track-click="schedule-consultation">
                            <span>📞</span> Talk to Expert
                        </button>
                    </div>
                </div>
                <div class="plan-hero-image">
                    <img src="${data.image}" alt="${data.title}">
                </div>
            </div>
        </div>
    </section>

    <!-- Plan Details -->
    <section class="plan-details" data-track-view="${key}-details">
        <div class="container">
            <div class="details-card">
                <h2>Coverage Details</h2>
                <p>${data.details}</p>
                <div style="margin-top: 2rem;">
                    <h3>Key Features</h3>
                    <ul class="benefits-list">
                        ${data.highlights.map(h => `
                        <li>
                            <span class="benefit-icon">✓</span>
                            <div>
                                <strong>${h}</strong>
                                <p>Comprehensive coverage included in your plan</p>
                            </div>
                        </li>`).join('')}
                    </ul>
                </div>
            </div>

            <!-- CTA -->
            <div class="cta-content" style="text-align: center; margin-top: 3rem; padding: 2rem; background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); border-radius: 12px;">
                <h2>Ready to Get Started?</h2>
                <p>Get your personalized quote in minutes</p>
                <div class="cta-buttons" style="margin-top: 1.5rem;">
                    <button class="btn btn-primary btn-lg" onclick="startApplication('${key}')" data-track-click="cta-apply">Apply Now</button>
                    <button class="btn btn-secondary btn-lg" onclick="openChatGPT('${key}')" data-track-click="cta-chat">Ask SecureLife GPT</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-column">
                    <h4>SecureLife Insurance</h4>
                    <p>Your trusted partner since 1970.</p>
                </div>
                <div class="footer-column">
                    <h5>Contact</h5>
                    <p>📞 1-800-SECURE-1</p>
                    <p>✉️ info@securelife.com</p>
                </div>
            </div>
        </div>
    </footer>

    <script src="../../js/tracking.js"></script>
    <script src="../../js/main.js"></script>
    <script src="../../js/plan-details.js"></script>
    <script src="../../js/brochure-generator.js"></script>
    <script src="../../js/gpt-chat.js"></script>
</body>
</html>`;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { pageTemplates, generatePageHTML };
}

// Log all pages that need to be created
console.log('Pages to create:', Object.keys(pageTemplates));