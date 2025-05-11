document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    document.querySelectorAll('input[name="params-type"]').forEach(radio => {
      radio.addEventListener('change', function() {
        document.getElementById('general-params').style.display = 'none';
        document.getElementById('dimensions-params').style.display = 'none';
        
        if (this.value === 'general') {
          document.getElementById('general-params').style.display = 'block';
        } else {
          document.getElementById('dimensions-params').style.display = 'block';
        }
      });
    });
  
    // Form submission
    document.getElementById('delivery-calculator').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get calculation type
      const calculationType = document.querySelector('input[name="calculation-type"]:checked').value;
      const serviceType = document.querySelector('input[name="service-type"]:checked').value;
      const paramsType = document.querySelector('input[name="params-type"]:checked').value;
      const insurance = document.getElementById('insurance').checked;
      
      // Get route info
      const fromCity = document.getElementById('route-from').value;
      const toCity = document.getElementById('route-to').value;
      
      // Get cargo parameters based on selected tab
      let volume, weight, quantity, cost, currency, category;
      
      if (paramsType === 'general') {
        volume = parseFloat(document.getElementById('product-volume').value);
        weight = parseFloat(document.getElementById('product-weight').value);
        quantity = parseInt(document.getElementById('product-quantity').value);
        cost = parseFloat(document.getElementById('product-cost').value);
        currency = document.getElementById('product-currency').value;
        category = document.getElementById('product-category').value;
      } else {
        const length = parseFloat(document.getElementById('length').value);
        const width = parseFloat(document.getElementById('width').value);
        const height = parseFloat(document.getElementById('height').value);
        
        volume = (length * width * height) / 1000000; // convert cm³ to m³
        weight = volume * 300; // default density 300 kg/m³ (can be adjusted)
        quantity = parseInt(document.getElementById('dimensions-quantity').value);
        cost = parseFloat(document.getElementById('dimensions-cost').value);
        currency = document.getElementById('dimensions-currency').value;
        category = document.getElementById('dimensions-category').value;
      }
      
      // Convert cost to USD based on currency (simplified, should use API)
      let costUSD = cost;
      if (currency === 'cny') costUSD = cost * 0.14; // example rate
      else if (currency === 'byn') costUSD = cost * 0.4; // example rate
      else if (currency === 'rub') costUSD = cost * 0.01; // example rate
      
      // Calculate density
      const density = weight / volume;
      
      // Calculate delivery cost based on calculation type
      let deliveryCost;
      if (calculationType === 'cargo') {
        // Карго расчет
        deliveryCost = weight * 0.8; // $0.8 per kg
      } else {
        // Таможенный расчет (как в предыдущей версии)
        if (weight <= 24000 && volume <= 60) {
          deliveryCost = 7000; // FTL фиксированная сумма
        } else {
          // Логика для сборного груза на основе плотности
          let deliveryRate;
          if (density >= 1000) deliveryRate = 0.35;
          else if (density >= 500) deliveryRate = 0.30;
          else if (density >= 300) deliveryRate = 0.25;
          else deliveryRate = 0.20;
          
          deliveryCost = deliveryRate * weight;
        }
      }
      
      // Add insurance cost if selected
      if (insurance) {
        deliveryCost += costUSD * 0.01; // 1% of cost
      }
      
      // Calculate customs and VAT for "Таможенный" only
      let customsDuty = 0;
      let vat = 0;
      
      if (calculationType === 'customs') {
        customsDuty = costUSD * 0.01; // 1% пошлина
        vat = (costUSD + customsDuty) * 0.2; // 20% НДС
      }
      
      // Total cost
      const totalCost = costUSD + customsDuty + vat + deliveryCost;
      const unitCost = totalCost / quantity;
      
      // Display results
      document.getElementById('density-result').textContent = density.toFixed(2);
      document.getElementById('delivery-rate-result').textContent = calculationType === 'cargo' ? '0.80 (карго)' : 
        (weight <= 24000 && volume <= 60 ? '7000 (фикс)' : 'по плотности');
      document.getElementById('delivery-cost-result').textContent = deliveryCost.toFixed(2);
      document.getElementById('customs-duty-result').textContent = customsDuty.toFixed(2);
      document.getElementById('vat-result').textContent = vat.toFixed(2);
      document.getElementById('total-cost-result').textContent = totalCost.toFixed(2);
      document.getElementById('unit-cost-result').textContent = unitCost.toFixed(2);
      
      // Show results
      document.getElementById('calculation-result').style.display = 'block';
      document.getElementById('calculation-result').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Keep the existing send request handler
    document.getElementById('send-request-btn').addEventListener('click', function() {
      const name = prompt('Введите ваше имя:');
      const email = prompt('Введите ваш email:');
      const phone = prompt('Введите ваш телефон:');
      
      if (name && email && phone) {
        alert('Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.');
      } else {
        alert('Пожалуйста, заполните все поля!');
      }
    });
  });
