// Brochure Generator for Insurance Plans

class BrochureGenerator {
    constructor() {
        this.brochures = this.initializeBrochures();
    }

    initializeBrochures() {
        return {
            'term-life': {
                title: 'Term Life Insurance',
                subtitle: 'Affordable Protection for Your Loved Ones',
                content: {
                    overview: 'Term life insurance provides coverage for a specific period, offering maximum protection at the lowest cost.',
                    benefits: [
                        'Coverage periods of 10, 20, or 30 years',
                        'Death benefit from $100,000 to $2,000,000',
                        'Fixed premiums throughout the term',
                        'Convertible to permanent coverage',
                        'No medical exam options available'
                    ],
                    pricing: {
                        '25-year-old': '$15-25/month',
                        '35-year-old': '$25-45/month',
                        '45-year-old': '$45-85/month'
                    },
                    riders: [
                        'Accelerated Death Benefit',
                        'Waiver of Premium',
                        'Child Term Rider',
                        'Return of Premium'
                    ]
                }
            },
            'whole-life': {
                title: 'Whole Life Insurance',
                subtitle: 'Lifetime Coverage with Investment Benefits',
                content: {
                    overview: 'Whole life insurance provides permanent protection with a cash value component that grows over time.',
                    benefits: [
                        'Guaranteed lifetime coverage',
                        'Cash value accumulation',
                        'Fixed premiums for life',
                        'Tax-deferred growth',
                        'Loan and withdrawal options'
                    ],
                    pricing: {
                        '25-year-old': '$85-150/month',
                        '35-year-old': '$150-250/month',
                        '45-year-old': '$250-400/month'
                    }
                }
            },
            'health-insurance': {
                title: 'Health Insurance Plans',
                subtitle: 'Comprehensive Medical Coverage',
                content: {
                    overview: 'Choose from Bronze, Silver, or Gold plans to match your healthcare needs and budget.',
                    plans: {
                        'Bronze': {
                            premium: '$150/month',
                            deductible: '$6,000',
                            coverage: '60% after deductible'
                        },
                        'Silver': {
                            premium: '$275/month',
                            deductible: '$3,500',
                            coverage: '70% after deductible'
                        },
                        'Gold': {
                            premium: '$425/month',
                            deductible: '$1,500',
                            coverage: '80% after deductible'
                        }
                    },
                    network: '10,000+ hospitals, 50,000+ doctors'
                }
            },
            'life-insurance': {
                title: 'Life Insurance Portfolio',
                subtitle: 'Complete Life Protection Solutions',
                content: {
                    overview: 'SecureLife offers a comprehensive range of life insurance products.',
                    products: [
                        'Term Life Insurance',
                        'Whole Life Insurance',
                        'Universal Life Insurance',
                        'Variable Life Insurance'
                    ],
                    comparison: true
                }
            },
            'auto-insurance': {
                title: 'Auto Insurance Coverage',
                subtitle: 'Drive with Confidence',
                content: {
                    overview: 'Complete protection for your vehicle with competitive rates.',
                    coverage: [
                        'Liability Coverage',
                        'Collision Protection',
                        'Comprehensive Coverage',
                        'Uninsured Motorist Protection',
                        'Medical Payments Coverage'
                    ],
                    discounts: [
                        'Safe Driver: 25% off',
                        'Multi-Car: 20% off',
                        'Good Student: 15% off'
                    ]
                }
            },
        };
    }

    generatePDF(type) {
        const brochure = this.brochures[type];
        if (!brochure) {
            console.error('Brochure type not found:', type);
            return;
        }

        // Create a hidden div with brochure content
        const content = this.createBrochureHTML(brochure, type);
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${brochure.title} - SecureLife Insurance</title>
                <style>
                    ${this.getPrintStyles()}
                </style>
            </head>
            <body>
                ${content}
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 100);
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    createBrochureHTML(brochure, type) {
        let html = `
            <div class="brochure-container">
                <div class="brochure-header">
                    <div class="logo">
                        <h1>SecureLife Insurance</h1>
                        <p>Your Trusted Protection Partner</p>
                    </div>
                    <div class="contact-info">
                        <p>📞 1-800-SECURE-1</p>
                        <p>✉️ info@securelife.com</p>
                        <p>🌐 www.securelife.com</p>
                    </div>
                </div>
                
                <div class="brochure-title">
                    <h2>${brochure.title}</h2>
                    <p class="subtitle">${brochure.subtitle}</p>
                </div>
                
                <div class="brochure-content">
                    <div class="overview">
                        <h3>Overview</h3>
                        <p>${brochure.content.overview}</p>
                    </div>
        `;

        // Add benefits if available
        if (brochure.content.benefits) {
            html += `
                <div class="benefits">
                    <h3>Key Benefits</h3>
                    <ul>
                        ${brochure.content.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Add coverage if available
        if (brochure.content.coverage) {
            html += `
                <div class="coverage">
                    <h3>Coverage Includes</h3>
                    <ul>
                        ${brochure.content.coverage.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Add pricing if available
        if (brochure.content.pricing) {
            html += `
                <div class="pricing">
                    <h3>Sample Pricing</h3>
                    <table>
                        ${Object.entries(brochure.content.pricing).map(([age, price]) => `
                            <tr>
                                <td>${age}</td>
                                <td>${price}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            `;
        }

        // Add plans comparison if available
        if (brochure.content.plans) {
            html += `
                <div class="plans">
                    <h3>Available Plans</h3>
                    ${Object.entries(brochure.content.plans).map(([planName, details]) => `
                        <div class="plan-box">
                            <h4>${planName} Plan</h4>
                            ${typeof details === 'object' ? `
                                <p>Premium: ${details.premium}</p>
                                <p>Deductible: ${details.deductible}</p>
                                <p>Coverage: ${details.coverage}</p>
                            ` : `<p>${details}</p>`}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Add discounts if available
        if (brochure.content.discounts) {
            html += `
                <div class="discounts">
                    <h3>Available Discounts</h3>
                    <ul>
                        ${brochure.content.discounts.map(discount => `<li>${discount}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Add footer
        html += `
                </div>
                
                <div class="brochure-footer">
                    <div class="disclaimer">
                        <p><small>This brochure provides general information only. Please contact us for detailed coverage information and personalized quotes.</small></p>
                    </div>
                    <div class="cta">
                        <h3>Ready to Get Started?</h3>
                        <p>Contact us today for a personalized quote!</p>
                        <p class="phone">📞 1-800-SECURE-1</p>
                    </div>
                    <div class="footer-info">
                        <p>© 2024 SecureLife Insurance. All rights reserved.</p>
                        <p>Generated on: ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    getPrintStyles() {
        return `
            @page {
                size: letter;
                margin: 0.5in;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }
            
            .brochure-container {
                max-width: 8.5in;
                margin: 0 auto;
            }
            
            .brochure-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            
            .logo h1 {
                color: #2563eb;
                margin: 0;
                font-size: 28px;
            }
            
            .logo p {
                margin: 5px 0 0 0;
                color: #666;
                font-size: 14px;
            }
            
            .contact-info {
                text-align: right;
                font-size: 12px;
                color: #666;
            }
            
            .contact-info p {
                margin: 2px 0;
            }
            
            .brochure-title {
                text-align: center;
                margin: 40px 0;
                padding: 20px;
                background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%);
                border-radius: 10px;
            }
            
            .brochure-title h2 {
                color: #2563eb;
                font-size: 32px;
                margin: 0 0 10px 0;
            }
            
            .subtitle {
                font-size: 18px;
                color: #666;
                margin: 0;
            }
            
            .brochure-content h3 {
                color: #2563eb;
                font-size: 20px;
                margin-top: 30px;
                margin-bottom: 15px;
                border-bottom: 2px solid #e0e7ff;
                padding-bottom: 5px;
            }
            
            .brochure-content p {
                margin: 10px 0;
                text-align: justify;
            }
            
            .brochure-content ul {
                margin: 10px 0;
                padding-left: 25px;
            }
            
            .brochure-content li {
                margin: 8px 0;
                list-style-type: none;
                position: relative;
                padding-left: 20px;
            }
            
            .brochure-content li:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #10b981;
                font-weight: bold;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
            }
            
            table td {
                padding: 10px;
                border: 1px solid #e0e7ff;
            }
            
            table tr:nth-child(even) {
                background: #f9fafb;
            }
            
            .plan-box {
                border: 2px solid #e0e7ff;
                border-radius: 8px;
                padding: 15px;
                margin: 15px 0;
                background: #f9fafb;
            }
            
            .plan-box h4 {
                color: #2563eb;
                margin: 0 0 10px 0;
            }
            
            .plan-box p {
                margin: 5px 0;
                font-size: 14px;
            }
            
            .brochure-footer {
                margin-top: 50px;
                padding-top: 30px;
                border-top: 3px solid #2563eb;
            }
            
            .disclaimer {
                background: #f9fafb;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 20px;
            }
            
            .disclaimer p {
                margin: 0;
                font-size: 11px;
                color: #666;
            }
            
            .cta {
                text-align: center;
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            
            .cta h3 {
                margin: 0 0 10px 0;
                font-size: 24px;
            }
            
            .cta p {
                margin: 5px 0;
            }
            
            .cta .phone {
                font-size: 20px;
                font-weight: bold;
                margin-top: 10px;
            }
            
            .footer-info {
                text-align: center;
                font-size: 10px;
                color: #999;
                margin-top: 20px;
            }
            
            .footer-info p {
                margin: 2px 0;
            }
            
            @media print {
                .brochure-container {
                    page-break-inside: avoid;
                }
                
                .brochure-title {
                    page-break-after: avoid;
                }
                
                .plan-box {
                    page-break-inside: avoid;
                }
            }
        `;
    }
}

// Initialize brochure generator
const brochureGenerator = new BrochureGenerator();

// Global function to download brochure
function downloadBrochure(type) {
    // Track download
    trackEvent('brochure_download', {
        brochure_type: type,
        timestamp: new Date().toISOString()
    });
    
    // Generate and download PDF
    brochureGenerator.generatePDF(type);
    
    // Show success message
    showBrochureSuccess(type);
}

function showBrochureSuccess(type) {
    const message = document.createElement('div');
    message.className = 'brochure-success';
    message.innerHTML = `
        <span>📥</span>
        <span>Brochure download started!</span>
    `;
    message.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}