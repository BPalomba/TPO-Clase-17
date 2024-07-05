document.addEventListener('DOMContentLoaded', () => {
    let currentPageUrl = 'https://swapi.dev/api/people/';

    fetchData(currentPageUrl);

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
                dataContainer.innerHTML = ''; // Limpiar contenido anterior

                // Actualizar URLs de paginación
                prevPageUrl = data.previous;
                nextPageUrl = data.next;

                // Actualizar estado de los botones de paginación
                document.getElementById('prevPage').disabled = !prevPageUrl;
                document.getElementById('nextPage').disabled = !nextPageUrl;

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


                    Promise.all([...filmPromises, ...speciesPromises]).then(() => {
                        dataContainer.innerHTML += `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">Altura: ${item.height}</p>
                    <p class="card-text">Masa: ${item.mass}</p>
                    <p class="card-text">Color de Cabello: ${item.hair_color}</p>
                    <p class="card-text">Color de Piel: ${item.skin_color}</p>
                    <p class="card-text">Color de Ojos: ${item.eye_color}</p>
                    <p class="card-text">Año de Nacimiento: ${item.birth_year}</p>
                    <p class="card-text">Género: ${item.gender}</p>
                    <p class="card-text">Planeta Natal: ${item.homeworld.name}</p>
                    <p class="card-text">Películas: ${filmTitles.join(', ')}</p>
                    <p class="card-text">Especie: ${speciesNames.join(', ')}</p>
                   
                    
                </div>
            </div>`;
                    })
                        .catch(error => console.error('Hubo un problema al resolver las promesas:', error));
                })

            })
    }
});