# Pokedex App

Este é um aplicativo Pokedex criado em React que permite ao usuário visualizar informações detalhadas sobre diferentes Pokémons. O usuário pode favoritar, ver a forma shiny, ver os pokemons da região específica, filtrar por tipagem, ver status, habilidades e uma breve descrição do Pokemon. Além disso, também é possível buscar Pokémons pelo nome ou número da Pokédex.

## Instalação

Para instalar o aplicativo, siga estas etapas:

### Clone o repositório em sua máquina local usando o seguinte comando:

- git clone https://github.com/JoaoRViana/pokedex.git

### Acesse a pasta do projeto e instale as dependências do projeto com o seguinte comando:
- cd pokedex
- npm install

### Inicie o aplicativo com o seguinte comando:

- npm start

O aplicativo estará disponível em http://localhost:3000.

# Funcionalidades

## Região

O usuário escolhe uma das regiões e será redirecionado para a listagem de pokémons da região escolhida.

## Lista de Pokémons

O usuário irá ver todos os pokémons da região escolhida.

## Busca por nome ou número

O usuário pode buscar um Pokémon pelo nome ou número da Pokédex digitando na barra de busca na barra de navegação.

## Filtrar por tipagem

O usuário pode filtrar a lista de Pokémons por tipo.

## Detalhes do Pokémon

Ao clicar em um Pokémon na lista, o usuário será levado para uma página com detalhes do Pokémon, incluindo:

- Imagem do Pokémon
- Nome e número da Pokédex
- Descrição breve
- Tipagem
- Status (HP, Attack, Defense, Special Attack, Special Defense, Speed)
- Habilidades
- Forma shiny
- Opção para favoritar o Pokémon.

## Favoritos

O usuário pode marcar Pokémons como favoritos clicando no ícone de estrela na página de detalhes do Pokémon. Esses Pokémons favoritos podem ser acessados clicando no botão "Favorites" na barra de navegação.


## API utilizada

Este aplicativo utiliza a API pública [PokéAPI](https://pokeapi.co) para obter informações sobre os Pokémons.
