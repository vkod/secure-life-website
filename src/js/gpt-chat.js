// SecureLife GPT Chat Implementation

class SecureLifeGPT {
    constructor() {
        this.chatHistory = [];
        this.isTyping = false;
        this.sessionId = this.generateSessionId();
        this.knowledgeBase = this.loadKnowledgeBase();
        this.initializeChat();
    }

    generateSessionId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadKnowledgeBase() {
        return {
            plans: {
                'term life': {
                    description: 'Affordable coverage for a specific period',
                    benefits: ['Low premiums', 'Fixed coverage period', 'Convertible to permanent'],
                    pricing: 'Starting at $15/month',
                    best_for: 'Young families, mortgage protection, temporary needs'
                },
                'whole life': {
                    description: 'Lifetime coverage with cash value accumulation',
                    benefits: ['Lifetime protection', 'Cash value growth', 'Fixed premiums'],
                    pricing: 'Starting at $85/month',
                    best_for: 'Estate planning, permanent needs, investment component'
                },
                'health insurance': {
                    description: 'Comprehensive medical coverage',
                    plans: ['Bronze', 'Silver', 'Gold'],
                    benefits: ['Preventive care', 'Hospital coverage', 'Prescription drugs'],
                    pricing: 'From $150-$425/month'
                },
                'auto insurance': {
                    description: 'Complete vehicle protection',
                    coverage: ['Liability', 'Collision', 'Comprehensive', 'Uninsured motorist'],
                    pricing: 'Average $125/month'
                }
            },
            faqs: [
                {
                    question: 'claim',
                    answer: 'To file a claim, call 1-800-SECURE-1 or use our online portal. We process most claims within 48 hours.'
                },
                {
                    question: 'payment',
                    answer: 'We accept monthly, quarterly, or annual payments via credit card, bank transfer, or automatic deduction.'
                },
                {
                    question: 'cancel',
                    answer: 'You can cancel your policy anytime. Contact customer service for assistance with cancellation and any refunds due.'
                }
            ]
        };
    }

    initializeChat() {
        this.createFloatingButton();
        this.createChatModal();
        this.bindEvents();
    }

    createFloatingButton() {
        const floatBtn = document.createElement('div');
        floatBtn.className = 'gpt-float-btn';
        floatBtn.innerHTML = '💬';
        floatBtn.onclick = () => this.openChat();
        floatBtn.setAttribute('data-track-click', 'gpt-float-button');
        document.body.appendChild(floatBtn);
    }

    createChatModal() {
        const modal = document.createElement('div');
        modal.className = 'gpt-chat-modal';
        modal.id = 'gptChatModal';
        modal.innerHTML = `
            <div class="gpt-chat-header">
                <h3><span>🤖</span> SecureLife GPT</h3>
                <div class="gpt-chat-controls">
                    <button class="chat-control-btn" onclick="gptChat.minimizeChat()">−</button>
                    <button class="chat-control-btn" onclick="gptChat.closeChat()">×</button>
                </div>
            </div>
            <div class="gpt-chat-body" id="gptChatBody">
                <div class="gpt-message bot">
                    <div class="gpt-avatar">🤖</div>
                    <div class="gpt-message-content">
                        Hello! I'm SecureLife GPT, your AI insurance assistant. I can help you:
                        <br><br>
                        • Compare insurance plans<br>
                        • Calculate premiums<br>
                        • Explain coverage details<br>
                        • Answer policy questions<br>
                        • Assist with claims<br>
                        <br>
                        What would you like to know today?
                    </div>
                </div>
            </div>
            <div class="gpt-suggestions">
                <div class="suggestion-chips">
                    <button class="suggestion-chip" onclick="gptChat.sendSuggestion('Compare life insurance plans')">Compare life insurance</button>
                    <button class="suggestion-chip" onclick="gptChat.sendSuggestion('Calculate my premium')">Calculate premium</button>
                    <button class="suggestion-chip" onclick="gptChat.sendSuggestion('File a claim')">File a claim</button>
                    <button class="suggestion-chip" onclick="gptChat.sendSuggestion('Coverage for family')">Family coverage</button>
                </div>
            </div>
            <div class="gpt-chat-input">
                <div class="chat-input-wrapper">
                    <textarea 
                        class="chat-input-field" 
                        id="gptChatInput" 
                        placeholder="Type your question..."
                        rows="1"
                        data-track-input="gpt-chat-input"></textarea>
                    <button class="chat-send-btn" id="gptSendBtn" onclick="gptChat.sendMessage()">
                        ➤
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    bindEvents() {
        const input = document.getElementById('gptChatInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            input.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 100) + 'px';
            });
        }
    }

    openChat() {
        const modal = document.getElementById('gptChatModal');
        modal.classList.add('show');
        document.getElementById('gptChatInput').focus();
        
        trackEvent('gpt_chat_opened', {
            session_id: this.sessionId,
            timestamp: new Date().toISOString()
        });
    }

    closeChat() {
        const modal = document.getElementById('gptChatModal');
        modal.classList.remove('show');
        
        trackEvent('gpt_chat_closed', {
            session_id: this.sessionId,
            messages_exchanged: this.chatHistory.length,
            timestamp: new Date().toISOString()
        });
    }

    minimizeChat() {
        this.closeChat();
    }

    sendSuggestion(text) {
        document.getElementById('gptChatInput').value = text;
        this.sendMessage();
    }

    sendMessage() {
        const input = document.getElementById('gptChatInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        
        // Track message
        trackEvent('gpt_message_sent', {
            session_id: this.sessionId,
            message_length: message.length,
            message_type: 'user'
        });
        
        // Show typing indicator
        this.showTyping();
        
        // Process and respond
        setTimeout(() => {
            this.processMessage(message);
        }, 1000);
    }

    addMessage(content, sender) {
        const chatBody = document.getElementById('gptChatBody');
        const messageDiv = document.createElement('div');
        messageDiv.className = `gpt-message ${sender}`;
        
        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="gpt-avatar">🤖</div>
                <div class="gpt-message-content">${content}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="gpt-message-content">${content}</div>
            `;
        }
        
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Add to history
        this.chatHistory.push({
            sender: sender,
            content: content,
            timestamp: new Date().toISOString()
        });
    }

    showTyping() {
        this.isTyping = true;
        const chatBody = document.getElementById('gptChatBody');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'gpt-message bot typing-message';
        typingDiv.innerHTML = `
            <div class="gpt-avatar">🤖</div>
            <div class="gpt-message-content">
                <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    hideTyping() {
        this.isTyping = false;
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';
        
        // Check for plan comparisons
        if (lowerMessage.includes('compare') || lowerMessage.includes('difference')) {
            response = this.compareProducts(lowerMessage);
        }
        // Check for premium calculations
        else if (lowerMessage.includes('premium') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
            response = this.calculatePremiumResponse(lowerMessage);
        }
        // Check for claims
        else if (lowerMessage.includes('claim')) {
            response = this.claimResponse();
        }
        // Check for coverage questions
        else if (lowerMessage.includes('coverage') || lowerMessage.includes('cover')) {
            response = this.coverageResponse(lowerMessage);
        }
        // Check for specific products
        else if (lowerMessage.includes('life insurance') || lowerMessage.includes('term life') || lowerMessage.includes('whole life')) {
            response = this.lifeInsuranceResponse(lowerMessage);
        }
        else if (lowerMessage.includes('health insurance') || lowerMessage.includes('medical')) {
            response = this.healthInsuranceResponse(lowerMessage);
        }
        else if (lowerMessage.includes('auto') || lowerMessage.includes('car')) {
            response = this.autoInsuranceResponse();
        }
        // Default response
        else {
            response = this.defaultResponse(message);
        }
        
        // Hide typing and show response
        this.hideTyping();
        this.addMessage(response, 'bot');
        
        // Track bot response
        trackEvent('gpt_response_generated', {
            session_id: this.sessionId,
            response_type: this.getResponseType(lowerMessage),
            response_length: response.length
        });
    }

    compareProducts(message) {
        if (message.includes('term') && message.includes('whole')) {
            return `
                <strong>Term Life vs Whole Life Insurance:</strong><br><br>
                
                <strong>Term Life Insurance:</strong><br>
                ✓ Coverage: 10-30 years<br>
                ✓ Premium: $15-50/month<br>
                ✓ Best for: Temporary needs, young families<br>
                ✓ No cash value<br><br>
                
                <strong>Whole Life Insurance:</strong><br>
                ✓ Coverage: Lifetime<br>
                ✓ Premium: $85-200/month<br>
                ✓ Best for: Permanent needs, estate planning<br>
                ✓ Builds cash value<br><br>
                
                <a href="plans/life/term-life.html" style="color: #2563eb;">View Term Life Plans →</a><br>
                <a href="plans/life/whole-life.html" style="color: #2563eb;">View Whole Life Plans →</a><br><br>
                
                Would you like me to calculate a personalized quote for either option?
            `;
        }
        return `
            I can help you compare our insurance products! We offer:<br><br>
            • Life Insurance (Term, Whole, Universal)<br>
            • Health Insurance (Bronze, Silver, Gold)<br>
            • Auto Insurance<br><br>
            
            Which types would you like to compare?
        `;
    }

    calculatePremiumResponse(message) {
        return `
            <strong>Premium Calculator</strong><br><br>
            
            To calculate your premium, I'll need some information:<br><br>
            
            1. Insurance Type (Life/Health/Auto)<br>
            2. Your age<br>
            3. Coverage amount needed<br>
            4. Any pre-existing conditions (for health/life)<br>
            5. Location (ZIP code)<br><br>
            
            For a quick estimate:<br>
            • Term Life (35yo, $500K): ~$35/month<br>
            • Health Insurance (Individual): $150-425/month<br>
            • Auto Insurance: ~$125/month<br><br>
            
            <button onclick="window.location.href='#contact'" style="background: #2563eb; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">Get Personalized Quote</button>
        `;
    }

    claimResponse() {
        return `
            <strong>Filing a Claim</strong><br><br>
            
            We make claims easy! Here's how:<br><br>
            
            <strong>Option 1: Online</strong><br>
            • Log into your account<br>
            • Click "File a Claim"<br>
            • Upload documents<br>
            • Track status in real-time<br><br>
            
            <strong>Option 2: Phone</strong><br>
            • Call: 1-800-SECURE-1<br>
            • Available 24/7<br>
            • Claims processed in 48 hours<br><br>
            
            <strong>Option 3: Mobile App</strong><br>
            • Download SecureLife app<br>
            • Submit claims with photos<br>
            • Get instant updates<br><br>
            
            Do you need to file a claim now? I can guide you through the process.
        `;
    }

    coverageResponse(message) {
        if (message.includes('family')) {
            return `
                <strong>Family Coverage Options</strong><br><br>
                
                We offer comprehensive family protection:<br><br>
                
                <strong>Life Insurance:</strong><br>
                • Cover spouse and children<br>
                • Child term riders available<br>
                • Family income benefit options<br><br>
                
                <strong>Health Insurance:</strong><br>
                • Family plans from $450/month<br>
                • Pediatric care included<br>
                • Maternity coverage<br>
                • Family deductibles<br><br>
                
                <strong>Bundle & Save:</strong><br>
                • Multi-policy discounts up to 25%<br>
                • Family loyalty rewards<br><br>
                
                <a href="plans/health/family-health.html" style="color: #2563eb;">View Family Plans →</a><br><br>
                
                How many family members need coverage?
            `;
        }
        return `
            Our coverage options protect what matters most. What type of coverage are you interested in?<br><br>
            • Life Insurance Coverage<br>
            • Health & Medical Coverage<br>
            • Vehicle Coverage<br>
            • Liability Coverage
        `;
    }

    lifeInsuranceResponse(message) {
        const plans = this.knowledgeBase.plans;
        if (message.includes('term')) {
            return `
                <strong>Term Life Insurance</strong><br><br>
                
                ${plans['term life'].description}<br><br>
                
                <strong>Key Benefits:</strong><br>
                ${plans['term life'].benefits.map(b => '• ' + b).join('<br>')}<br><br>
                
                <strong>Pricing:</strong> ${plans['term life'].pricing}<br>
                <strong>Best For:</strong> ${plans['term life'].best_for}<br><br>
                
                <a href="plans/life/term-life.html" style="color: #2563eb;">Learn More →</a><br>
                <button onclick="gptChat.sendSuggestion('Calculate term life premium')" style="background: #2563eb; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; margin-top: 8px;">Calculate Premium</button>
            `;
        }
        return `
            <strong>Life Insurance Options</strong><br><br>
            
            We offer several life insurance plans:<br><br>
            
            1. <strong>Term Life</strong> - Affordable temporary coverage<br>
            2. <strong>Whole Life</strong> - Lifetime protection with cash value<br>
            3. <strong>Universal Life</strong> - Flexible premiums and coverage<br>
            4. <strong>Variable Life</strong> - Investment-linked coverage<br><br>
            
            Which type interests you most? Or would you like me to recommend based on your needs?
        `;
    }

    healthInsuranceResponse(message) {
        return `
            <strong>Health Insurance Plans</strong><br><br>
            
            We offer three tiers of health coverage:<br><br>
            
            <strong>🥉 Bronze Plan - $150/month</strong><br>
            • Lower monthly premiums<br>
            • Higher deductible ($6,000)<br>
            • Good for healthy individuals<br><br>
            
            <strong>🥈 Silver Plan - $275/month</strong><br>
            • Balanced coverage<br>
            • Moderate deductible ($3,500)<br>
            • Most popular choice<br><br>
            
            <strong>🥇 Gold Plan - $425/month</strong><br>
            • Comprehensive coverage<br>
            • Low deductible ($1,500)<br>
            • Best for frequent medical needs<br><br>
            
            All plans include preventive care at no cost!<br><br>
            
            <a href="plans/health/individual-health.html" style="color: #2563eb;">Compare Plans →</a>
        `;
    }

    autoInsuranceResponse() {
        return `
            <strong>Auto Insurance Coverage</strong><br><br>
            
            Complete protection for your vehicle:<br><br>
            
            <strong>Coverage Types:</strong><br>
            • Liability (required in most states)<br>
            • Collision (covers your car in accidents)<br>
            • Comprehensive (theft, weather, vandalism)<br>
            • Uninsured/Underinsured motorist<br>
            • Medical payments<br>
            • Roadside assistance<br><br>
            
            <strong>Discounts Available:</strong><br>
            • Safe driver: up to 25% off<br>
            • Multi-car: 20% off<br>
            • Good student: 15% off<br>
            • Anti-theft devices: 10% off<br><br>
            
            Average premium: $125/month<br><br>
            
            <a href="plans/auto/comprehensive-auto.html" style="color: #2563eb;">Get Auto Quote →</a>
        `;
    }


    defaultResponse(message) {
        const responses = [
            `I understand you're asking about "${message}". Let me help you find the right information.<br><br>
            
            Here are some areas I can assist with:<br>
            • Insurance plan comparisons<br>
            • Premium calculations<br>
            • Coverage explanations<br>
            • Claims assistance<br>
            • Policy questions<br><br>
            
            Could you please be more specific about what you'd like to know?`,
            
            `Thanks for your question! I'm here to help with all your insurance needs.<br><br>
            
            You can:<br>
            • Ask about specific insurance types<br>
            • Get premium estimates<br>
            • Compare coverage options<br>
            • Learn about discounts<br><br>
            
            Or call us at 1-800-SECURE-1 for immediate assistance.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getResponseType(message) {
        if (message.includes('premium') || message.includes('cost')) return 'premium_calculation';
        if (message.includes('claim')) return 'claims';
        if (message.includes('compare')) return 'comparison';
        if (message.includes('life')) return 'life_insurance';
        if (message.includes('health')) return 'health_insurance';
        if (message.includes('auto') || message.includes('car')) return 'auto_insurance';
        return 'general_inquiry';
    }
}

// Initialize GPT Chat
let gptChat;
document.addEventListener('DOMContentLoaded', function() {
    gptChat = new SecureLifeGPT();
});

// Global function to open GPT chat
function openGPTChat() {
    if (gptChat) {
        gptChat.openChat();
    } else {
        gptChat = new SecureLifeGPT();
        gptChat.openChat();
    }
}

// Global function to open chat with specific context
function openChatWithContext(context) {
    openGPTChat();
    setTimeout(() => {
        gptChat.sendSuggestion(context);
    }, 500);
}