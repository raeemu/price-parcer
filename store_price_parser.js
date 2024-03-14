const axios = require('axios'); // Подключение модуля axios для скачивания страницы
const fs = require('fs'); // Подключение встроенного в NodeJS модуля fs для работы с файловой системой
const jsdom = require("jsdom"); // Подключение модуля jsdom для работы с DOM-деревом (1)
const { JSDOM } = jsdom; // Подключение модуля jsdom для работы с DOM-деревом (2)


const baseLink = 'https://arenda-oborudovaniya.akistra.ru/category/' //Базовая ссылка на каталог без указание категории

const linksArray = [                                                 //Массив с окончанием ссылок для перехода к каждой категории
    'oborudovanie-dlya-uplotneniya-grunta/',
    'oborudovanie-dlya-rabot-s-betonom/',
    'oborudovanie-dlya-rezki/',
    'oborudovanie-dlya-rezki/page/2/',
    'shlifovalnoe-oborudovanie/',
    'shlifovalnoe-oborudovanie/page/2/',
    'motopompy/',
    'teplovye-pushki/',
    'teplovye-pushki/page/2/',
    'otbojnye-molotki/',
    'oborudovanie-dlya-uborki/',
    'elektroinstrumenty/',
    'elektroinstrumenty/page/2/',
    'sadovaya-tehnika/',
    'kompressory/'
]

const priceParser = () => {
    for (const links of linksArray) { // сделал циклом, без него не получилось :(

        let link = baseLink + links; // Конструктор ссылки на страницу 

        axios.get(link) // Запрос к странице сайта
            .then(response => {
                let currentPage = response.data;  // Запись полученного результата
                const dom = new JSDOM(currentPage);   // Инициализация библиотеки jsdom для разбора полученных html-данных как в браузере
                let linksLength = dom.window.document.getElementsByClassName('col-md-12 category product__item').length; // Определение количества ссылок на странице               
                let category = dom.window.document.getElementsByClassName('category__content-product')[0].getElementsByTagName('h1')[0].outerHTML; // Берем название категории
                fs.appendFileSync('prices.html', category, (err) => {  //Парсим категорию в документ до цикла
                    if (err) throw err;
                });

                for (let i = 0; i < linksLength; i += 1) {

                    const productName = dom.window.document.getElementsByClassName('container category__container')[0].  // Берем название товара с ссылкой на него
                        getElementsByClassName('col-md-12 category product__item')[i].getElementsByClassName('category product__item-in')[0].
                        getElementsByClassName('category product__name')[0].getElementsByTagName('a')[0].outerHTML;

                    const productPriceDayText = dom.window.document.getElementsByClassName('container category__container')[0]. // Берем текст "цена за сутки" (возможно тут можно сдать лучше)
                        getElementsByClassName('col-md-12 category product__item')[i].getElementsByClassName('category product__item-in')[0].
                        getElementsByClassName('clearboth')[0].getElementsByClassName('category product__price')[0].
                        getElementsByClassName('category product__price-day')[0].getElementsByTagName('span')[0].outerHTML;

                    const productPriceDayActual = dom.window.document.getElementsByClassName('container category__container')[0]. // Берем цену за сутки
                        getElementsByClassName('col-md-12 category product__item')[i].getElementsByClassName('category product__item-in')[0].
                        getElementsByClassName('clearboth')[0].getElementsByClassName('category product__price')[0].
                        getElementsByClassName('category product__price-day')[0].getElementsByTagName('p')[0].outerHTML;

                    const productPriceMonthText = dom.window.document.getElementsByClassName('container category__container')[0]. // Берем текст "цена за месяц"
                        getElementsByClassName('col-md-12 category product__item')[i].getElementsByClassName('category product__item-in')[0].
                        getElementsByClassName('clearboth')[0].getElementsByClassName('category product__price')[0].
                        getElementsByClassName('category product__price-month')[0].getElementsByTagName('span')[0].outerHTML;

                    const productPriceMonthActual = dom.window.document.getElementsByClassName('container category__container')[0]. // Берем цену при оплате за месяц
                        getElementsByClassName('col-md-12 category product__item')[i].getElementsByClassName('category product__item-in')[0].
                        getElementsByClassName('clearboth')[0].getElementsByClassName('category product__price')[0].
                        getElementsByClassName('category product__price-month')[0].getElementsByTagName('p')[0].outerHTML;

                    const itemInfo = `   
                ${productName} 
                ${productPriceDayText} 
                ${productPriceDayActual} 
                ${productPriceMonthText} 
                ${productPriceMonthActual}
                `;                          // собираем инфу о каждом товаре

                    fs.appendFileSync('prices.html', itemInfo, (err) => {  // парсим инфу о товаре
                        if (err) throw err;
                    });
                }
            });
    }
    return
}

priceParser();