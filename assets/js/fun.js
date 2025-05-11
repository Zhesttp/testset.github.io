$('.calculator-btn').click(function() {
    // Находим индекс раздела с id="Layer_1_2" в структуре навигации
    const targetIndex = $('.main-content .section').index($('#Layer_1_2').closest('.section'));
    
    if (targetIndex >= 0) {
        const curActive = $('.side-nav').find('.is-active');
        const curPos = $('.side-nav').children().index(curActive);
        const lastItem = $('.side-nav').children().length - 1;
        
        updateNavs(targetIndex);
        updateContent(curPos, targetIndex, lastItem);
    }
});


function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Удаляем активный класс у всех секций
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('section--is-active');
        });
        
        // Добавляем активный класс выбранной секции
        section.classList.add('section--is-active');
        
        // Прокрутка к секции
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Инициализация кнопок навигации
document.addEventListener('DOMContentLoaded', function() {
    // Навигация в side-nav
    const sideNavItems = document.querySelectorAll('.side-nav li');
    sideNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const index = Array.from(sideNavItems).indexOf(this);
            const sections = document.querySelectorAll('.l-section.section');
            
            // Удаляем активный класс у всех элементов
            sideNavItems.forEach(i => i.classList.remove('is-active'));
            sections.forEach(sec => sec.classList.remove('section--is-active'));
            
            // Добавляем активный класс выбранному элементу и соответствующей секции
            this.classList.add('is-active');
            sections[index].classList.add('section--is-active');
        });
    });
    
    // Навигация в outer-nav
    const outerNavItems = document.querySelectorAll('.outer-nav li');
    outerNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const index = Array.from(outerNavItems).indexOf(this);
            const sections = document.querySelectorAll('.l-section.section');
            
            // Удаляем активный класс у всех элементов
            outerNavItems.forEach(i => i.classList.remove('is-active'));
            sections.forEach(sec => sec.classList.remove('section--is-active'));
            
            // Добавляем активный класс выбранному элементу и соответствующей секции
            this.classList.add('is-active');
            sections[index].classList.add('section--is-active');
        });
    });
});