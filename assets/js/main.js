const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const detailsContainer = document.getElementById('pokemonDetails');

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    const pokemonHash = `#pokemon-${pokemon.number}`;

    return `
        <li class="pokemon ${pokemon.type}">
            <button class="pokemon-button" onclick="navigateToPokemon('${pokemonHash}')">
                <div class="pokemoHeader">
                <span class="name">${pokemon.name}</span>
                <span class="number">#${pokemon.number}</span>
                </div>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </button>
        </li>
    `;
}

function navigateToPokemon(pokemonHash) {
    window.location.hash = pokemonHash;

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function loadPokemonDetails() {
    const pokemonHash = window.location.hash;

    if (!pokemonHash) {
        return;
    }

    if (pokemonHash) {
        const pokemonId = pokemonHash.replace('#pokemon-', '');

        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
            .then(response => response.json())
            .then(pokemon => {

                const abilitiesList = pokemon.abilities.map(ability => ability.ability.name).join(' / ');

                detailsContainer.innerHTML = `
                    <h2>${pokemon.name}</h2>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <p>Types: ${pokemon.types.map(type => type.type.name).join(' / ')}</p>
                    <p>Height: ${pokemon.height / 10} <span class = "measures">m</span></p>
                    <p>Weight: ${pokemon.weight / 10} <span class = "measures">kg</span></p>
                    <p>Abilties: ${abilitiesList}</p>
                    <button onclick="hideDetails()">Hide</button>
                `;
            })
            .catch(err => {
                console.error('Error fetching Pokémon details:', err);
            });
    }
}

function hideDetails() {
    window.location.hash = ''; 
    
    detailsContainer.innerHTML = '';

    pokemonList.scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('hashchange', loadPokemonDetails);

if (window.location.hash) {
    loadPokemonDetails();
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)


loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})