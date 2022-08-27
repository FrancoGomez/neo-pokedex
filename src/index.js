const $pokemonCardsContainer = document.querySelector(
    ".pokemon-cards-container"
);
const $pokemonTypeDropdown = document.querySelector("#pokemon-type-dropdown");
const $pokemonAbilityDropdown = document.querySelector(
    "#pokemon-ability-dropdown"
);
const $pokemonGenerationDropdown = document.querySelector(
    "#pokemon-generation-dropdown"
);
const $searchInput = document.querySelector(".nav-bar__search-form input");
const $searchButton = document.querySelector(".nav-bar__search-form button");
const $noPokemonAlert = document.querySelector("#no-pokemon-alert");

const init = () => {
    createPokemonCards(30);
    createDropdownOptions();
};

const getPokemonInfo = async (pokemonId) => {
    const pokemonInfo = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );

    if (pokemonInfo.status === 200) {
        return pokemonInfo.json();
    }
};

const getAllPokemonTypes = async () => {
    const allPokemonTypes = await fetch("https://pokeapi.co/api/v2/type");

    return allPokemonTypes.json();
};

const getAllPokemonAbilities = async () => {
    const allPokemonAbilities = await fetch(
        "https://pokeapi.co/api/v2/ability?offset=0&limit=327"
    );

    return allPokemonAbilities.json();
};

const createPokemonCards = (amount, array = false, startCounter = 1) => {
    if (array) {
        for (let i = 1; i < array.length; i++) {
            createPokemonCard(array[i].pokemon.name);
        }
    } else {
        for (let i = startCounter; i <= amount; i++) {
            createPokemonCard(i);
        }
    }
};

const createDropdownOptions = async () => {
    const { results: resultsTypes } = await getAllPokemonTypes();
    const { results: resultsAbilities } = await getAllPokemonAbilities();

    const sortedTypes = sortArray(resultsTypes);
    const sortedAbilities = sortArray(resultsAbilities);

    createDropdownOptionsList(sortedTypes, $pokemonTypeDropdown);
    createDropdownOptionsList(sortedAbilities, $pokemonAbilityDropdown);
    createDropdownOptionsList(
        Object.keys(pokemonPerGeneration),
        $pokemonGenerationDropdown
    );
};

const handleDropdownItemClick = async ($item) => {
    if (!$item.classList.contains("dropdown-item")) return;
    const commonClasess = "dropdown-item dropdown-options__item ";
    const category = $item.className.replace(commonClasess, "");
    let parameter = $item.textContent;

    deleteAllPokemonCards();

    if (/generation/.test(parameter)) {
        createPokemonCards(
            pokemonPerGeneration[parameter].to,
            false,
            pokemonPerGeneration[parameter].from
        );
    } else {
        parameter = parameter.replaceAll(" ", "-");
        const { pokemon } = await searchPokemonsBy(category, parameter);
        createPokemonCards("", pokemon);
    }

    if ($pokemonCardsContainer.childElementCount === 0) {
        showElement($noPokemonAlert);
    }
};

$pokemonTypeDropdown.onclick = (e) => handleDropdownItemClick(e.target);
$pokemonAbilityDropdown.onclick = (e) => handleDropdownItemClick(e.target);
$pokemonGenerationDropdown.onclick = (e) => handleDropdownItemClick(e.target);

const searchPokemonsBy = async (category, parameter) => {
    const pokemonsBy = await fetch(
        `https://pokeapi.co/api/v2/${category}/${parameter}`
    );

    return pokemonsBy.json();
};

$searchButton.onclick = (e) => {
    handleSearch();

    e.preventDefault();
};

const handleSearch = () => {
    hideElement($noPokemonAlert);
    const query = $searchInput.value;
    $searchInput.value = "";

    deleteAllPokemonCards();
    createPokemonCard(query);
};

const deleteAllPokemonCards = () => {
    const children = $pokemonCardsContainer.childElementCount;

    for (let i = children - 1; i >= 0; i--) {
        $pokemonCardsContainer.children[i].remove();
    }
};

const sortArray = (array) => {
    const newArray = [];

    array.forEach(({ name }) => {
        newArray.push(name);
    });

    return newArray.sort();
};

const createDropdownOptionsList = (array, $element) => {
    const $dropdownList = document.createElement("ul");
    $dropdownList.className = "dropdown-menu overflow-auto dropdown-options";

    const dropdownName = $element.textContent.replace(/\s+/g, "").toLowerCase();

    array.forEach((elemet) => {
        const $dropdownItem = document.createElement("li");
        $dropdownItem.className = `dropdown-item dropdown-options__item ${dropdownName}`;
        $dropdownItem.textContent = elemet.replaceAll("-", " ");

        $dropdownList.appendChild($dropdownItem);
    });

    $element.appendChild($dropdownList);
};

const createPokemonCard = async (queryInfo) => {
    const pokemonInfo = await getPokemonInfo(queryInfo);
    if (pokemonInfo === undefined) return handleError();
    if (pokemonInfo.id > 898) return;

    hideElement($noPokemonAlert);

    const { name, id, types } = pokemonInfo;
    const { type } = types[0];
    const { backgroundColor: typeColor } = typePokemonColors[`${type.name}`];

    const $pokemonCardContainer = document.createElement("div");
    $pokemonCardContainer.className = "pokemon-card__container";
    $pokemonCardContainer.setAttribute("id", id);

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
};

const handleError = () => {
    showElement($noPokemonAlert);
};

const hideElement = ($element) => {
    $element.classList.add("hidden");
};

const showElement = ($element) => {
    $element.classList.remove("hidden");
};

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

init();
