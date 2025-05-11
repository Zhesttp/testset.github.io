document.getElementById('delivery-calculator').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получаем данные из формы
    const weight = parseFloat(document.getElementById('product-weight').value);
    const volume = parseFloat(document.getElementById('product-volume').value);
    const cost = parseFloat(document.getElementById('product-cost').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);
    const shipmentType = document.querySelector('input[name="shipment-type"]:checked').value;
    
    // Рассчитываем плотность
    const density = weight / volume;
    
    // Определяем тариф доставки на основе плотности
    let deliveryRate;
    if (shipmentType === 'ftl') {
      if (weight <= 24000 && volume <= 60) {
        deliveryRate = 7000;
      } else {
        alert('Для данного груза свяжитесь с менеджером для получения спеццены');
        return;
      }
    } else {
      // Логика для сборного груза на основе плотности
      if (density >= 1000) deliveryRate = 0.35;
      else if (density >= 500) deliveryRate = 0.30;
      else if (density >= 300) deliveryRate = 0.25;
      else deliveryRate = 0.20;
    }
    
    // Рассчитываем стоимость доставки
    let deliveryCost;
    if (shipmentType === 'ftl') {
      deliveryCost = deliveryRate; // для FTL это фиксированная сумма
    } else {
      deliveryCost = deliveryRate * weight;
    }
    
    // Рассчитываем таможенную пошлину (1% от стоимости товара)
    const customsDuty = cost * 0.01;
    
    // Рассчитываем НДС (20% от суммы стоимости товара и пошлины)
    const vat = (cost + customsDuty) * 0.2;
    
    // Итоговая стоимость
    const totalCost = cost + customsDuty + vat + deliveryCost;
    
    // Стоимость единицы товара
    const unitCost = totalCost / quantity;
    
    // Выводим результаты
    document.getElementById('density-result').textContent = density.toFixed(2);
    document.getElementById('delivery-rate-result').textContent = shipmentType === 'ftl' ? '7000 (фикс)' : deliveryRate.toFixed(2);
    document.getElementById('delivery-cost-result').textContent = deliveryCost.toFixed(2);
    document.getElementById('customs-duty-result').textContent = customsDuty.toFixed(2);
    document.getElementById('vat-result').textContent = vat.toFixed(2);
    document.getElementById('total-cost-result').textContent = totalCost.toFixed(2);
    document.getElementById('unit-cost-result').textContent = unitCost.toFixed(2);
    
    // Показываем блок с результатами
    document.getElementById('calculation-result').style.display = 'block';
    
    // Прокручиваем к результатам
    document.getElementById('calculation-result').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Обработчик кнопки отправки заявки
  document.getElementById('send-request-btn').addEventListener('click', function() {
    const name = prompt('Введите ваше имя:');
    const email = prompt('Введите ваш email:');
    const phone = prompt('Введите ваш телефон:');
    
    if (name && email && phone) {
      alert('Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.');
      // Здесь можно добавить отправку данных на сервер
    } else {
      alert('Пожалуйста, заполните все поля!');
    }
  });