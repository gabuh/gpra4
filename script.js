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

    getAnswerNumber(){
        return this.answer;
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


document.getElementById('makeATest').addEventListener('click', function() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth' 
    });
});



const QuestionBox = {
    box: document.getElementById("questions"),
    currentQuestionIndex: 0,
    questionCards: [],
    selectedAnswers: [], // srray to store selected answers for each question

    updateQuestion() {
        const questionCard = this.questionCards[this.currentQuestionIndex];
        this.box.innerHTML = '';

        const p = document.createElement('P');
        const html = `<h1>${questionCard.question}</h1>
            <div class="box" id="answerA">${questionCard.a}</div>
            <div class="box" id="answerB">${questionCard.b}</div>
            <div class="box" id="answerC">${questionCard.c}</div>
            <div class="box" id="answerD">${questionCard.d}</div>
            <div class="columns is-justify-content-space-around">
                <button class="button is-black" id="previousBtn">Anterior</button>
                <button class="button is-black" id="nextBtn">Próxima</button>
            </div>`;

        p.innerHTML = html;
        this.box.appendChild(p);

        const answerOptions = this.box.querySelectorAll('.box');
        answerOptions.forEach((option, index) => {
            option.addEventListener('click', () => {
       
                answerOptions.forEach(opt => opt.classList.remove('has-background-warning'));
            
                option.classList.add('has-background-warning');
                this.selectedAnswers[this.currentQuestionIndex] = index;
                questionCard.setAnswer(index);

                if (this.selectedAnswers.length === this.questionCards.length) {
                    let sumBeginner = 0
                    let sumTechnician = 0
                    let sumDayTrader = 0  

                    let sumHODLer = 0
                    let sumContrarian = 0
                    let sumICO = 0
                    let sumCareful = 0
    

                    var lista = [
                        { //prazo
                            "0": ()=> {
                                sumDayTrader++
                                sumTechnician++
                                sumHODLer--
                            },
                            "1": ()=> {
                                sumDayTrader--
                                sumTechnician--
                            },
                            "2": ()=> {
                                sumDayTrader--
                                sumTechnician--
                                sumHODLer++
                            },
                            "3":()=> {
                                sumDayTrader--
                                sumTechnician--
                                sumHODLer++
                            }
                        },
                        { //risco
                            "0": ()=> {
                                sumICO++
                                sumContrarian++
                                sumCareful--
                                sumHODLer--
                            },
                            "1": ()=> {
                                sumICO++
                                sumContrarian--
                                sumCareful++
                                sumHODLer--
                            },
                            "2": ()=> {
                                sumICO-- 
                                sumContrarian--
                                sumCareful++
                                sumHODLer++
                            },
                            "3":()=> {
                                
                            }
                        },
                        { //razao
                            "0": ()=> {

                            },
                            "1": ()=> {
                                sumHODLer++
                            },
                            "2": ()=> {
                   
                            },
                            "3":()=> {
                                
                            }
                        },
                        { //quais moedas
                            "0": ()=> {
                                sumBeginner++
                            },
                            "1": ()=> {
                                sumBeginner++
                            },
                            "2": ()=> {
                                sumBeginner--
                                sumContrarian = sumContrarian + 3
                            },
                            "3":()=> {
                                
                            }
                        },
                        { //negociações
                            "0": ()=> {
                                sumDayTrader++
                                sumBeginner--
                                sumHODLer--
                            },
                            "1": ()=> {
                                sumDayTrader--
                                sumBeginner--
                                sumHODLer--
                            },
                            "2": ()=> {
                                sumDayTrader--
                                sumBeginner--
                                sumHODLer++
                            },
                            "3":()=> {
                                sumBeginner++
                            }
                        },
                        { //regulamentações
                            "0": ()=> {
                                sumBeginner--
                            },
                            "1": ()=> {
                                sumBeginner--
                            },
                            "2": ()=> {

                            },
                            "3":()=> {
                                sumBeginner++
                            }
                        },
                        { //análises
                            "0": ()=> {
                                sumTechnician++
                            },
                            "1": ()=> {
                                sumTechnician++
                            },
                            "2": ()=> {
                                sumTechnician--
                            },
                            "3":()=> {
                                sumTechnician++
                            }
                        }
                    ]

                    this.questionCards.forEach((option, index) => {
                        lista[index][option.getAnswerNumber()]()

                    })
                    
                    
                    const valores = {
                        sumBeginner,
                        sumCareful,
                        sumContrarian,
                        sumDayTrader,
                        sumHODLer,
                        sumICO,
                        sumTechnician,
                      };
                      
                      // Encontrando o maior valor e seu respectivo nome
                      let maiorNome;
                      let maiorValor = -Infinity;
                      
                      for (const [nome, valor] of Object.entries(valores)) {
                        if (valor > maiorValor) {
                          maiorValor = valor;
                          maiorNome = nome;
                        }
                      }
                      
                      // Tomando ação com base no maior valor
                      switch (maiorNome) {
                        case 'sumBeginner':
                          document.getElementById("definedBeginnerProfile").classList.add("is-active")
                          break;
                        case 'sumCareful':
                          document.getElementById("definedCarefulProfile").classList.add("is-active")
                          break;
                        case 'sumContratian':
                            document.getElementById("definedContratianProfile").classList.add("is-active")
                            break;
                        case 'sumDayTrader':
                          document.getElementById("definedDayTraderProfile").classList.add("is-active")
                          break;
                          case 'sumHODLer':
                          document.getElementById("definedHODlerProfile").classList.add("is-active")
                          break;

                          case 'sumICO':
                          document.getElementById("definedICOprofile").classList.add("is-active")
                          break;
                          
                          case 'sumTechnician':
                          document.getElementById("definedTechnicianProfile").classList.add("is-active")
                          break;

                        default:
                          document.getElementById("definedUnkown").classList.add("is-active")
                      }

                    
                }

            });
        });

        document.getElementById('previousBtn').addEventListener('click', () => {
            this.currentQuestionIndex = Math.max(0, this.currentQuestionIndex - 1);
            this.updateQuestion();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.currentQuestionIndex = Math.min(
                this.questionCards.length - 1,
                this.currentQuestionIndex + 1
            );
            this.updateQuestion();
        });

        // set the background color for the previously selected answer
        const previousAnswer = this.selectedAnswers[this.currentQuestionIndex];
        if (previousAnswer !== undefined) {
            answerOptions[previousAnswer].classList.add('has-background-warning');
        }
    },

    showAnswers(){
        this.questionCards.forEach(element => {
            console.log(element.getAnswer())
        });
    }

};

QuestionBox.questionCards.push(new QuestionCard("Qual é o seu horizonte de investimento?",
 "Mensal", "1-2 anos", "3-9 anos", "10+ anos"));

QuestionBox.questionCards.push(new QuestionCard("Qual é o seu nível de tolerância ao risco em relação às oscilações de preço das criptomoedas?",
"Alto", "Médio", "Baixo", "Ainda não sei"));

QuestionBox.questionCards.push(new QuestionCard("Qual é a principal razão para seus investimentos em criptomoedas?",
 "Diversificação de carteira", "Aposentadoria", "Aumento de patrimônio", "Ainda não invisto em criptomoedas"));

 QuestionBox.questionCards.push(new QuestionCard("Em quais criptomoedas você está atualmente investindo?",
 "Bitcoin ou Ethereum", "Apenas Bitcoin", "Outras criptomoedas", "Ainda não invisto em criptomoedas"));

QuestionBox.questionCards.push(new QuestionCard("Você costuma fazer negociações diárias, semanais ou mensais?",
 "Diárias", "Semanais", "Mensais", "Ainda não faço negociações"));

 QuestionBox.questionCards.push(new QuestionCard("Você está ciente das regulamentações em relação às criptomoedas em sua jurisdição?",
 "Sim, acompanho de forma constante", "Sim, mas não de forma frequente", "Não, pois não vejo necessidade ", "Não sabia que existia regulamentação"));
 
 QuestionBox.questionCards.push(new QuestionCard("Você utiliza análise técnica para tomar decisões de compra e venda?",
 "Sim, sempre", "Sim, mas raramente", "Não, e não considero um bom método", "Não, mas considero um bom método"));


// initial update
QuestionBox.updateQuestion();

