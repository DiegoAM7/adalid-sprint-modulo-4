import Pokemon from '../../components/Pokemon.js';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

const baseUrl = 'https://pokeapi.co/api/v2';

document.addEventListener('DOMContentLoaded', () => {
	const busqueda = document.querySelector('#busqueda');
	const listadoPokemonTab = document.querySelector('#listado-pokemons-tab');
	const mostrarPokemon = document.querySelector('#mostrarPokemon');
	const listadoPokemons = document.querySelector('#listadoPokemons');
	const btnBorrarTodo = document.querySelector('[data-id="btnBorrarTodo"]');
	const listado = [];
	let btnCargarMas;

	const cargarListadoPokemons = async (offset = 0, e) => {
		try {
			const res = await fetch(`${baseUrl}/pokemon?limit=20&offset=${offset}`);
			const data = await res.json();

			await mostrarListadoPokemons(data.results, offset, e);
		} catch (error) {
			console.log(error);
		}
	};

	const mostrarListadoPokemons = async (data, offset, e) => {
		await Promise.all(
			data.map(async (poke) => {
				try {
					const resOne = await fetch(poke.url);
					const pokemon = await resOne.json();

					listado.push(pokemon);
				} catch (error) {
					console.log(error);
				}
			})
		);

		listado
			.sort((a, b) => a.id - b.id)
			.map((pokemon) => {
				listadoPokemons.innerHTML += `
			<div class="col d-flex flex-column align-items-center">
				<div class="algo text-center" style="height: 550px; width: 350px;">
				<div class="box-card">
				<div class="card-imagen">
						<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
							pokemon.id
						}.png" alt="${pokemon.name}" alt="${pokemon.name}">   
				</div>
				<div class="card-ifo">
					<div class="poke-info">
						<div class="nombre-poke">
							<h5>${pokemon.name
								.split('-')
								.map((nombre) => nombre.charAt(0).toUpperCase() + nombre.slice(1))
								.join(' ')}</h5>
						</div>
						<div class="types-poke">
							<span class="tipo">${pokemon.types
								.map(
								(tipo) =>
								`<img src="src/public/tipos/${tipo.type.name}.png"
									alt="${tipo.type.name}" />`
								)
								.join('')}
							</span>
						</div>
					</div>
					<div class="poke-id">
						<h2>ID ${pokemon.id}</h2>
					</div>
				</div>
			</div>
				</div>
			</div>`;
			});

		listado.splice(0, listado.length);

		if (btnCargarMas) {
			btnCargarMas.dataset.offset = offset;
		}

		if (e) {
			e.target.disabled = false;
		}

		cargarBotonCargarMas();
	};

	const botonCargarMas = async (e) => {
		e.preventDefault();

		e.target.disabled = true;

		await cargarListadoPokemons(parseInt(btnCargarMas.dataset.offset) + 20, e);
	};

	const cargarBotonCargarMas = () => {
		btnCargarMas = document.querySelector('[data-id="btnCargarMas"]');

		btnCargarMas.addEventListener('click', botonCargarMas);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const nombreID = document
				.querySelector('#nombre-id-pokemon')
				.value.toLowerCase();

			const res = await fetch(`${baseUrl}/pokemon/${nombreID}`);
			const data = await res.json();

			console.log(data);

			const pokemon = new Pokemon(
				data.id,
				data.name,
				`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
				data.types.map((tipo) => tipo.type.name),
				data.stats.map((estadistica) => {
					return {
						nombre: estadistica.stat.name,
						valor: estadistica.base_stat,
					};
				})
			);

			mostrarPokemon.innerHTML = `
			<div id="card-pokemon" class="card text-center">
				<div class="card-body">
					<div class="row align-items-center">
						<div class="col">
							<div class="box-card2">
								<div class="card-imagen2">
									<img width="200px" src="${pokemon.imagen}" alt="${pokemon.nombre}">
								</div>
								<div class='card-info2'>
									<h5 class="card-title">
									${pokemon.nombre
									.split('-')
									.map(
										(nombre) => nombre.charAt(0).toUpperCase() + nombre.slice(1)
									)
									.join(' ')}
									</h5>
									<p class="card-text">ID: ${pokemon.id}</p>
									<p class="card-text">Tipos:</p>
									${pokemon.tipos
									.map(
									(tipo) =>
										`<img src="src/public/tipos/${tipo}.png" alt="${tipo}" />`
									)
									.join(' ')}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

			document.querySelector('#card-pokemon').addEventListener('click', () => {
				Swal.fire({
					title: 'Estadisticas',
					html: `<canvas id="estadisticas" width="400" height="400"></canvas>`,
					showConfirmButton: false,
					showCloseButton: false,
					showCancelButton: false,
				});

				const estadisticas = pokemon.estadisticas.map(
					(estadistica) => estadistica.valor
				);

				new Chart(document.getElementById('estadisticas'), {
					type: 'radar',
					data: {
						labels: [
							'Salud',
							'Ataque',
							'Defensa',
							'Ataque especial',
							'Defensa especial',
							'Velocidad',
						],
						datasets: [
							{
								label: 'Estadísticas',
								data: estadisticas,
								fill: true,
								backgroundColor: 'rgba(255, 99, 132, 0.2)',
								borderColor: 'rgb(255, 99, 132)',
								pointBackgroundColor: 'rgb(255, 99, 132)',
								pointBorderColor: '#fff',
								pointHoverBackgroundColor: '#fff',
								pointHoverBorderColor: 'rgb(255, 99, 132)',
							},
						],
					},
					options: {
						elements: {
							line: {
								borderWidth: 3,
							},
						},
						scales: {
							r: {
								angleLines: {
									display: true,
								},
								suggestedMin: Math.min(...estadisticas) - 5,
								suggestedMax: Math.max(...estadisticas) + 5,
							},
						},
					},
				});
			});
		} catch (error) {
			mostrarPokemon.innerHTML = `
			<div id="card-pokemon" class="card text-center">
				<div class="card-body">
					<div class="row align-items-center">
						<h5 class="card-title">El Pokémon no existe!</h5>
						</div>
					</div>
				</div>
			</div>
		`;
		}
	};

	const listadoInicial = async (e) => {
		e.preventDefault();

		listadoPokemons.innerHTML = '';

		await cargarListadoPokemons();
	};

	busqueda.addEventListener('submit', handleSubmit);

	listadoPokemonTab.addEventListener('click', listadoInicial);

	btnBorrarTodo.addEventListener('click', listadoInicial);
});