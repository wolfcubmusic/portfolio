# Арт-дирекшн: «После сигнала»

## Задача

Показать издательству целостную цифровую кампанию книги: жанровый образ, обложка, рекламный текст, читательский сценарий, интерактив и адаптивная реализация. Концептуальная работа, а не опубликованный роман или заказ реального клиента.

## Концепция

Память как плёнка, у которой есть другая сторона. Закрытый приморский санаторий становится носителем прошлого, а три предмета вводят посетителя в историю без пересказа развязки. Основной путь: интрига → интерес к миру → пробное чтение → выбор формата.

Первый экран: «После сигнала. Она узнала свой голос. Но не помнила этих слов». Основной CTA — «Прочитать начало». В финале — «Выбрать издание» с честно обозначенной демонстрацией.

## Система

| Роль | Решение |
| --- | --- |
| Основной цвет | `#111E20`, глубокий морской графит |
| Тёмные разделы | `#0C1719` |
| Бумажные разделы и светлый текст | `#EDE9DF` |
| Акцент | `#E34D38`, индикатор записи / линия на плёнке |
| Крупная типографика | Prata, кириллица и латиница |
| Текст и интерфейс | Manrope, кириллица и латиница |
| Сетка | Широкие внешние поля, асимметричная редакционная колонка; одна колонка на телефоне |
| Иллюстрации | Кинематографичный архитектурный кадр; кодовые предметные композиции улик; HTML/CSS-обложка с читаемой типографикой |
| Движение | Вход первого экрана, появления при прокрутке, смена улики, лёгкий поворот книги при наведении |

Движение запускается однократно, не блокирует чтение и отключается при системном запросе уменьшить анимацию. Звука, автопроигрывания, сложной прокрутки или перехвата скролла нет.

## Визуал

Основной кадр создан встроенным Imagegen. Рабочий PNG сохранён при генерации; веб-версии оптимизированы в WebP без изменения содержимого. Обложка использует тот же кадр, а все надписи остаются живой HTML-типографикой. Кассета, ключ и рамка фотографии построены в CSS.

Файлы: `assets/sanatorium.webp`, `assets/sanatorium-small.webp`, `assets/share.jpg`. Изображение для социальных сетей 1200 × 630 собрано из того же кадра с точной типографикой.

### Финальный промпт изображения (EN)

Use case: photorealistic-natural. Asset type: cinematic background for an editorial Russian psychological thriller book landing page, landscape 3:2 image. A monumental abandoned 1930s seaside sanatorium on a rocky Black Sea promontory at blue hour. Camera low from a wet stone stairway leading toward one huge arched entrance, a single amber light deep in the doorway. The imposing weathered concrete building and arcade occupy the RIGHT two-thirds; LEFT third is quiet shadowy sea, low clouds and near-black negative space suitable for large cream lettering added later. Foreground dark reflective wet rocks, slight sea spray and fog, wind, empty unsettling stillness. Rich textured analogue 35mm cinema still, restrained film grain, subtle halation, deep desaturated petrol green black shadows, grey sea, a tiny amber highlight. Believable physical architecture, elegant composition, quiet literary noir, not fantasy, no horror cliches. No people, no faces, no text, no letters, no numbers, no logos, no border, no watermark. Keep key building and entrance visible in a vertical crop from the right half too. High quality original promotional cinematic photography.

## Текст для описания кейса

«После сигнала» — концептуальный промолендинг психологического триллера. Мы построили сайт вокруг ненадёжной памяти: кассета, ключ и архивная фотография постепенно знакомят читателя с историей. Кинематографичный визуал, редакционная типографика и спокойная анимация связывают первый экран, обложку и читательский сценарий. Сайт включает аннотацию, интерактивные материалы, оригинальный отрывок и демонстрацию выбора издания. Реализация — адаптивные HTML/CSS/JS, публикация на GitHub Pages.

Роли: концепция, арт-дирекшн, тексты, AI-визуал, дизайн обложки, веб-дизайн, анимация и фронтенд. Авторство проекта — WOLFART Design Team / WOLFART BOOKS.

Следующий проект в паре — атмосферное фэнтези с другим визуальным языком. Его разработка не входит в код этого лендинга.
