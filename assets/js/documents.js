document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('document-creation-form');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Получаем данные из формы
      const lastName = document.getElementById('last-name').value;
      const firstName = document.getElementById('first-name').value;
      const middleName = document.getElementById('middle-name').value;
      const country = document.getElementById('country').value;
      const city = document.getElementById('city').value;
      const address = document.getElementById('address').value;
      const phone = document.getElementById('phone').value;
      const docType = document.getElementById('document-type').value;
      
      // Создаем содержимое документа
      const docContent = `
        Фамилия: ${lastName}
        Имя: ${firstName}
        Отчество: ${middleName || 'не указано'}
        Страна: ${country}
        Город: ${city}
        Адрес: ${address}
        Телефон: ${phone}
        
        Дата создания: ${new Date().toLocaleDateString()}
      `;
      
      // Создаем документ в зависимости от выбранного типа
      if (docType === 'pdf') {
        createPDF(docContent, `${lastName}_${firstName}_document.pdf`);
      } else {
        createWord(docContent, `${lastName}_${firstName}_document.docx`);
      }
    });
    
    function createPDF(content, filename) {
      // Используем jsPDF для создания PDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Разбиваем текст на строки, чтобы поместились в PDF
      const lines = doc.splitTextToSize(content, 180);
      
      // Добавляем текст в документ
      doc.text(lines, 10, 10);
      
      // Сохраняем PDF
      doc.save(filename);
    }
    
    function createWord(content, filename) {
      // Создаем Blob с содержимым Word документа
      const blob = new Blob([`
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
        xmlns:w='urn:schemas-microsoft-com:office:word' 
        xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="UTF-8">
          <title>Документ</title>
        </head>
        <body>
          <pre>${content}</pre>
        </body>
        </html>
      `], { type: 'application/msword' });
      
      // Создаем ссылку для скачивания
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Получаем все поля ввода в форме документа
    const formInputs = document.querySelectorAll('#document-creation-form .form-input');
    
    // Функция для проверки и обновления состояния label
    function updateLabelState(input) {
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }
    }
    
    // Инициализация - проверяем все поля при загрузке
    formInputs.forEach(input => {
        updateLabelState(input);
        
        // Обработчик изменения значения
        input.addEventListener('input', function() {
            updateLabelState(this);
        });
        
        // Обработчик потери фокуса
        input.addEventListener('blur', function() {
            updateLabelState(this);
        });
    });
    
    // Обработчик отправки формы (опционально)
    document.getElementById('document-creation-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // Здесь можно добавить логику обработки формы
        alert('Форма успешно отправлена!');
    });
});