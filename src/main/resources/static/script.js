let actionType;

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

// Функция для открытия модального окна
function openSellBuyModal(type) {
    actionType = type;

    const modal = document.getElementById('sellBuyModal');
    modal.style.display = 'block';
    loadNames();

}

// Функция для открытия модального окна
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
function openCheckLossModal() {
    const modal = document.getElementById('checkLossModal');
    modal.style.display = 'block';
    // addRow();

}


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
            <td>${coin.currentPrice}</td>
            <td>${coin.currentBalance.toFixed(2)}</td>
            <td>${coin.lossProfit.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Функция для обновления таблицы с данными о монетах
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
            <td>${coin.opTime}</td>
            <td>${coin.operationPrice}</td>
        `;
                tableBody.appendChild(row);
            });

        })
        .catch(error => console.error('Error:', error))

}


// Функция для отправки POST-запроса на сервер для покупки монеты
function buyCoin() {
    openSellBuyModal("buy"); // Открываем модальное окно
    console.log("Buy button clicked");

}

// Функция для отправки POST-запроса на сервер для продажи монеты
function sellCoin() {
    openSellBuyModal("sell"); // Открываем модальное окно
    console.log("Sell button clicked");

}

function getHistory() {
    openHistoryModal(); // Открываем модальное окно
    console.log("History button clicked");

}
function checkLossCoin() {
    openCheckLossModal(); // Открываем модальное окно
    console.log("CheckLoss button clicked");

}

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

function updatePrices() {
    // Очищаем таблицу перед обновлением
    const tableBody = document.getElementById('coinTableBody');
    tableBody.innerHTML = '';

    // Запрашиваем новые данные о монетах и обновляем таблицу
    loadCoins();
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

function loadAvailableNames() {

    fetch('/coins/availableNames')
        .then(response => response.json())
        .then(data => {
            const coinNameSelect = document.getElementById('coinHistoryName');
            // Очищаем существующие опции
            coinNameSelect.innerHTML = '';
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


// Вызов функции загрузки данных при загрузке страницы
document.addEventListener('DOMContentLoaded', loadCoins);

// Выбираем все элементы с классом "close" и добавляем обработчик события для закрытия модального окна
const closeButtons = document.querySelectorAll('.close');
closeButtons.forEach(button => {
    button.addEventListener('click', closeModal)

});

function addRow() {
    const tableBody = document.getElementById('checkLossTableBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>
            <select class="coinLossName" onchange="updateRow(this)">
                <option value="">Выберите монету</option>
            </select>
        </td>
        <td><input type="number" class="purchaseRate" onchange="updateRow(this)" step="0.01"></td>
        <td><input type="number" class="purchaseAmount" onchange="updateRow(this)" step="0.01"></td>
        <td><input type="number" class="purchaseSum" onchange="updateRow(this)" step="0.01"></td>
        <td><label type="text" class="averageRate" readonly></td>
        <td><label type="text" class="depositAfterAverage" readonly></td>
        <td><label type="text" class="profit" readonly></td>
    `;
    tableBody.appendChild(newRow);
    loadAvailableCoins(); // При добавлении строки загружаем доступные монеты
}

function updateRow(element) {
    const row = element.parentNode.parentNode;
    console.log('row:',row);
    const coinNameSelect = row.querySelector('.coinLossName');
    const coinName = coinNameSelect.value;
    const purchaseRate = parseFloat(row.querySelector('.purchaseRate').value);
    const purchaseAmount = parseFloat(row.querySelector('.purchaseAmount').value);
    const purchaseSum = parseFloat(row.querySelector('.purchaseSum').value);

    const averageRateInput = row.querySelector('.averageRate');
    const depositAfterAverageInput = row.querySelector('.depositAfterAverage');
    const profitInput = row.querySelector('.profit');

    // // Получение данных из основной таблицы для выбранной монеты


    const mainTableRow = Array.from(document.querySelectorAll('#coinsTable tbody tr'))
        .find(row => row.querySelector('td:first-child')
            .textContent === coinName);
    console.log(mainTableRow);
    // const mainDeposit = parseFloat(mainTableRow.querySelector('td:nth-child(3)').textContent);
    // const mainAmount = parseFloat(mainTableRow.querySelector('td:nth-child(2)').textContent);
    // const mainAmount = mainTableRow.children[1].textContent; // Получить содержимое второй ячейки (индекс 1)
    // const mainDeposit = mainTableRow.children[2].textContent; // Получить содержимое третьей ячейки (индекс 2)

    row.querySelector('.purchaseAmount').value = purchaseAmount;
    row.querySelector('.purchaseSum').value = purchaseSum;

    // Рассчет курса усреднения
    const averageRate = purchaseSum / purchaseAmount;
    averageRateInput.value = averageRate.toFixed(2);

    // Рассчет депозита после усреднения
    const depositAfterAverage = depositAfterAverageInput.value;
    depositAfterAverageInput.value = (parseFloat(depositAfterAverage) + purchaseSum).toFixed(2);

    // Рассчет профита
    const profit = purchaseAmount * purchaseRate - depositAfterAverage;
    profitInput.value = profit.toFixed(2);

    // Замена выпадающего списка на текстовое поле с выбранным значением
    const coinNameLabel = document.createElement('label');
    // coinNameText.type = 'text';
    // coinNameText.className = 'coinName';
    coinNameLabel.textContent = coinName;
    coinNameSelect.parentNode.replaceChild(coinNameLabel, coinNameSelect);

    // row.querySelector('.purchaseAmount').value = purchaseAmount;
    // row.querySelector('.purchaseSum').value = purchaseSum;
}

function loadAvailableCoins() {
    fetch('/coins/availableNames')
        .then(response => response.json())
        .then(data => {
            const selectElements = document.querySelectorAll('.coinLossName');
            selectElements.forEach(selectElement => {
                if (selectElement.tagName === 'SELECT') {
                    // Если элемент - выпадающий список, создаем варианты выбора монет
                    selectElement.innerHTML = ''; // Очищаем список монет перед загрузкой
                    data.forEach(coinName => {
                        const option = document.createElement('option');
                        option.value = coinName;
                        option.textContent = coinName;
                        selectElement.appendChild(option);
                    });
                } else {
                    // Если элемент - текстовое поле, устанавливаем значение
                    selectElement.value = data.coinNames[0]; // Предполагаем, что первая монета из списка
                }
            });
        })
        .catch(error => console.error('Error:', error));
}


// Обработчик события нажатия клавиши
//
// document.addEventListener('keydown', function(event) {
//     if (event.key === 'Escape') {
//         closeModal(); // Закрыть модальное окно при нажатии на клавишу Esc
//     }
// });
