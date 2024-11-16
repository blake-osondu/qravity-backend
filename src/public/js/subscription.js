class SubscriptionManager {
    constructor() {
        this.stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
        this.initializeEventListeners();
        this.loadCurrentSubscription();
    }

    initializeEventListeners() {
        // Upgrade buttons
        document.querySelectorAll('[data-plan]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleUpgrade(e.target.dataset.plan);
            });
        });

        // Cancel subscription
        document.getElementById('cancelSubscription')?.addEventListener('click', () => {
            this.handleCancel();
        });

        // View billing history
        document.getElementById('viewBillingHistory')?.addEventListener('click', () => {
            this.loadBillingHistory();
        });
    }

    async loadCurrentSubscription() {
        try {
            const response = await fetch('/api/subscription');
            const subscription = await response.json();
            this.updateSubscriptionUI(subscription);
        } catch (error) {
            console.error('Error loading subscription:', error);
        }
    }

    async handleUpgrade(planId) {
        try {
            const response = await fetch('/api/subscription/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId })
            });
            const { clientSecret } = await response.json();

            const result = await this.stripe.confirmCardPayment(clientSecret);
            if (result.error) {
                throw new Error(result.error.message);
            }

            // Refresh subscription display
            this.loadCurrentSubscription();
            alert('Subscription upgraded successfully!');
        } catch (error) {
            console.error('Error upgrading subscription:', error);
            alert('Failed to upgrade subscription: ' + error.message);
        }
    }

    async handleCancel() {
        if (!confirm('Are you sure you want to cancel your subscription?')) return;

        try {
            await fetch('/api/subscription/cancel', { method: 'POST' });
            this.loadCurrentSubscription();
            alert('Subscription cancelled successfully.');
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            alert('Failed to cancel subscription: ' + error.message);
        }
    }

    async loadBillingHistory() {
        try {
            const response = await fetch('/api/subscription/billing-history');
            const history = await response.json();
            this.updateBillingHistoryUI(history);
        } catch (error) {
            console.error('Error loading billing history:', error);
        }
    }

    updateSubscriptionUI(subscription) {
        // Update plan name and price
        document.getElementById('currentPlanName').textContent = 
            subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
        
        // Update features list
        const featuresList = document.getElementById('currentFeatures');
        featuresList.innerHTML = this.getPlanFeatures(subscription.plan);

        // Update usage statistics
        this.updateUsageStats(subscription.usage);

        // Update buttons visibility
        document.getElementById('upgradePlan').style.display = 
            subscription.plan === 'premium' ? 'none' : 'inline-block';
        document.getElementById('cancelSubscription').style.display = 
            subscription.plan === 'free' ? 'none' : 'inline-block';
    }

    updateBillingHistoryUI(history) {
        const tbody = document.getElementById('billingHistoryTable');
        tbody.innerHTML = history.map(item => `
            <tr>
                <td>${new Date(item.date).toLocaleDateString()}</td>
                <td>${item.description}</td>
                <td>$${(item.amount / 100).toFixed(2)}</td>
                <td><span class="badge bg-${item.status === 'paid' ? 'success' : 'danger'}">${item.status}</span></td>
                <td>
                    ${item.invoiceUrl ? `<a href="${item.invoiceUrl}" target="_blank">View</a>` : '-'}
                </td>
            </tr>
        `).join('');
        
        new bootstrap.Modal(document.getElementById('billingHistoryModal')).show();
    }
}

// Initialize subscription manager
const subscriptionManager = new SubscriptionManager(); 