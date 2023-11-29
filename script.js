class QuestionCard {
    constructor(question, a, b, c, d){
        this.question = question
        this.a = a
        this.b = b 
        this.c = c 
        this.d = d
    }


    getQuestion(){
        return {
            question : this.question,
            a : this.a,
            b : this.b,
            c : this.c,
            d : this.d
        }
    }

    getAnswer(){
        if(this.answer === 0){
            return this.a
        }else if(this.answer === 1){
            return this.b
        }else if(this.answer === 2){
            return this.c
        }else if(this.answer === 3){
            return this.d
        }
    
    }

    setAnswer(number){
        this.answer = number;
    }

}


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



document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  



    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        closeAllModals();
      }
    });
  });


getSelectedCoins()
    .then((response) => {
        updateTable(response);
    })





//Calls
const fetchSecondsInterval = 5;
const fetchInterval = 1000 * fetchSecondsInterval;
const titleElement = document.querySelector('.title');

const fetchTimer = setInterval(() => getSelectedCoins()
    .then((response) => {
        updateTable(response);
    }), fetchInterval);


// $(document).ready(function () {
//     $('#currencyTable').DataTable();
// });









const QuestionBox = {
 box : document.getElementById("questions"),

updateQuestion(questionCard){
        this.box.innerHTML = ''
        const p = document.createElement('P')
        const hmtl = `<h1>${questionCard.question}</h1>
        <div class="box" id="answerA">${questionCard.a}</div>
        <div class="box" id="answerB">${questionCard.b}</div>
        <div class="box" id="answerC">${questionCard.c}</div>
        <div class="box" id="answerD">${questionCard.d}</div>
        <div class="columns is-justify-content-space-around">
            <button class="button is-black">Anterior</button> 
            <button class="button is-black">Próxima</button>
        </div>`
        p.innerHTML = hmtl
        console.log(p)
        this.box.appendChild(p)
    }
}




