let items = [
    "Сделать проектную работу",
    "Полить цветы",
    "Пройти туториал по Реакту",
    "Сделать фронт для своего проекта",
    "Прогуляться по улице в солнечный день",
    "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

// Функция загрузки задач из localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        return JSON.parse(savedTasks);
    }

    return items;
}

// Функция получения всех задач из DOM
function getTasksFromDOM() {
    const itemsNamesElements = document.querySelectorAll('.to-do__item-text');
    const tasks = [];

    itemsNamesElements.forEach(function (element) {
        tasks.push(element.textContent);
    });

    return tasks;
}

// Функция сохранения массива задач в localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Функция обновления localStorage после изменений в DOM
function updateStorage() {
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);

    return currentTasks;
}

// Функция создания нового элемента задачи на основе шаблона
function createItem(item) {  // возвращает готовый HTML-элемент задачи
    const template = document.getElementById("to-do__item-template");
    const clone = template.content.querySelector(".to-do__item").cloneNode(true); // полностью копируем задачу
    const textElement = clone.querySelector(".to-do__item-text");
    const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
    const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
    const editButton = clone.querySelector(".to-do__item-button_type_edit");

    // Устанавливаем текст задачи
    textElement.textContent = item;

    // Обработчик для кнопки удаления
    deleteButton.addEventListener('click', function () {
        clone.remove();
        updateStorage()
    });

    // Обработчик для кнопки копирования
    duplicateButton.addEventListener('click', function () {
        const itemName = textElement.textContent;
        const newItem = createItem(itemName);
        listElement.prepend(newItem);
        updateStorage()
    });

    // Обработчик для кнопки редактирования
    editButton.addEventListener('click', function () {
        textElement.setAttribute('contenteditable', 'true');
        textElement.focus();
    });

    textElement.addEventListener('blur', function () {
        textElement.setAttribute('contenteditable', 'false');
        updateStorage();
    });

    // Обработчик для сохранения при нажатии Enter
    textElement.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            textElement.blur();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            textElement.textContent = item;
            textElement.blur();
        }
    });

    return clone;
}

// Инициализация при загрузке страницы
items = loadTasks();
items.forEach(function (item) {
    const newItem = createItem(item);
    listElement.append(newItem);
});

// Обработчик отправки формы
formElement.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const taskText = inputElement.value.trim();

    if (taskText) {
        const newItem = createItem(taskText);
        listElement.prepend(newItem);
        items = updateStorage();
        inputElement.value = '';
    }
});