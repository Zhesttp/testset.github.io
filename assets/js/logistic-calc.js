document.addEventListener('DOMContentLoaded', function() {
    // Таблица тарифов по плотности
    const densityRates = [
        { minDensity: 1000, rate: 0.625 },
        { minDensity: 800, rate: 0.675 },
        { minDensity: 600, rate: 0.725 },
        { minDensity: 500, rate: 0.775 },
        { minDensity: 400, rate: 0.800 },
        { minDensity: 350, rate: 0.850 },
        { minDensity: 300, rate: 0.875 },
        { minDensity: 250, rate: 0.900 },
        { minDensity: 200, rate: 0.925 },
        { minDensity: 190, rate: 0.950 },
        { minDensity: 180, rate: 0.975 },
        { minDensity: 170, rate: 1.000 },
        { minDensity: 160, rate: 1.025 },
        { minDensity: 150, rate: 1.050 },
        { minDensity: 140, rate: 1.100 },
        { minDensity: 130, rate: 1.150 },
        { minDensity: 120, rate: 1.200 },
        { minDensity: 110, rate: 1.250 },
        { minDensity: 100, rate: 1.300 }
    ];

    // Список товаров с кодами ТНВЭД и пошлинами
    const productDatabase = [
        { name: "Электродвигатель 100Вт", code: "8501.31.000.0", duty: 0.05 },
        { name: "Электродвигатель 500Вт", code: "8501.32.000.0", duty: 0.05 },
        { name: "Кроссовки спортивные", code: "6403.91.900.0", duty: 0.10 },
        { name: "Смартфон", code: "8517.12.000.0", duty: 0.00 },
        { name: "Ноутбук", code: "8471.30.000.0", duty: 0.00 },
        { name: "Одежда детская", code: "6111.20.100.0", duty: 0.15 }
    ];

    // Поиск товара
    const productNameInput = document.getElementById('product-name');
    const tnvedCodeInput = document.getElementById('tnved-code');
    const suggestionsBox = document.getElementById('product-suggestions');

    if (productNameInput && tnvedCodeInput && suggestionsBox) {
        productNameInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            if (query.length < 2) {
                suggestionsBox.style.display = 'none';
                return;
            }
            
            const suggestions = productDatabase.filter(item => 
                item.name.toLowerCase().includes(query)
            );
            
            suggestionsBox.innerHTML = '';
            
            if (suggestions.length > 0) {
                suggestions.forEach(item => {
                    const div = document.createElement('div');
                    div.textContent = `${item.name} (${item.code})`;
                    div.addEventListener('click', () => {
                        productNameInput.value = item.name;
                        tnvedCodeInput.value = item.code;
                        suggestionsBox.style.display = 'none';
                    });
                    suggestionsBox.appendChild(div);
                });
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        });
    }

    // Форма расчета
    const calculatorForm = document.getElementById('delivery-calculator');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const fromCity = document.getElementById('route-from')?.value || '';
            const toCity = document.getElementById('route-to')?.value || '';
            const productName = document.getElementById('product-name')?.value || '';
            const tnvedCode = document.getElementById('tnved-code')?.value || '';
            const transportType = document.querySelector('input[name="transport-type"]:checked')?.value || 'ltl';
            const weight = parseFloat(document.getElementById('product-weight')?.value) || 0;
            const volume = parseFloat(document.getElementById('product-volume')?.value) || 0;
            const quantity = parseInt(document.getElementById('product-quantity')?.value) || 1;
            const cost = parseFloat(document.getElementById('product-cost')?.value) || 0;
            const currency = document.getElementById('product-currency')?.value || 'usd';
            
            // Находим товар в базе для определения пошлины
            const product = productDatabase.find(item => item.code === tnvedCode) || 
                           { duty: 0.10 }; // Пошлина по умолчанию 10%
            
            // Проверка на FTL с превышением лимитов
            if (transportType === 'ftl' && (weight > 24000 || volume > 60)) {
                showResult(`
                    <div class="result-title">Результаты расчета</div>
                    <div class="result-grid">
                        <div class="result-item">
                            <span class="result-label">Тип перевозки:</span>
                            <span class="result-value">FTL (превышены лимиты)</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Вес:</span>
                            <span class="result-value">${weight} кг</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Объем:</span>
                            <span class="result-value">${volume} м³</span>
                        </div>
                        <div class="result-item total">
                            <span class="result-label">Для грузов свыше 24000 кг или 60 м³</span>
                            <span class="result-value">Свяжитесь с менеджером для получения спеццены</span>
                        </div>
                    </div>
                    <button id="contact-manager-btn" class="request-btn">Связаться с менеджером</button>
                `, true);
                return;
            }
            
            // Конвертируем стоимость в USD
            let costUSD = convertToUSD(cost, currency);
            
            // Рассчитываем плотность
            const density = weight / volume;
            
            // Рассчитываем пошлину и НДС
            const duty = costUSD * product.duty;
            const vat = (costUSD + duty) * 0.2;
            
            // Рассчитываем стоимость доставки
            const { deliveryCost, deliveryRate } = calculateDeliveryCost(transportType, weight, volume, density);
            
            // Общая стоимость
            const totalCost = costUSD + duty + vat + deliveryCost;
            const unitCost = totalCost / quantity;
            
            // Отображаем результаты
            showResult(`
                <div class="result-title">Результаты расчета</div>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="result-label">Маршрут:</span>
                        <span class="result-value">${getCityName('route-from')} → ${getCityName('route-to')}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Товар:</span>
                        <span class="result-value">${productName} (${tnvedCode})</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Тип перевозки:</span>
                        <span class="result-value">${transportType === 'ftl' ? 'FTL (полная загрузка)' : 'LTL (сборный груз)'}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Плотность груза (кг/м³):</span>
                        <span class="result-value">${density.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Ставка доставки ($/кг):</span>
                        <span class="result-value">${deliveryRate.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Стоимость товара:</span>
                        <span class="result-value">${costUSD.toFixed(2)} $</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Таможенная пошлина (${(product.duty * 100).toFixed(1)}%):</span>
                        <span class="result-value">${duty.toFixed(2)} $</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">НДС (20%):</span>
                        <span class="result-value">${vat.toFixed(2)} $</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Стоимость доставки:</span>
                        <span class="result-value">${deliveryCost.toFixed(2)} $</span>
                    </div>
                    <div class="result-item total">
                        <span class="result-label">ИТОГО:</span>
                        <span class="result-value">${totalCost.toFixed(2)} $</span>
                    </div>
                    <div class="result-item total">
                        <span class="result-label">Стоимость единицы товара:</span>
                        <span class="result-value">${unitCost.toFixed(2)} $</span>
                    </div>
                </div>
                <button id="send-request-btn" class="request-btn">Отправить заявку</button>
            `, false);
        });
    }

    // Вспомогательные функции
    function convertToUSD(amount, currency) {
        const rates = { usd: 1, cny: 0.14, byn: 0.4, rub: 0.01 };
        return amount * (rates[currency] || 1);
    }

    function calculateDeliveryCost(transportType, weight, volume, density) {
        if (transportType === 'ftl') {
            return {
                deliveryCost: 7000,
                deliveryRate: 7000 / weight
            };
        }
        
        // Находим ставку по плотности для LTL
        let deliveryRate = 0.35; // значение по умолчанию
        for (const { minDensity, rate } of densityRates) {
            if (density >= minDensity) {
                deliveryRate = rate;
                break;
            }
        }
        
        return {
            deliveryCost: deliveryRate * weight,
            deliveryRate
        };
    }

    function getCityName(selectId) {
        const select = document.getElementById(selectId);
        return select?.options[select.selectedIndex]?.text || '';
    }

    function showResult(html, isContactManager) {
        const resultSection = document.getElementById('calculation-result');
        if (!resultSection) return;
        
        resultSection.innerHTML = html;
        resultSection.style.display = 'block';
        
        if (isContactManager) {
            const contactBtn = document.getElementById('contact-manager-btn');
            if (contactBtn) {
                contactBtn.addEventListener('click', contactManager);
            }
        } else {
            const sendBtn = document.getElementById('send-request-btn');
            if (sendBtn) {
                sendBtn.addEventListener('click', sendRequest);
            }
        }
        
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    function contactManager() {
        const name = prompt('Введите ваше имя:');
        const email = prompt('Введите ваш email:');
        const phone = prompt('Введите ваш телефон:');
        
        if (name && email && phone) {
            alert('Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.');
        }
    }

    function sendRequest() {
        // Создаем модальное окно
        const modalHTML = `
            <div class="modal-overlay" id="request-modal">
                <div class="modal-content">
                    <h3>Отправить заявку</h3>
                    <div class="form-group-modal">
                        <label for="client-name">Ваше имя:</label>
                        <input type="text" id="client-name" required>
                    </div>
                    <div class="form-group-modal">
                        <label for="client-email">Email:</label>
                        <input type="email" id="client-email" required>
                    </div>
                    <div class="form-group-modal">
                        <label for="client-phone">Телефон:</label>
                        <input type="tel" id="client-phone" required>
                    </div>
                    <div class="form-group-modal">
                        <label for="client-comments">Комментарий:</label>
                        <input type="text" id="client-comments">
                    </div>
                    <div class="modal-buttons">
                        <button class="cancel-btn" id="cancel-request">Отмена</button>
                        <button class="submit-btn" id="submit-request">Отправить</button>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем модальное окно в DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('request-modal');
        modal.style.display = 'flex';
        
        // Обработчики кнопок
        document.getElementById('cancel-request').addEventListener('click', () => {
            modal.remove();
        });
        
        document.getElementById('submit-request').addEventListener('click', () => {
            const name = document.getElementById('client-name').value;
            const email = document.getElementById('client-email').value;
            const phone = document.getElementById('client-phone').value;
            const comments = document.getElementById('client-comments').value;
            
            if (!name || !email || !phone) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            // Собираем данные для отправки
            const formData = {
                name,
                email,
                phone,
                comments,
                calculationData: getCalculationData() // Получаем данные расчета
            };
            
            // Отправляем данные
            sendEmail(formData);
            
            // Закрываем модальное окно
            modal.remove();
            alert('Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.');
        });
    }
    
    function getCalculationData() {
        const resultItems = document.querySelectorAll('.result-item');
        let results = '';
        
        resultItems.forEach(item => {
            const label = item.querySelector('.result-label').textContent;
            const value = item.querySelector('.result-value').textContent;
            results += `${label} ${value}\n`;
        });
        
        return results;
    }
    
    function sendEmail(data) {
        const botToken = '7922779742:AAFFA_3OlznkAhuB2tE1we2OzbttMY0AYbU';
        const chatId = '656829538';
        
        // Форматируем текст с HTML-разметкой для Telegram
        const text = `
    <b>🚚 Новая заявка на доставку</b>
    
    <b>👤 Контактные данные:</b>
    <i>Имя:</i> <b>${data.name || 'Не указано'}</b>
    <i>Телефон:</i> <code>${data.phone || 'Не указан'}</code>
    <i>Email:</i> <code>${data.email || 'Не указан'}</code>
    <i>Комментарий:</i> ${data.comments || 'Нет комментариев'}
    
    <b>📊 Данные расчета:</b>
    <pre>${formatCalculationData(data.calculationData)}</pre>
    
    <i>📅 ${new Date().toLocaleString()}</i>
        `;
    
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        })
        .then(() => alert('✅ Заявка успешно отправлена!'))
        .catch(() => alert('❌ Ошибка отправки заявки'));
    }
    
    // Функция для форматирования данных расчета
    function formatCalculationData(rawData) {
        if (!rawData) return 'Нет данных расчета';
        
        // Разделяем строки и форматируем
        const lines = rawData.split('\n')
            .filter(line => line.trim())
            .map(line => {
                // Разделяем метку и значение
                const parts = line.split(':');
                if (parts.length < 2) return line;
                
                const label = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                
                return `<i>${label}:</i> <b>${value}</b>`;
            });
        
        return lines.join('\n');
    }
});






document.addEventListener('DOMContentLoaded', function() {
    const calculator = document.querySelector('.calculator');
    const logo = document.querySelector('.header--logo');
    
    if (calculator && logo) {
      calculator.addEventListener('scroll', function() {
        const scrollPosition = this.scrollTop;
        const opacity = Math.min(scrollPosition / 100, 0.7);
        logo.style.backgroundColor = `rgba(15, 15, 15, ${opacity})`;
      });
    }
  });