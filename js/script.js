let allPeople = [];
let divLoading = document.querySelector('.loading');
let inputSearch = document.querySelector('#inputSearch');
let btnSearch = document.querySelector('#btnSearch');
let boxResults = document.querySelector('#box-results');
let boxResultsQttPersons = document.querySelector('#box-results h2 span');
let boxStatistics = document.querySelector('#box-statistics');

numberFormat = Intl.NumberFormat('pt-BR');

inputSearch.addEventListener('input', unblockSearchBtn);
inputSearch.addEventListener('keyup', verifyButtonPressed)
btnSearch.addEventListener('click', searchPeople);

window.addEventListener('load', () => {

    // Show the loading message
    divLoading.style.display = "inline-flex";

    // get all people data from the randomuser api
    getAllPeople();
});

async function getAllPeople() {
    try {
        // Comentei o fetch abaixo por que a api esta caindo direto, mas e so descomentar que funciona
        // const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
        const res = await fetch('./js/api.js');
        const json = await res.json();

        // hide de loading message
        divLoading.style.display = "none";

        // activate the search input 
        inputSearch.disabled = false;
        inputSearch.focus();

        // name {first, last}, picture {medium}, dob {age}, gender
        allPeople = json.results.map(person => {
            return {
                name: person.name.first + ' ' + person.name.last,
                picture: person.picture.medium,
                age: person.dob.age,
                gender: person.gender,
            }
        });
    } catch (error) {
        console.log('Erro 1#: ' + error);
    }
}

function searchPeople() {
    let peopleFind = '';
    let allPeopleFinded = [];

    function makeSearch() {
        allPeopleFinded = allPeople.filter(person => {
            // O if procura se o que tem no inputSearch tem no nome da pessoa
            if (person.name.toLowerCase().indexOf(inputSearch.value.toLowerCase()) > -1) {
                return person;
            }
        }).sort((a, b) => {
            const name = allPeopleFinded.name;
            return a.name.localeCompare(b.name);
        })
    }

    function generateStatisticsData() {
        const totalMens = allPeopleFinded.filter(person => person.gender === 'male');
        const totalWomans = allPeopleFinded.filter(person => person.gender === 'female');
        const totalAge = allPeopleFinded.reduce((acc, curr) => acc + curr.age, 0);
        const averageAge = totalAge / allPeopleFinded.length;

        renderStatisticsHTML(totalMens, totalWomans, totalAge, averageAge);
    }

    function renderTotalUsersHTML() {
        let total = allPeopleFinded.length;
        let totalUsers = '';
        if (total === 1) {
            totalUsers = `
                <h2>
                    <span>${total}</span> 
                    usuário encontrado!
                </h2>`;
        } else {
            totalUsers = `
                <h2>
                    <span>${total}</span> 
                    usuários encontrados!
                </h2>`;
        }
        peopleFind += totalUsers;
    }

    function renderUsersHTML() {
        allPeopleFinded.forEach(person => {
            const { name, picture, age } = person;
            const peopleHTML = `
                <div class="box-result-item">
                    <img src="${picture}" alt="${name}" title="${name}">
                    <span>${name}, ${age} anos</span>
                </div>
            `;
            peopleFind += peopleHTML;
        });
        boxResults.innerHTML = peopleFind;
    }

    makeSearch();
    generateStatisticsData();
    renderTotalUsersHTML();
    renderUsersHTML();
}

function renderStatisticsHTML(totalMens, totalWomans, totalAge, averageAge) {
    let spanTotalStatistics = `
        <h2 class="title-statistics">Estatísticas</h2>
        <div class="sex-m">👨 Homem: <span>${totalMens.length}</span></div>
        <div class="sex-f">👩 Mulher: <span>${totalWomans.length}</span></div>
        <div class="idades-soma">➕ Soma Idades: <span>${totalAge}</span></div>
        <div class="idades-media">➗ Média Idades: <span>${formatNumber(averageAge)}</span></div>`;

    // remove class from box statistics for visual
    formatBoxStatisticsClass(true);

    // add HTML generate DOM
    boxStatistics.innerHTML = spanTotalStatistics;
}

function formatBoxStatisticsClass(remove) {
    if (remove === true) {
        // remove and add classes for visual
        boxStatistics.classList.remove('box-statistics-nada');
        boxStatistics.classList.add('box-statistics');
        return;
    }
    boxStatistics.classList.add('box-statistics-nada');
    boxStatistics.classList.remove('box-statistics');
}

function cleanSearchData() {
    boxResults.innerHTML = '<h2 class="title-statistics">Estatísticas</h2><h3>Nada a ser exibido!</h3>';
    boxStatistics.innerHTML = '<h2><span></span> Usuários</h2><h3>Nenhum usuário filtrado!</h3>';
}

function unblockSearchBtn(event) {
    if (event.target.value === "") {
        btnSearch.disabled = true;
        cleanSearchData();
        return;
    }
    btnSearch.disabled = false;
}

function verifyButtonPressed(event) {
    if (event.key === 'Enter' && inputSearch.value !== '') {
        searchPeople();
    }
}

function formatNumber(number) {
    return numberFormat.format(number);
}