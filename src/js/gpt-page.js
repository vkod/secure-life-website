// SecureLife GPT Page JavaScript

class SecureLifeGPTPage {
    constructor() {
        this.chatHistory = [];
        this.currentSessionId = this.generateSessionId();
        this.isProcessing = false;
        this.knowledgeBase = this.loadKnowledgeBase();
        this.initializeInterface();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadKnowledgeBase() {
        return {
            products: {
                'life': {
                    'term': {
                        name: 'Term Life Insurance',
                        description: 'Affordable coverage for a specific period',
                        pricing: { min: 15, max: 50, unit: 'month' },
                        coverage: { min: 100000, max: 2000000 },
                        terms: [10, 20, 30],
                        benefits: ['Low premiums', 'Fixed coverage period', 'Convertible to permanent', 'No medical exam options'],
                        link: 'plans/life/term-life.html'
                    },
                    'whole': {
                        name: 'Whole Life Insurance',
                        description: 'Lifetime coverage with cash value',
                        pricing: { min: 85, max: 200, unit: 'month' },
                        coverage: { min: 50000, max: 1000000 },
                        benefits: ['Lifetime protection', 'Cash value growth', 'Fixed premiums', 'Tax advantages'],
                        link: 'plans/life/whole-life.html'
                    },
                    'universal': {
                        name: 'Universal Life Insurance',
                        description: 'Flexible premiums and death benefits',
                        pricing: { min: 50, max: 150, unit: 'month' },
                        benefits: ['Flexible premiums', 'Adjustable coverage', 'Cash value accumulation'],
                        link: 'plans/life/universal-life.html'
                    }
                },
                'health': {
                    'bronze': {
                        name: 'Bronze Health Plan',
                        premium: 150,
                        deductible: 6000,
                        coverage: 60,
                        link: 'plans/health/individual-health.html'
                    },
                    'silver': {
                        name: 'Silver Health Plan',
                        premium: 275,
                        deductible: 3500,
                        coverage: 70,
                        link: 'plans/health/individual-health.html'
                    },
                    'gold': {
                        name: 'Gold Health Plan',
                        premium: 425,
                        deductible: 1500,
                        coverage: 80,
                        link: 'plans/health/individual-health.html'
                    }
                },
                'auto': {
                    'comprehensive': {
                        name: 'Comprehensive Auto Coverage',
                        description: 'Full protection including collision and comprehensive',
                        avgPremium: 125,
                        link: 'plans/auto/comprehensive-auto.html'
                    },
                    'liability': {
                        name: 'Liability Only',
                        description: 'State minimum required coverage',
                        avgPremium: 65,
                        link: 'plans/auto/liability.html'
                    }
                }
            }
        };
    }

    initializeInterface() {
        this.bindEvents();
        this.focusInput();
        this.loadChatHistory();
    }

    bindEvents() {
        // Auto-resize textarea
        const input = document.getElementById('messageInput');
        if (input) {
            input.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 200) + 'px';
            });
        }

        // Mobile sidebar toggle
        if (window.innerWidth <= 768) {
            this.createMobileSidebarToggle();
        }
    }

    createMobileSidebarToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-sidebar-toggle';
        toggle.innerHTML = '☰';
        toggle.onclick = () => this.toggleSidebar();
        document.body.appendChild(toggle);
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.gpt-sidebar');
        sidebar.classList.toggle('show');
    }

    focusInput() {
        const input = document.getElementById('messageInput');
        if (input) input.focus();
    }

    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendCurrentMessage();
        }
    }

    sendMessage(text) {
        const input = document.getElementById('messageInput');
        input.value = text;
        this.sendCurrentMessage();
    }

    sendCurrentMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message || this.isProcessing) return;
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        
        // Disable send button
        this.setProcessing(true);
        
        // Process message
        setTimeout(() => {
            this.processMessage(message);
        }, 500);
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper';
        
        const message = document.createElement('div');
        message.className = `message ${sender}`;
        
        if (sender === 'user') {
            message.innerHTML = `
                <div class="message-avatar">You</div>
                <div class="message-content">
                    <div class="message-header">You</div>
                    <div class="message-body">${this.escapeHtml(content)}</div>
                </div>
            `;
        } else {
            message.innerHTML = `
                <div class="message-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 6V18M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-header">SecureLife GPT</div>
                    <div class="message-body markdown-content">${content}</div>
                </div>
            `;
        }
        
        messageWrapper.appendChild(message);
        messagesContainer.appendChild(messageWrapper);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Save to history
        this.chatHistory.push({
            sender: sender,
            content: content,
            timestamp: new Date().toISOString()
        });
        
        this.updateChatHistory();
    }

    showTyping() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message-wrapper typing-wrapper';
        typingDiv.innerHTML = `
            <div class="message assistant">
                <div class="message-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 6V18M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-body">
                        <div class="typing-indicator">
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typingWrapper = document.querySelector('.typing-wrapper');
        if (typingWrapper) typingWrapper.remove();
    }

    processMessage(message) {
        this.showTyping();
        const lowerMessage = message.toLowerCase();
        let response = '';
        
        // Analyze intent
        if (this.isComparison(lowerMessage)) {
            response = this.generateComparison(lowerMessage);
        } else if (this.isPremiumCalculation(lowerMessage)) {
            response = this.generatePremiumCalculation(lowerMessage);
        } else if (this.isCoverageQuestion(lowerMessage)) {
            response = this.generateCoverageInfo(lowerMessage);
        } else if (this.isClaimQuestion(lowerMessage)) {
            response = this.generateClaimInfo();
        } else if (this.isProductQuestion(lowerMessage)) {
            response = this.generateProductInfo(lowerMessage);
        } else {
            response = this.generateGeneralResponse(message);
        }
        
        // Simulate processing delay
        setTimeout(() => {
            this.hideTyping();
            this.addMessage(response, 'assistant');
            this.setProcessing(false);
        }, 1000 + Math.random() * 1000);
    }

    isComparison(message) {
        return message.includes('compare') || message.includes('difference') || 
               message.includes('vs') || message.includes('better');
    }

    isPremiumCalculation(message) {
        return message.includes('cost') || message.includes('price') || 
               message.includes('premium') || message.includes('quote') ||
               message.includes('how much');
    }

    isCoverageQuestion(message) {
        return message.includes('cover') || message.includes('what does') ||
               message.includes('included') || message.includes('benefit');
    }

    isClaimQuestion(message) {
        return message.includes('claim') || message.includes('file') ||
               message.includes('submit');
    }

    isProductQuestion(message) {
        return message.includes('life') || message.includes('health') ||
               message.includes('auto') || message.includes('car') ||
               message.includes('insurance');
    }

    generateComparison(message) {
        if (message.includes('term') && message.includes('whole')) {
            return `
## Term Life vs Whole Life Insurance Comparison

Here's a detailed comparison of our two most popular life insurance options:

| Feature | Term Life | Whole Life |
|---------|-----------|------------|
| **Coverage Period** | 10, 20, or 30 years | Lifetime |
| **Monthly Premium** | $15-$50 | $85-$200 |
| **Death Benefit** | $100K-$2M | $50K-$1M |
| **Cash Value** | None | Yes, grows tax-deferred |
| **Premium Type** | Fixed during term | Fixed for life |
| **Best For** | Young families, mortgage protection | Estate planning, wealth transfer |

### Key Differences:

**Term Life Insurance:**
- ✅ Most affordable option
- ✅ Maximum coverage for your budget
- ✅ Can convert to permanent later
- ❌ No cash value component
- ❌ Coverage expires

**Whole Life Insurance:**
- ✅ Lifetime protection guaranteed
- ✅ Builds cash value you can borrow against
- ✅ Tax-advantaged growth
- ❌ Higher premiums
- ❌ Lower initial death benefit

### Our Recommendation:
- **Choose Term Life** if you need maximum coverage at the lowest cost for a specific period
- **Choose Whole Life** if you want permanent protection with an investment component

📊 [Get personalized quotes for both options](plans/life/term-life.html)
`;
        } else if (message.includes('health')) {
            return this.generateHealthComparison();
        }
        return this.generateGeneralComparison();
    }

    generateHealthComparison() {
        return `
## Health Insurance Plans Comparison

We offer three tiers of health coverage to match your needs and budget:

| Plan Level | Bronze 🥉 | Silver 🥈 | Gold 🥇 |
|------------|-----------|-----------|---------|
| **Monthly Premium** | $150 | $275 | $425 |
| **Annual Deductible** | $6,000 | $3,500 | $1,500 |
| **Out-of-Pocket Max** | $8,500 | $6,500 | $4,500 |
| **Coverage After Deductible** | 60% | 70% | 80% |
| **Primary Care Visit** | $45 | $30 | $20 |
| **Specialist Visit** | $75 | $50 | $35 |
| **Generic Drugs** | $15 | $10 | $5 |
| **Emergency Room** | 40% after deductible | 30% after deductible | 20% after deductible |

### What's Included in All Plans:
- ✅ Preventive care at no cost
- ✅ Annual wellness visits
- ✅ Vaccinations and screenings
- ✅ Maternity and newborn care
- ✅ Mental health services
- ✅ Prescription drug coverage

### Which Plan is Right for You?

**Choose Bronze if:**
- You're healthy and rarely visit the doctor
- You want the lowest monthly premium
- You can afford higher out-of-pocket costs if needed

**Choose Silver if:**
- You visit the doctor occasionally
- You want balanced premiums and deductibles
- You take a few prescription medications

**Choose Gold if:**
- You have ongoing health conditions
- You frequently visit specialists
- You prefer predictable healthcare costs

[View detailed plan benefits](plans/health/individual-health.html) | [Calculate your subsidy eligibility](#)
`;
    }

    generatePremiumCalculation(message) {
        const age = this.extractAge(message);
        const coverage = this.extractCoverage(message);
        
        return `
## Premium Calculator

Based on your inquiry, here's an estimated premium breakdown:

### Life Insurance Premium Estimates
${age ? `For a **${age}-year-old** non-smoker in good health:` : 'Average premiums for non-smokers in good health:'}

| Coverage Amount | Term Life (20-year) | Whole Life |
|-----------------|---------------------|------------|
| $250,000 | $${this.calculatePremium('term', 250000, age)} /month | $${this.calculatePremium('whole', 250000, age)} /month |
| $500,000 | $${this.calculatePremium('term', 500000, age)} /month | $${this.calculatePremium('whole', 500000, age)} /month |
| $1,000,000 | $${this.calculatePremium('term', 1000000, age)} /month | $${this.calculatePremium('whole', 1000000, age)} /month |

### Factors That Affect Your Premium:
- **Age**: Younger applicants get lower rates
- **Health**: Better health = better rates
- **Tobacco use**: Non-smokers save 50-70%
- **Coverage amount**: Higher coverage = higher premium
- **Term length**: Longer terms cost more

### Get Your Exact Quote
For a personalized quote based on your specific situation:

1. 📝 [Complete our online application](index.html#contact)
2. 📞 Call us at **1-800-SECURE-1**
3. 💬 Schedule a consultation with an agent

**Note:** These are estimates only. Your actual premium may vary based on underwriting.
`;
    }

    calculatePremium(type, coverage, age = 35) {
        // Simple premium calculation logic
        const basePremium = type === 'term' ? 0.00005 : 0.00025;
        const ageFactor = 1 + ((age - 25) * 0.05);
        const premium = (coverage * basePremium * ageFactor) / 12;
        return Math.round(premium);
    }

    extractAge(message) {
        const ageMatch = message.match(/(\d{2})[- ]?year[- ]?old/i);
        if (ageMatch) return parseInt(ageMatch[1]);
        
        const ageMatch2 = message.match(/age (\d{2})/i);
        if (ageMatch2) return parseInt(ageMatch2[1]);
        
        return null;
    }

    extractCoverage(message) {
        const coverageMatch = message.match(/\$?([\d,]+)k?/i);
        if (coverageMatch) {
            let amount = parseInt(coverageMatch[1].replace(/,/g, ''));
            if (message.toLowerCase().includes('k')) amount *= 1000;
            return amount;
        }
        return null;
    }

    generateCoverageInfo(message) {
        if (message.includes('life')) {
            return this.generateLifeCoverageInfo();
        } else if (message.includes('health')) {
            return this.generateHealthCoverageInfo();
        } else if (message.includes('auto')) {
            return this.generateAutoCoverageInfo();
        }
        return this.generateGeneralCoverageInfo();
    }

    generateLifeCoverageInfo() {
        return `
## Life Insurance Coverage Details

### What Our Life Insurance Covers:

**Death Benefit**
- Tax-free payment to your beneficiaries
- Can be used for any purpose:
  - Replace lost income
  - Pay off mortgage/debts
  - Fund children's education
  - Cover final expenses

### Available Riders & Add-ons:

| Rider | Description | Typical Cost |
|-------|-------------|--------------|
| **Accelerated Death Benefit** | Access up to 90% if terminally ill | Usually free |
| **Waiver of Premium** | Premiums waived if disabled | +$3-5/month |
| **Child Term Rider** | Coverage for all children | +$5-8/month |
| **Accidental Death** | Double benefit for accidents | +$5-10/month |

### Coverage Options by Product:

**Term Life Insurance**
- Coverage: $100,000 to $2,000,000
- Terms: 10, 20, or 30 years
- Convertible to permanent coverage
- [Learn more →](plans/life/term-life.html)

**Whole Life Insurance**
- Coverage: $50,000 to $1,000,000
- Lifetime protection
- Cash value accumulation
- [Learn more →](plans/life/whole-life.html)

**Universal Life Insurance**
- Flexible coverage amounts
- Adjustable premiums
- Investment options
- [Learn more →](plans/life/universal-life.html)

### Exclusions (What's NOT Covered):
- Suicide within first 2 years
- Death from illegal activities
- War or acts of terrorism (in some policies)
- Misrepresentation on application

📞 **Questions?** Call 1-800-SECURE-1 to speak with a coverage specialist.
`;
    }

    generateClaimInfo() {
        return `
## How to File a Claim

We've made the claims process as simple and stress-free as possible:

### 📱 Option 1: Online Portal (Fastest)
1. Log in to your account at [securelife.com/claims](#)
2. Click "File New Claim"
3. Upload required documents
4. Track status in real-time
5. Receive updates via email/SMS

### 📞 Option 2: Phone (24/7 Support)
- Call: **1-800-SECURE-1**
- Press 2 for claims
- Have your policy number ready
- Claims representative will guide you

### 📧 Option 3: Email
- Send details to: claims@securelife.com
- Include policy number in subject line
- Attach all supporting documents

### Required Documents:

**For Life Insurance Claims:**
- Death certificate
- Claim form (we'll provide)
- Beneficiary identification
- Policy documents

**For Health Insurance Claims:**
- Medical bills/receipts
- Explanation of Benefits (EOB)
- Doctor's report
- Prescription receipts

**For Auto Insurance Claims:**
- Police report (if applicable)
- Photos of damage
- Other driver's information
- Repair estimates

### Claim Processing Times:

| Claim Type | Processing Time | Payment Method |
|------------|-----------------|----------------|
| Life Insurance | 5-7 business days | Check or direct deposit |
| Health Insurance | 48-72 hours | Direct to provider or reimbursement |
| Auto Insurance | 24-48 hours | Direct deposit or check |

### Tips for Faster Processing:
✅ Submit all documents at once
✅ Ensure forms are complete
✅ Provide clear photos/scans
✅ Respond quickly to requests

**Need Help?** Our claims advocates are available 24/7 at 1-800-SECURE-1
`;
    }

    generateProductInfo(message) {
        if (message.includes('life')) {
            return this.generateLifeProductInfo();
        } else if (message.includes('health')) {
            return this.generateHealthProductInfo();
        } else if (message.includes('auto')) {
            return this.generateAutoProductInfo();
        }
        return this.generateAllProductsInfo();
    }

    generateLifeProductInfo() {
        return `
## Life Insurance Products

We offer comprehensive life insurance solutions to protect your loved ones:

### 📋 Term Life Insurance
**Most Popular Choice**
- **Coverage:** $100,000 to $2,000,000
- **Terms:** 10, 20, or 30 years
- **Starting at:** $15/month
- **Best for:** Young families, mortgage protection, temporary needs

Key Benefits:
- ✅ Lowest cost option
- ✅ Fixed premiums during term
- ✅ Convertible to permanent coverage
- ✅ No medical exam options available

[Get Term Life Quote →](plans/life/term-life.html)

---

### 💼 Whole Life Insurance
**Lifetime Protection + Investment**
- **Coverage:** $50,000 to $1,000,000
- **Duration:** Lifetime
- **Starting at:** $85/month
- **Best for:** Estate planning, wealth transfer, permanent needs

Key Benefits:
- ✅ Guaranteed lifetime coverage
- ✅ Cash value accumulation
- ✅ Tax-deferred growth
- ✅ Can borrow against policy

[Explore Whole Life →](plans/life/whole-life.html)

---

### 🔄 Universal Life Insurance
**Flexible Premium Option**
- **Coverage:** Adjustable
- **Duration:** Lifetime
- **Starting at:** $50/month
- **Best for:** Those wanting flexibility

Key Benefits:
- ✅ Flexible premiums
- ✅ Adjustable death benefit
- ✅ Cash value with interest
- ✅ Premium payment holidays

[Learn About Universal →](plans/life/universal-life.html)

### Quick Comparison:

| Feature | Term | Whole | Universal |
|---------|------|--------|-----------|
| Duration | Fixed term | Lifetime | Lifetime |
| Premium | Lowest | Fixed | Flexible |
| Cash Value | No | Yes | Yes |
| Flexibility | Low | Medium | High |

**Ready to protect your family?** [Start application →](index.html#contact)
`;
    }

    generateGeneralResponse(message) {
        return `
I can help you with information about our insurance products and services. Here are some areas I can assist with:

### 🏥 Insurance Products
- **Life Insurance** - Term, Whole, and Universal options
- **Health Insurance** - Individual and family plans
- **Auto Insurance** - Comprehensive vehicle coverage

### 💡 How Can I Help?
- Compare different insurance plans
- Calculate premium estimates
- Explain coverage details
- Guide you through the claims process
- Answer policy questions

### 📚 Popular Topics:
1. [Compare Term vs Whole Life Insurance](plans/life/term-life.html)
2. [View Health Plan Options](plans/health/individual-health.html)
3. [Get Auto Insurance Quote](plans/auto/comprehensive-auto.html)
4. [File a Claim](#)

### 💬 Try Asking:
- "Compare term life and whole life insurance"
- "Calculate premium for a 35-year-old"
- "What does health insurance cover?"
- "How do I file a claim?"

Is there something specific you'd like to know about our insurance products?
`;
    }

    generateGeneralComparison() {
        return `
## Insurance Product Comparison

I can help you compare different insurance options. Here are our main categories:

### Life Insurance Options
- **Term Life** - Temporary coverage at lowest cost
- **Whole Life** - Lifetime coverage with cash value
- **Universal Life** - Flexible premiums and coverage

### Health Insurance Tiers
- **Bronze** - Lower premiums, higher deductibles
- **Silver** - Balanced coverage (most popular)
- **Gold** - Higher premiums, lower out-of-pocket

### Auto Insurance Coverage
- **Liability Only** - State minimum requirements
- **Comprehensive** - Full coverage including collision
- **Uninsured Motorist** - Protection from uninsured drivers

Which specific products would you like me to compare in detail?
`;
    }

    generateAllProductsInfo() {
        return `
## SecureLife Insurance Products

### 🏥 Our Insurance Portfolio

We offer comprehensive insurance solutions for all your protection needs:

**Life Insurance**
- Term Life (10, 20, 30 years)
- Whole Life (Lifetime coverage)
- Universal Life (Flexible options)
- Variable Life (Investment-linked)

**Health Insurance**
- Individual Plans (Bronze, Silver, Gold)
- Family Plans
- Senior Health Coverage
- Dental & Vision

**Auto Insurance**
- Liability Coverage
- Collision Protection
- Comprehensive Coverage
- Uninsured Motorist

### Why Choose SecureLife?

✅ **50+ Years of Trust** - Serving families since 1970
✅ **A+ Rated** - Superior financial strength
✅ **24/7 Support** - Always here when you need us
✅ **Fast Claims** - Most claims processed in 48 hours
✅ **Competitive Rates** - Bundle and save up to 25%

### Get Started Today

1. 📊 [Compare Plans](index.html#products)
2. 💰 [Get a Quote](index.html#contact)
3. 📞 Call 1-800-SECURE-1
4. 💬 Continue chatting with me

What type of insurance are you most interested in learning about?
`;
    }

    generateHealthCoverageInfo() {
        return `
## Health Insurance Coverage Details

### What's Covered in All Our Plans:

**Essential Health Benefits**
- ✅ Doctor visits (primary & specialist)
- ✅ Hospital stays and emergency care
- ✅ Prescription medications
- ✅ Laboratory tests and imaging
- ✅ Preventive care and vaccines
- ✅ Mental health and substance abuse treatment
- ✅ Maternity and newborn care
- ✅ Pediatric services
- ✅ Rehabilitation services

### Coverage by Plan Level:

| Service | Bronze 🥉 | Silver 🥈 | Gold 🥇 |
|---------|-----------|-----------|---------|
| **Preventive Care** | 100% covered | 100% covered | 100% covered |
| **Primary Doctor** | $45 copay | $30 copay | $20 copay |
| **Specialist** | $75 copay | $50 copay | $35 copay |
| **Generic Drugs** | $15 | $10 | $5 |
| **ER Visit** | 40% after deductible | 30% after deductible | 20% after deductible |
| **Hospital Stay** | 40% after deductible | 30% after deductible | 20% after deductible |

### Network Coverage:
- **10,000+** hospitals nationwide
- **50,000+** doctors and specialists
- **25,000+** pharmacies
- Telemedicine included

### Additional Benefits:
- 🏃 Gym membership discounts
- 👁️ Vision care discounts
- 🦷 Dental care discounts
- 💊 Mail-order pharmacy
- 🏥 Second opinion services

[View Full Plan Details →](plans/health/individual-health.html)
`;
    }

    generateAutoCoverageInfo() {
        return `
## Auto Insurance Coverage Options

### Comprehensive Protection for Your Vehicle

**Liability Coverage** (Required in most states)
- Bodily injury liability
- Property damage liability
- Legal defense costs

**Collision Coverage**
- Damage from accidents
- Hit and run incidents
- Single-car accidents

**Comprehensive Coverage**
- Theft and vandalism
- Weather damage (hail, flood, etc.)
- Animal collisions
- Glass damage

**Additional Protection:**
- **Uninsured/Underinsured Motorist** - Protects when other driver lacks coverage
- **Medical Payments** - Medical expenses regardless of fault
- **Rental Reimbursement** - Car rental while yours is repaired
- **Roadside Assistance** - 24/7 towing and emergency services

### Available Discounts:

| Discount Type | Savings |
|---------------|---------|
| Safe Driver | Up to 25% |
| Multi-Car | 20% |
| Good Student | 15% |
| Anti-Theft Device | 10% |
| Defensive Driving | 10% |
| Pay in Full | 8% |

### Coverage Limits & Deductibles:
- **Liability:** $25,000 to $500,000
- **Deductibles:** $250, $500, $1,000
- **Medical:** $1,000 to $10,000

**Average Premium:** $125/month (varies by location, age, vehicle)

[Get Your Auto Quote →](plans/auto/comprehensive-auto.html)
`;
    }

    setProcessing(isProcessing) {
        this.isProcessing = isProcessing;
        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.disabled = isProcessing;
        }
    }

    updateChatHistory() {
        const historyContainer = document.getElementById('chatHistory');
        // Update sidebar with recent chats
        const sessionTitle = this.chatHistory.length > 0 ? 
            this.chatHistory[0].content.substring(0, 30) + '...' : 
            'New Chat';
        
        // Save to localStorage
        this.saveChatHistory();
    }

    saveChatHistory() {
        const sessions = JSON.parse(localStorage.getItem('gpt_sessions') || '[]');
        const currentSession = {
            id: this.currentSessionId,
            title: this.chatHistory[0]?.content.substring(0, 30) || 'New Chat',
            messages: this.chatHistory,
            timestamp: new Date().toISOString()
        };
        
        const existingIndex = sessions.findIndex(s => s.id === this.currentSessionId);
        if (existingIndex >= 0) {
            sessions[existingIndex] = currentSession;
        } else {
            sessions.unshift(currentSession);
        }
        
        // Keep only last 20 sessions
        sessions.splice(20);
        localStorage.setItem('gpt_sessions', JSON.stringify(sessions));
    }

    loadChatHistory() {
        const sessions = JSON.parse(localStorage.getItem('gpt_sessions') || '[]');
        const historyContainer = document.getElementById('chatHistory');
        
        if (historyContainer && sessions.length > 0) {
            historyContainer.innerHTML = sessions.map(session => `
                <div class="history-item" onclick="gptPage.loadSession('${session.id}')">
                    <span class="history-icon">💬</span>
                    <span class="history-title">${session.title}</span>
                    <span class="history-time">${this.formatTime(session.timestamp)}</span>
                </div>
            `).join('');
        }
    }

    loadSession(sessionId) {
        const sessions = JSON.parse(localStorage.getItem('gpt_sessions') || '[]');
        const session = sessions.find(s => s.id === sessionId);
        
        if (session) {
            // Clear current chat
            document.getElementById('chatMessages').innerHTML = '';
            
            // Load session messages
            this.chatHistory = session.messages;
            this.currentSessionId = sessionId;
            
            // Display messages
            session.messages.forEach(msg => {
                this.addMessage(msg.content, msg.sender);
            });
        }
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 3600000) return 'Just now';
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Quick Actions
function quickAction(action) {
    const actions = {
        'compare': 'I want to compare different insurance plans',
        'quote': 'Can you calculate my insurance premium?',
        'claim': 'How do I file an insurance claim?',
        'coverage': 'What does my insurance cover?'
    };
    
    if (actions[action]) {
        gptPage.sendMessage(actions[action]);
    }
}

function startNewChat() {
    // Clear messages
    document.getElementById('chatMessages').innerHTML = `
        <div class="message-wrapper">
            <div class="message assistant">
                <div class="message-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 6V18M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-header">SecureLife GPT</div>
                    <div class="message-body markdown-content">
                        <h2>Welcome to SecureLife GPT! 🤖</h2>
                        <p>I'm your AI-powered insurance assistant. How can I help you today?</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Reset chat state
    gptPage.chatHistory = [];
    gptPage.currentSessionId = gptPage.generateSessionId();
    gptPage.focusInput();
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all chat history?')) {
        localStorage.removeItem('gpt_sessions');
        document.getElementById('chatHistory').innerHTML = `
            <div class="history-item active">
                <span class="history-icon">💬</span>
                <span class="history-title">New Chat</span>
                <span class="history-time">Now</span>
            </div>
        `;
        startNewChat();
    }
}

function sendCurrentMessage() {
    gptPage.sendCurrentMessage();
}

function sendMessage(text) {
    gptPage.sendMessage(text);
}

function handleKeyPress(event) {
    gptPage.handleKeyPress(event);
}

// Initialize GPT Page
let gptPage;
document.addEventListener('DOMContentLoaded', function() {
    gptPage = new SecureLifeGPTPage();
});