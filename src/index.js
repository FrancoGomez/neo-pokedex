const $pokemonCardsContainer = document.querySelector(
    ".pokemon-cards-container"
);

const getPokemonInfo = async (pokemonId) => {
    const pokemonInfo = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    return pokemonInfo.json();
};

const createPokemonCards = async (amount) => {
    for (let i = 1; i <= amount; i++) {
        const { name, id, types } = await getPokemonInfo(i);

        const $pokemonCardContainer = document.createElement("div");

        const $pokemonCard = document.createElement("div");
        $pokemonCard.className = "card pokemon-card";

        const $pokemonBackground = document.createElement("div");
        $pokemonBackground.className = "pokemon-card__background";
        $pokemonBackground.appendChild(createPokemonImage(id));

        const $pokemonCardBody = document.createElement("div");
        $pokemonCardBody.className = "card-body";
        $pokemonCardBody.appendChild(createPokemonName(name));
        $pokemonCardBody.appendChild(createPokemonId(id));
        $pokemonCardBody.appendChild(createPokemonTypes(types));

        $pokemonCard.appendChild($pokemonBackground);
        $pokemonCard.appendChild($pokemonCardBody);

        $pokemonCardContainer.appendChild($pokemonCard);

        $pokemonCardsContainer.appendChild($pokemonCardContainer);
    }
};

const createPokemonImage = (id) => {
    const $pokemonImage = document.createElement("img");
    $pokemonImage.className = "card-img-top pokemon-card__image";
    $pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

    return $pokemonImage;
};

const createPokemonName = (name) => {
    const $pokemonName = document.createElement("h2");
    $pokemonName.className = "card-title text-center pokemon-card__name";
    $pokemonName.textContent = name;

    return $pokemonName;
};

const createPokemonId = (id) => {
    const $pokemonId = document.createElement("p");
    $pokemonId.className = "card-text text-center pokemon-card__id";
    $pokemonId.textContent = `#${id.toString().padStart(3, "0")}`;

    return $pokemonId;
};

const createPokemonTypes = (types) => {
    const $typesContainer = document.createElement("div");
    $typesContainer.className = "type text-center pokemon-card__types";

    types.forEach((typeInfo) => {
        const { type } = typeInfo;
        const $pokemonType = document.createElement("p");
        $pokemonType.className = `card-text pokemon-card__types__${type.name}`;
        $pokemonType.textContent = type.name;

        $typesContainer.appendChild($pokemonType);
    });

    return $typesContainer;
};

createPokemonCards(4);
