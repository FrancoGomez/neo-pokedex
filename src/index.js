const $pokemonCardsContainer = document.querySelector(
    ".pokemon-cards-container"
);

const getPokemonInfo = async (pokemonId) => {
    const pokemonInfo = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    return pokemonInfo.json();
};

const createPokemonCards = (amount) => {
    for (let i = 1; i <= amount; i++) {
        createPokemonCard(i)
    }
};

const createPokemonCard = async (id) => {
    const { name, types } = await getPokemonInfo(id);
    const { type } = types[0];
    const { backgroundColor: typeColor } =
        typePokemonColors[`${type.name}`];

    const $pokemonCardContainer = document.createElement("div");
    $pokemonCardContainer.className = "pokemon-card__container"

    const $pokemonCard = document.createElement("div");
    $pokemonCard.className = "card pokemon-card";

    const $imageContainer = document.createElement("div");
    $imageContainer.className = "pokemon-card__image-container";
    $imageContainer.appendChild(createBackgroundCircle());
    $imageContainer.appendChild(createPokemonImage(id));

    const $pokemonBackground = document.createElement("div");
    $pokemonBackground.className = "pokemon-card__background";
    $pokemonBackground.style.backgroundColor = typeColor;
    $pokemonBackground.appendChild(createJapanesePokemonName(id));
    $pokemonBackground.appendChild($imageContainer);

    const $pokemonCardBody = document.createElement("div");
    $pokemonCardBody.className = "card-body pokemon-card__body pt-4";
    $pokemonCardBody.appendChild(createPokemonName(name));
    $pokemonCardBody.appendChild(createPokemonId(id));
    $pokemonCardBody.appendChild(createPokemonTypes(types));

    $pokemonCard.appendChild($pokemonBackground);
    $pokemonCard.appendChild($pokemonCardBody);

    $pokemonCardContainer.appendChild($pokemonCard);

    $pokemonCardsContainer.appendChild($pokemonCardContainer);
}

const createJapanesePokemonName = (id) => {
    const $japanesePokemonName = document.createElement("p");
    $japanesePokemonName.className = "pokemon-card__japanese-name";
    $japanesePokemonName.textContent = japanesePokemonNames[id - 1];

    return $japanesePokemonName;
};

const createBackgroundCircle = () => {
    const $backgroundCircle = document.createElement("div");
    $backgroundCircle.className = "pokemon-card__background-circle";

    return $backgroundCircle;
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
        const { backgroundColor: typeColor } =
            typePokemonColors[`${type.name}`];

        const $pokemonType = document.createElement("p");
        $pokemonType.textContent = type.name;
        $pokemonType.style.color = typeColor;

        $typesContainer.appendChild($pokemonType);
    });

    return $typesContainer;
};

createPokemonCards(japanesePokemonNames.length);
