document.addEventListener('DOMContentLoaded', () => {
    let currentPageUrl = 'https://swapi.dev/api/people/';
    let currentSection = 'personajes'

    fetchData(currentPageUrl);

    //cambiar entre sectores

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            currentSection = event.target.getAttribute('data-section');
            switch (currentSection) {
                case 'personajes':
                    currentPageUrl = 'https://swapi.dev/api/people/';
                    break;
                case 'naves':
                    currentPageUrl = 'https://swapi.dev/api/starships/';
                    break;
                case 'peliculas':
                    currentPageUrl = 'https://swapi.dev/api/films/';
                    break;
                default:
                    return;
            }
            fetchData(currentPageUrl);
        });
    });


    //cambiar de pagina

    document.getElementById('prevPage').addEventListener('click', () => {
        if (prevPageUrl) {
            fetchData(prevPageUrl);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (nextPageUrl) {
            fetchData(nextPageUrl);
        }
    });


    // Funcion de busqueda, solo busca en los 10 cargados
    function filterData(searchText) {
        let cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            let cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
            if (cardTitle.includes(searchText)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    document.getElementById('searchInput').addEventListener('input', () => {
        let searchText = document.getElementById('searchInput').value.trim().toLowerCase();
        if (searchText !== '') {
            filterData(searchText);
        }
    });



    let prevPageUrl = null;
    let nextPageUrl = null;


    function fetchData(url) {


        fetch(url)
            //si la respiesta esta ok la hacemos json
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }
                return response.json();
            })
            //Obtenemos el array de resultados
            .then(data => {
                const dataContainer = document.getElementById('dataContainer');
                dataContainer.innerHTML = ' '; // Limpiar contenido anterior

                // Actualizar URLs de paginación
                prevPageUrl = data.previous;
                nextPageUrl = data.next;

                // Actualizar estado de los botones de paginación
                document.getElementById('prevPage').disabled = !prevPageUrl;
                document.getElementById('nextPage').disabled = !nextPageUrl;

                if (currentSection === 'personajes') {


                    data.results.map(item => {

                        // Crear un array de promesas para obtener los títulos de las películas
                        let filmTitles = [];
                        let filmPromises = item.films.map(filmUrl => {
                            return fetch(filmUrl)
                                .then(filmResponse => filmResponse.json())
                                .then(filmData => {
                                    filmTitles.push(filmData.title);
                                })
                                .catch(error => console.error('Error al obtener los datos de la película:', error));
                        });




                        // Crear un array de promesas para obtener los nombres de las especies
                        let speciesNames = [];
                        let speciesPromises = item.species.map(speciesUrl => {
                            return fetch(speciesUrl)
                                .then(speciesResponse => speciesResponse.json())
                                .then(speciesData => {
                                    speciesNames.push(speciesData.name)
                                })
                                .catch(error => console.error('Error al obtener los datos de la especies: ', error))
                        })

                        let homeworldName = '';
                        let homeworldPromise = fetch(item.homeworld)
                            .then(homeworldResponse => homeworldResponse.json())
                            .then(homeworldData => {
                                homeworldName = homeworldData.name;
                            })
                            .catch(error => console.error('Error al obtener los datos del planeta natal:', error));


                        Promise.all([...filmPromises, ...speciesPromises, homeworldPromise]).then(() => {
                            dataContainer.innerHTML += `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text"><span>Altura:</span> ${item.height}</p>
                    <p class="card-text"><span>Masa:</span> ${item.mass}</p>
                    <p class="card-text"><span>Color de Cabello:</span> ${item.hair_color}</p>
                    <p class="card-text"><span>Color de Piel:</span> ${item.skin_color}</p>
                    <p class="card-text"><span>Color de Ojos</span>: ${item.eye_color}</p>
                    <p class="card-text"><span>Año de Nacimiento:</span> ${item.birth_year}</p>
                    <p class="card-text"><span>Género:</span> ${item.gender}</p>
                    <p class="card-text"><span>Planeta Natal:</span> ${homeworldName}</p>
                    <p class="card-text"><span>Películas:</span> ${filmTitles.join(', ')}</p>
                    <p class="card-text"><span>Especie:</span> ${speciesNames.join(', ')}</p>
                   
                    
                </div>
            </div>`;
                        })
                            .catch(error => console.error('Hubo un problema al resolver las promesas:', error));
                    })
                } else if (currentSection === 'naves') {
                    data.results.forEach(item => {
                        dataContainer.innerHTML += `
                        <div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text"><span>Modelo:</span> ${item.model}</p>
                                <p class="card-text"><span>Fabricante:</span> ${item.manufacturer}</p>
                                <p class="card-text"><span>Costo en créditos:</span> ${item.cost_in_credits}</p>
                                <p class="card-text"><span>Longitud:</span> ${item.length}</p>
                                <p class="card-text"><span>Velocidad Máxima en Atmósfera:</span> ${item.max_atmosphering_speed}</p>
                                <p class="card-text"><span>Tripulación:</span> ${item.crew}</p>
                                <p class="card-text"><span>Pasajeros:</span> ${item.passengers}</p>
                                <p class="card-text"><span>Capacidad de Carga:</span> ${item.cargo_capacity}</p>
                                <p class="card-text"><span>Consumibles:</span> ${item.consumables}</p>
                                <p class="card-text"><span>Clase de Nave: </span>${item.starship_class}</p>
                            </div>
                        </div>`;
                    });
                } else if (currentSection === 'peliculas') {
                    data.results.forEach(item => {
                        dataContainer.innerHTML += `
                        <div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${item.title}</h5>
                                <p class="card-text"><span>Episodio:</span> ${item.episode_id}</p>
                                <p class="card-text">${item.opening_crawl}</p>
                                <p class="card-text"><span>Director:</span> ${item.director}</p>
                                <p class="card-text"><span>Productor: </span>${item.producer}</p>
                                <p class="card-text"><span>Fecha de Estreno:</span> ${item.release_date}</p>
                            </div>
                        </div>`;
                    });
                }
            })

    }
});