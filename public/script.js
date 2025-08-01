class CurrencyConverter {
    constructor() {
        this.currencies = [];
        this.exchangeRates = {};
        this.lastUpdate = null;
        this.popularCurrencies = ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];
        
        this.initializeElements();
        this.bindEvents();
        this.loadCurrencies();
        this.startAutoUpdate();
    }

    initializeElements() {
        this.fromCurrency = document.getElementById('fromCurrency');
        this.toCurrency = document.getElementById('toCurrency');
        this.fromAmount = document.getElementById('fromAmount');
        this.toAmount = document.getElementById('toAmount');
        this.convertBtn = document.getElementById('convertBtn');
        this.swapBtn = document.getElementById('swapBtn');
        this.conversionInfo = document.getElementById('conversionInfo');
        this.rateInfo = document.getElementById('rateInfo');
        this.updateInfo = document.getElementById('updateInfo');
        this.lastUpdateElement = document.getElementById('lastUpdate');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.popularCurrenciesContainer = document.getElementById('popularCurrencies');
        this.allCurrenciesContainer = document.getElementById('allCurrencies');
        this.currencySearch = document.getElementById('currencySearch');
    }

    bindEvents() {
        this.fromAmount.addEventListener('input', () => this.handleAmountChange());
        this.fromCurrency.addEventListener('change', () => this.handleCurrencyChange());
        this.toCurrency.addEventListener('change', () => this.handleCurrencyChange());
        this.convertBtn.addEventListener('click', () => this.convert());
        this.swapBtn.addEventListener('click', () => this.swapCurrencies());
        this.currencySearch.addEventListener('input', () => this.filterCurrencies());
    }

    async loadCurrencies() {
        try {
            const response = await fetch('/api/currencies');
            const data = await response.json();
            this.currencies = data.currencies;
            
            this.populateCurrencySelects();
            this.loadPopularCurrencies();
            this.loadAllCurrencies();
            this.updateStatus(true);
        } catch (error) {
            console.error('Erro ao carregar moedas:', error);
            this.updateStatus(false);
        }
    }

    async loadExchangeRates() {
        try {
            const response = await fetch('/api/rates');
            const data = await response.json();
            
            this.exchangeRates = data.rates;
            this.lastUpdate = new Date(data.lastUpdate);
            
            this.updateLastUpdate();
            this.updateStatus(true);
            this.updateCurrencyRates();
        } catch (error) {
            console.error('Erro ao carregar taxas:', error);
            this.updateStatus(false);
        }
    }

    populateCurrencySelects() {
        const options = this.currencies.map(currency => 
            `<option value="${currency}">${currency}</option>`
        ).join('');
        
        this.fromCurrency.innerHTML = '<option value="">Selecione a moeda</option>' + options;
        this.toCurrency.innerHTML = '<option value="">Selecione a moeda</option>' + options;
    }

    loadPopularCurrencies() {
        const popularHtml = this.popularCurrencies.map(currency => {
            const rate = this.exchangeRates[currency] || '--';
            return `
                <div class="currency-item" data-currency="${currency}">
                    <div class="currency-code">${currency}</div>
                    <div class="currency-rate">${rate}</div>
                </div>
            `;
        }).join('');
        
        this.popularCurrenciesContainer.innerHTML = popularHtml;
        
        // Adicionar eventos de clique
        this.popularCurrenciesContainer.querySelectorAll('.currency-item').forEach(item => {
            item.addEventListener('click', () => {
                const currency = item.dataset.currency;
                this.selectCurrency(currency);
            });
        });
    }

    loadAllCurrencies() {
        const allCurrenciesHtml = this.currencies.map(currency => {
            const rate = this.exchangeRates[currency] || '--';
            return `
                <div class="currency-list-item" data-currency="${currency}">
                    <span class="currency-list-code">${currency}</span>
                    <span class="currency-list-rate">${rate}</span>
                </div>
            `;
        }).join('');
        
        this.allCurrenciesContainer.innerHTML = allCurrenciesHtml;
        
        // Adicionar eventos de clique
        this.allCurrenciesContainer.querySelectorAll('.currency-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const currency = item.dataset.currency;
                this.selectCurrency(currency);
            });
        });
    }

    selectCurrency(currency) {
        // Remover seleção anterior
        document.querySelectorAll('.currency-item.selected, .currency-list-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Adicionar seleção atual
        document.querySelectorAll(`[data-currency="${currency}"]`).forEach(item => {
            item.classList.add('selected');
        });
        
        // Se nenhuma moeda de origem estiver selecionada, selecionar esta
        if (!this.fromCurrency.value) {
            this.fromCurrency.value = currency;
            this.handleCurrencyChange();
        } else if (!this.toCurrency.value) {
            this.toCurrency.value = currency;
            this.handleCurrencyChange();
        }
    }

    filterCurrencies() {
        const searchTerm = this.currencySearch.value.toLowerCase();
        const items = this.allCurrenciesContainer.querySelectorAll('.currency-list-item');
        
        items.forEach(item => {
            const currency = item.dataset.currency.toLowerCase();
            if (currency.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    handleAmountChange() {
        this.validateForm();
        if (this.fromAmount.value && this.fromCurrency.value && this.toCurrency.value) {
            this.convert();
        }
    }

    handleCurrencyChange() {
        this.validateForm();
        if (this.fromAmount.value && this.fromCurrency.value && this.toCurrency.value) {
            this.convert();
        }
    }

    validateForm() {
        const isValid = this.fromCurrency.value && this.toCurrency.value && this.fromAmount.value > 0;
        this.convertBtn.disabled = !isValid;
    }

    async convert() {
        if (!this.fromCurrency.value || !this.toCurrency.value || !this.fromAmount.value) {
            return;
        }

        try {
            const response = await fetch(`/api/convert?from=${this.fromCurrency.value}&to=${this.toCurrency.value}&amount=${this.fromAmount.value}`);
            const data = await response.json();
            
            if (data.error) {
                alert(data.error);
                return;
            }
            
            this.toAmount.value = data.convertedAmount;
            this.showConversionInfo(data);
        } catch (error) {
            console.error('Erro na conversão:', error);
            alert('Erro ao converter moedas. Tente novamente.');
        }
    }

    showConversionInfo(data) {
        this.conversionInfo.style.display = 'block';
        this.rateInfo.textContent = `1 ${data.from} = ${data.rate} ${data.to}`;
        this.updateInfo.textContent = this.lastUpdate ? this.lastUpdate.toLocaleString('pt-BR') : '--';
    }

    swapCurrencies() {
        const tempCurrency = this.fromCurrency.value;
        const tempAmount = this.fromAmount.value;
        
        this.fromCurrency.value = this.toCurrency.value;
        this.toCurrency.value = tempCurrency;
        
        this.fromAmount.value = this.toAmount.value;
        this.toAmount.value = tempAmount;
        
        this.handleCurrencyChange();
    }

    updateCurrencyRates() {
        // Atualizar taxas nas listas
        this.currencies.forEach(currency => {
            const rate = this.exchangeRates[currency] || '--';
            document.querySelectorAll(`[data-currency="${currency}"] .currency-rate, [data-currency="${currency}"] .currency-list-rate`).forEach(element => {
                element.textContent = rate;
            });
        });
    }

    updateLastUpdate() {
        if (this.lastUpdate) {
            this.lastUpdateElement.textContent = `Última atualização: ${this.lastUpdate.toLocaleString('pt-BR')}`;
        }
    }

    updateStatus(isOnline) {
        if (isOnline) {
            this.statusIndicator.classList.add('online');
        } else {
            this.statusIndicator.classList.remove('online');
        }
    }

    startAutoUpdate() {
        // Carregar taxas iniciais
        this.loadExchangeRates();
        
        // Atualizar a cada 5 minutos
        setInterval(() => {
            this.loadExchangeRates();
        }, 5 * 60 * 1000);
    }
}

// Inicializar o conversor quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
}); 