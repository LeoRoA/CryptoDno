let actionType;

// Вызов функции загрузки данных при загрузке страницы
document.addEventListener('DOMContentLoaded', loadCoins);

function updatePrices() {
    // Очищаем таблицу перед обновлением
    const tableBody = document.getElementById('coinTableBody');
    tableBody.innerHTML = '';

    // Запрашиваем новые данные о монетах и обновляем таблицу
    loadCoins();
}

// Функция для загрузки данных о монетах и обновления таблицы
function loadCoins() {
    console.log('Loading coins...');
    fetch('/coins')
        .then(response => {
            console.log('Response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
            // Обновление таблицы на основе полученных данных
            updateMainTable(data.results);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Функция для обновления таблицы с данными о монетах
function updateMainTable(coins) {
    console.log('Updating table with coins:', coins);
    const tableBody = document.getElementById('coinTableBody');
    tableBody.innerHTML = ''; // Очистка таблицы перед обновлением

    coins.forEach(coin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${coin.name}</td>
            <td>${coin.amount}</td>
            <td>${coin.deposit}</td>
            <td>${coin.withdrawal}</td>
            <td>${coin.averagePrice}</td>
            <td>${coin.currentPrice}</td>
            <td>${coin.currentBalance.toFixed(2)}</td>
            <td>${coin.lossProfit.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Действие на кнопку buy
function buyCoin() {
    openSellBuyModal("buy"); // Открываем модальное окно
    console.log("Buy button clicked");
}

// Действие на кнопку sell
function sellCoin() {
    openSellBuyModal("sell"); // Открываем модальное окно
    console.log("Sell button clicked");
}

// Функция для открытия модального окна sell\buy
function openSellBuyModal(type) {
    actionType = type;
    const modal = document.getElementById('sellBuyModal');
    modal.getElementsByTagName('button').item(0).textContent = "Submit " + type;
    console.log('mod:', modal.getElementsByTagName('button').item(0).textContent);
    modal.style.display = 'block';
    loadNames();
}

// Функция для загрузки списка имен из базы данных
function loadNames() {
    let url; // URL для получения списка имен
    let selectType; // тип Select-элемента
    if (actionType === 'buy') {
        url = '/coins/allNames';
        selectType = 'coinName';
    } else if (actionType === 'sell') {
        url = '/coins/availableNames';
        selectType = 'coinName';
    } else if (actionType === 'history') {
        url = '/coins/availableNames';
        selectType = 'coinHistoryName';
    }else if (actionType === 'checkLoss') {
        url = '/coins/allNames';
        selectType = 'coinLossName';
    }
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const coinNameSelect = document.getElementById(selectType);
            // Очищаем существующие опции
            coinNameSelect.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            defaultOption.textContent = 'Choose coin';
            coinNameSelect.appendChild(defaultOption);
            // Добавляем новые опции из полученных данных
            data.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                coinNameSelect.appendChild(option);
            });
            if (actionType === 'buy' || actionType === 'checkLoss') {
                const otherOption = document.createElement('option');
                otherOption.value = 'add...';
                otherOption.textContent = "add...";
                coinNameSelect.appendChild(otherOption);
            }
        })
        .catch(error => console.error('Error loading names:', error));
}

// Кнопка подтверждения добавления операции sell\buy
function submitForm() {
    const formData = {
        name: document.getElementById('coinName').value,
        amount: parseFloat(document.getElementById('amount').value),
        opTime: new Date().toISOString(),
        operationPrice: parseFloat(document.getElementById('operationPrice').value)
    };

    let url;
    if (actionType === 'buy') {
        url = '/coins/buy'; // URL для покупки
    } else if (actionType === 'sell') {
        url = '/coins/sell'; // URL для продажи
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            closeModal(); // Закрываем модальное окно после выполнения запроса
            // loadCoins(); // Обновляем таблицу с данными
        })
        .catch(error => console.error('Error:', error));
}

// Действие на кнопку history
function getHistory() {
    openHistoryModal(); // Открываем модальное окно
    console.log("History button clicked");
}

// Функция для открытия модального окна истории операций
function openHistoryModal() {
    const modal = document.getElementById('historyModal');
    modal.style.display = 'block';
    actionType = 'history';
    loadNames();
    document.getElementById('coinHistoryName').addEventListener('change', function () {
        const selectedCoinName = this.value; // Получаем выбранное значение из списка
        const formData = {name: selectedCoinName};
        updateHistoryTable(formData)
    });
}

// Функция для обновления таблицы с историями операций о монетах
function updateHistoryTable(coinName) {
    console.log('Updating table with coin:', coinName);
    fetch(`/coins/history/${coinName.name}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('historyTableBody');
            tableBody.innerHTML = ''; // Очистка таблицы перед обновлением

            data.forEach(coin => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td>${coin.id}</td>
<!--            <td>${coin.name}</td>-->
            <td>${coin.amount}</td>
            <td>${coin.operationPrice}</td>
            <td>${coin.opTime}</td>
        `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error))

}


function checkLossCoin() {
    openCheckLossModal(); // Открываем модальное окно
    console.log("CheckLoss button clicked");
}

function loadAvailableNames() {

    fetch('/coins/availableNames')
        .then(response => response.json())
        .then(data => {
            const coinNameSelect = document.getElementById('coinHistoryName');
            // Очищаем существующие опции
            coinNameSelect.innerHTML = 'Выберете монету';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            defaultOption.textContent = 'Choose coin';
            coinNameSelect.appendChild(defaultOption);
            // Добавляем новые опции из полученных данных
            data.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                coinNameSelect.appendChild(option);
            });

        })
        .catch(error => console.error('Error loading names:', error));
}

function openCheckLossModal() {
    const modal = document.getElementById('checkLossModal');
    modal.style.display = 'block';

    addRow();
}

function addRow() {
    const tableBody = document.getElementById('checkLossTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>
            <select id="coinLossName" onchange="chooseCoin(this)">
                <option value="Выберите монету"></option>
            </select>
        </td>
        <td><input type="text" class="purchaseAmount" onchange="updateSum(this)" ></td>
        <td><input type="text" class="purchaseRate" onchange="updateRow(this)" ></td>
        <td><input type="text" class="purchaseSum" onchange="updateAmount(this)" ></td>
        <td><label class="averageRate"></td>
        <td><label class="depositAfterAverage"></td>
        <td><label class="profit"></td>
    `;
    tableBody.appendChild(newRow);

    actionType = 'checkLoss';
    loadNames();
    // loadAvailableCoins(); // При добавлении строки загружаем доступные монеты
}

function chooseCoin(element) {
    const row = element.parentNode.parentNode;

    const tableBody = document.getElementById('checkLossTableBody');
    // const coinNameSelect = row.querySelector('.coinLossName');
const coinNameSelect = document.getElementById('coinLossName');
    console.log('row:',row);
    console.log('t:',tableBody);
    // console.log('cs:',coinNameSelect.textContent);
    // console.log('cs:',coinNameSelect.outerText);
    // console.log('cs:',coinNameSelect.innerText);
    console.log('cs:',coinNameSelect);

    // Замена выпадающего списка на текстовое поле с выбранным значением
    const coinNameLabel = document.createElement('label');
    // const modalContent = document.querySelector('.modal-content');

    if (coinNameSelect.value === 'add...') {
        // const coinNameInput = document.createElement('input');
        // coinNameInput.setAttribute('type', 'text');
        // coinNameInput.setAttribute('id', 'coinLossName'); // или замените на нужный класс
        //
        const newRow = document.createElement('tr');
        console.log('nr:',newRow);
        // const newInputHTML = '<input type="text" class="coinLossNameInput" value="' + coinNameSelect.value + '">';

        newRow.innerHTML='<td><input type="text" id="coinLossName" ></td>'
        // tableBody.appendChild(newRow);
        coinNameSelect.parentNode.replaceChild(newRow, coinNameSelect);
        // Вставляем HTML-разметку после элемента селектора
        // coinNameSelect.insertAdjacentHTML/('afterend', newInputHTML);

    } else {
        coinNameLabel.textContent = coinNameSelect.value;
        coinNameSelect.parentNode.replaceChild(coinNameLabel, coinNameSelect);

    }
    console.log('csEx:',coinNameSelect);
setCoinName(coinNameSelect);

}

function setCoinName(coinNameSelect) {
    // console.log('elemCo:', element);
    // const row = element.parentNode.parentNode;
    // const coinNameSelect = row.querySelector('.coinLossName');
    const coinName = coinNameSelect.value;
    console.log('row:', coinName);

    const mainTableRow = Array.from(document.querySelectorAll('#coinsTable tbody tr')).find(row => row.querySelector('td:first-child').textContent === coinName);
    console.log(mainTableRow)
    if (mainTableRow) {

        // Получение данных из основной таблицы

        const mainAmount = parseFloat(mainTableRow.querySelector('td:nth-child(2)').textContent);
        const mainAveragePrice = parseFloat(mainTableRow.querySelector('td:nth-child(5)').textContent);
        const mainCurrentPrice = parseFloat(mainTableRow.querySelector('td:nth-child(6)').textContent);
        const mainCurrentBalance = parseFloat(mainTableRow.querySelector('td:nth-child(7)').textContent);


        // Установка текущих значений в таблицу
        row.querySelector('.purchaseRate').value = mainCurrentPrice.toString();
        row.querySelector('.purchaseAmount').textContent = mainAmount.toString();

        row.querySelector('.averageRate').textContent = mainAveragePrice.toString();
        row.querySelector('.depositAfterAverage').textContent = (mainAmount * mainAveragePrice).toString();
        row.querySelector('.profit').textContent = (mainCurrentBalance).toString();
    } else {
        row.querySelector('.averageRate').textContent = "0";
        row.querySelector('.purchaseAmount').textContent = "0";

        row.querySelector('.depositAfterAverage').textContent = "0";
        row.querySelector('.profit').textContent = "0";
    }


}

function updateRow(element) {
    const row = element.parentNode.parentNode;

    if (row.querySelector('.purchaseAmount').textContent) {
        const oldAmount = parseFloat((row.querySelector('.purchaseAmount')).textContent);
        const averageRateInput = row.querySelector('.averageRate');
        const depositAfterAverage = row.querySelector('.depositAfterAverage');
        const currentPriceAverageBalance = row.querySelector('.profit');

        const inputAmount = parseFloat(row.querySelector('.purchaseAmount').value);
        // Расчет нового количества
        const depositNewInput = parseFloat(row.querySelector('.purchaseSum').value)
            + parseFloat(row.querySelector('.depositAfterAverage').textContent);
        const oldRate = parseFloat(row.querySelector('.averageRate').textContent);
        const amountAverage = inputAmount + (oldAmount);

        // // Рассчет курса усреднения
        const averageRate = depositNewInput / amountAverage;
        averageRateInput.textContent = averageRate.toFixed(6);

        // // Расчет депозита после усреднения

        console.log('purch:', row.querySelector('.purchaseSum').value);
        depositAfterAverage.textContent = depositNewInput.toString();

        // // Расчет баланса
        const profit = parseFloat(row.querySelector('.averageRate').textContent) * amountAverage;
        currentPriceAverageBalance.textContent = profit.toFixed(2).toString();
    }
}

// Обновление суммы при вводе значения количества закупа (взаимоисключающее с updateAmount)
function updateSum(element) {
    const row = element.parentNode.parentNode;
    const purchaseAmount = row.querySelector('.purchaseAmount').value;
    row.querySelector('.purchaseSum').value =
        purchaseAmount * parseFloat(row.querySelector('.purchaseRate').value);
    console.log('purch:', element);
    updateRow(element);
}

// Обновление количества при вводе суммы закупа (взаимоисключающее с updateSum)
function updateAmount(element) {
    const row = element.parentNode.parentNode;
    const purchaseSum = parseFloat(row.querySelector('.purchaseSum').value);
    row.querySelector('.purchaseAmount').value =
        purchaseSum / parseFloat(row.querySelector('.purchaseRate').value);
    updateRow(element);
}

function loadAvailableCoins() {
    fetch('/coins/availableNames')
        .then(response => response.json())
        .then(data => {
            const selectElements = document.querySelectorAll('.coinLossName');

            selectElements.forEach(selectElement => {
                // Если элемент - выпадающий список, создаем варианты выбора монет
                selectElement.innerHTML = ''; // Очищаем список монет перед загрузкой

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                defaultOption.textContent = 'Choose coin';
                selectElement.appendChild(defaultOption);
                data.forEach(coinName => {
                    const option = document.createElement('option');
                    option.value = coinName;
                    option.textContent = coinName;
                    selectElement.appendChild(option);
                });
                const otherOption = document.createElement('option');
                otherOption.value = '';
                // otherOption.disabled = true;
                // otherOption.selected = true;
                otherOption.textContent = 'add...';
                selectElement.appendChild(otherOption);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Выбираем все элементы с классом "clear" и добавляем обработчик события для закрытия модального окна
const clearButtons = document.querySelectorAll('.clear');
clearButtons.forEach(button => {
    button.addEventListener('click', clearModal)
});

function clearModal() {
    const tableBody = document.getElementById('checkLossTableBody');
    tableBody.innerHTML = '';
    addRow();
}


// Выбираем все элементы с классом "close" и добавляем обработчик события для закрытия модального окна
const closeButtons = document.querySelectorAll('.close');
closeButtons.forEach(button => {
    button.addEventListener('click', closeModal)

});

// Функция для закрытия модального окна
function closeModal() {
    const modalSell = document.getElementById('sellBuyModal');
    const modalHistory = document.getElementById('historyModal');
    const modalCheckLoss = document.getElementById('checkLossModal')
    modalSell.style.display = 'none';
    modalHistory.style.display = 'none';
    modalCheckLoss.style.display = 'none'
    loadCoins();
}

// Обработчик события нажатия клавиши
//
// document.addEventListener('keydown', function(event) {
//     if (event.key === 'Escape') {
//         closeModal(); // Закрыть модальное окно при нажатии на клавишу Esc
//     }
// });
