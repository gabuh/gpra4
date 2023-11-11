document.addEventListener('DOMContentLoaded', () => {
    // Get all "navbar-burger" elements
    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    // Check if there are any navbar burgers
    if (navbarBurgers.length > 0) {
        // Add a click event on each of them
        navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);
            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
            });
        });
    }
});



async function fetchData(url) {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow',
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

//#region assets
async function getAssets() {
    const url = 'https://api.coincap.io/v2/assets';
    return fetchData(url);
}

async function getAssetById(id = '') {
    const url = `https://api.coincap.io/v2/assets/${id}`;
    return fetchData(url);
}
//#endregion

//#region utils
async function getAssetIds(){
    const response = await getAssets();
    return response.data.map(coin => coin.id);
}

async function getSelectedCoins(){
    const coinIDs = [
        "ethereum", 
        "bitcoin",
        "polygon",
        "uniswap",
        "dydx",
        "render-token",
        "solana",
        "aave",
        "lido-dao",
        "fetch"
    ];

    const coins = [];   

    for (const id of coinIDs) {
        const response = await getAssetById(id);
        coins.push(response.data);
    }

    return coins;
}

async function logData(func){
    func().then(response => console.log(response));
}
//#endregion
function isHidden(el) {
    return el.offsetParent === null;
}

function updateTable(dataArray = []){
    const tableBodyElement = document.querySelector('#currencyTable tbody');
    const tableBodyMobile = document.querySelector('#currencyMobileTable tbody');
    tableBodyElement.innerHTML = '';
    tableBodyMobile.innerHTML = '';

    dataArray.forEach(coin => {
            const row = document.createElement('tr');

            let changePcentValue = Number(coin.changePercent24Hr).toFixed(2);
            if(changePcentValue == 0) changePcentValue = changePcentValue.replace('-','');

            const newTable =`
            <th>
            <figure class="image is-24x24">
                <img src="img/currency/logos/${coin.id}_logo.png" alt="Currency ${coin.id}">
            </figure>
            </th>
            <td>${coin.name}</td>
            <td>${'$' + Number(coin.priceUsd).toFixed(2)}</td>
            <td>${'$' +  Number(coin.vwap24Hr).toFixed(2)}</td>
            <td>${Number(coin.supply).toFixed(2)}</td>
            <td>${'$' + Number(coin.volumeUsd24Hr).toFixed(2)}</td>
            <td>${changePcentValue  + '%'}</td>
            `;

            row.innerHTML = newTable;

            if(isHidden(tableBodyElement)){
                tableBodyMobile.appendChild(row);
            }
            
            if(isHidden(tableBodyMobile)){
                tableBodyElement.appendChild(row);
            }
    })
}

//Calls
const fetchSecondsInterval = 5;
const fetchInterval = 1000 * fetchSecondsInterval;
const titleElement = document.querySelector('.title');

const fetchTimer = setInterval(() => getSelectedCoins()
    .then((response) => {
        updateTable(response);
    }), fetchInterval);


$(document).ready(function () {
    $('#currencyTable').DataTable();
});