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
            <td>${coin.deposit.toFixed(2)}</td>
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
    // button.value='Submit '+type;
    const modal = document.getElementById('sellBuyModal');
    modal.getElementsByTagName('button').item(0).textContent = "Submit " + type;
    console.log('mod:',modal.getElementsByTagName('button').item(0).textContent);
    modal.style.display = 'block';
    loadNames();
}
// Функция для загрузки списка имен из базы данных
function loadNames() {
    let url;
    if (actionType === 'buy') {
        url = '/coins/allNames'; // URL для получения списка имен для покупки
    } else if (actionType === 'sell') {
        url = '/coins/availableNames'; // URL для получения списка имен для продажи
    }
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const coinNameSelect = document.getElementById('coinName');
            // Очищаем существующие опции
            // coinNameSelect.innerHTML = '';
            coinNameSelect.innerHTML = 'Выберете монету'
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
            loadCoins(); // Обновляем таблицу с данными
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
    loadAvailableNames();
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
            <select class="coinLossName" onchange="setCoinName(this)">
            
                <option value="Выберите монету"></option>
                
            </select>
        </td>
        <td><input type="text" class="purchaseRate" /*onchange="updateRow(this)"*/ ></td>
        <td><input type="text" class="purchaseAmount" onchange="updateSum(this)" ></td>
        <td><input type="text" class="purchaseSum" onchange="updateAmount(this)" ></td>
        <td><label class="averageRate"></td>
        <td><label class="depositAfterAverage"></td>
        <td><label class="profit"></td>
    `;
    tableBody.appendChild(newRow);
    loadAvailableCoins(); // При добавлении строки загружаем доступные монеты

}

function updateRow(element) {
    console.log('elem:', element);
    const row = element.parentNode.parentNode;
    console.log('row:', row);

    const averageRateInput = row.querySelector('.averageRate');
    const depositAfterAverage = row.querySelector('.depositAfterAverage');
    console.log('dep:', depositAfterAverage);
    const currentPriceAverageBalance = row.querySelector('.profit');
    const oldAmount = ((row.querySelector('.purchaseAmount')).textContent);
    console.log('puA:', oldAmount);

    // Расчет нового количества

    const depositNewInput = parseFloat(row.querySelector('.purchaseSum').value)
        + parseFloat(row.querySelector('.depositAfterAverage').textContent);
    console.log('avDep:', depositNewInput);
    const inputAmount = parseFloat(row.querySelector('.purchaseAmount').value);
    console.log('amIn:', inputAmount);
    const oldRate = parseFloat(row.querySelector('.averageRate').textContent);
    console.log('oldR:', oldRate);
    const amountAverage = inputAmount + parseFloat(oldAmount);
    console.log('avAm:', amountAverage);
    // // Рассчет курса усреднения
    const averageRate = depositNewInput / amountAverage;
    console.log('avRate:', averageRate);
    averageRateInput.textContent = averageRate.toFixed(6);

    // // Расчет депозита после усреднения

    console.log('purch:', row.querySelector('.purchaseSum').value);
    depositAfterAverage.textContent = depositNewInput.toString();

    // // Расчет баланса
    const profit = parseFloat(row.querySelector('.averageRate').textContent) * amountAverage;
    currentPriceAverageBalance.textContent = profit.toFixed(2).toString();
}

function setCoinName(element) {
    console.log('elemCo:', element);
    const row = element.parentNode.parentNode;
    const coinNameSelect = row.querySelector('.coinLossName');
    const coinName = coinNameSelect.value;
    console.log('row:', row);
    // const averageRateInput = row.querySelector('.averageRate');
    // const depositAfterAverageInput = row.querySelector('.depositAfterAverage');
    // const profitInput = row.querySelector('.profit');

    // Замена выпадающего списка на текстовое поле с выбранным значением
    const coinNameLabel = document.createElement('label');
    coinNameLabel.textContent = coinNameSelect.value;
    coinNameSelect.parentNode.replaceChild(coinNameLabel, coinNameSelect);

    // Получение данных из основной таблицы
    const mainTableRow = Array.from(document.querySelectorAll('#coinsTable tbody tr'))
        .find(row => row.querySelector('td:first-child')
            .textContent === coinName);
    console.log(mainTableRow);
    const mainAmount = parseFloat(mainTableRow.querySelector('td:nth-child(2)').textContent);
    const mainAveragePrice = parseFloat(mainTableRow.querySelector('td:nth-child(4)').textContent);
    const mainCurrentPrice = parseFloat(mainTableRow.querySelector('td:nth-child(6)').textContent);
    const mainCurrentBalance = parseFloat(mainTableRow.querySelector('td:nth-child(7)').textContent);


    // Установка текущих значений в таблицу
    row.querySelector('.purchaseAmount').textContent = mainAmount.toString();
    row.querySelector('.purchaseRate').textContent = mainCurrentPrice.toString();
    row.querySelector('.purchaseRate').value = mainCurrentPrice.toString();

    row.querySelector('.averageRate').textContent = mainAveragePrice.toString();
    row.querySelector('.depositAfterAverage').textContent = (mainAmount * mainAveragePrice).toString();
    row.querySelector('.profit').textContent = (mainCurrentBalance).toString();

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
    updateRow(this);
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
    // loadCoins();
}

// Обработчик события нажатия клавиши
//
// document.addEventListener('keydown', function(event) {
//     if (event.key === 'Escape') {
//         closeModal(); // Закрыть модальное окно при нажатии на клавишу Esc
//     }
// });
