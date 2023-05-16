import Pokemon from '../../components/Pokemon.js';
import Chart from 'chart.js/auto';

const baseUrl = 'https://pokeapi.co/api/v2';

document.addEventListener('DOMContentLoaded', () => {
	const busqueda = document.querySelector('#busqueda');
	const listadoPokemonTab = document.querySelector('#listado-pokemons-tab');
	const mostrarPokemon = document.querySelector('#mostrarPokemon');
	const listadoPokemons = document.querySelector('#listadoPokemons');
	const btnBorrarTodo = document.querySelector('[data-id="btnBorrarTodo"]');
	let btnCargarMas;

	console.log(btnBorrarTodo);

	const cargarListadoPokemons = async (offset = 0) => {
		const res = await fetch(`${baseUrl}/pokemon?limit=20&offset=${offset}`);
		const data = await res.json();

		await mostrarListadoPokemons(data.results, offset);
	};

	const mostrarListadoPokemons = async (data, offset) => {
		await data.map(async (poke) => {
			const resOne = await fetch(poke.url);
			const pokemon = await resOne.json();

			listadoPokemons.innerHTML += `
				<div class="col-12 col-md-6 col-lg-4 col-xl-3">
					<div class="card text-center" style="height: 350px;">
						<div class="card-body">
							<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
							<h5 class="card-title">${
								pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
							}</h5>
							<p class="card-text">ID: ${pokemon.id}</p>
							<p class="card-text">Tipos:</p>
							<span class="row">${pokemon.types
								.map(
									(tipo) =>
										`<img class="col-12 object-fit-none" src="src/public/tipos/${tipo.type.name}.png" alt="${tipo.type.name}" />`
								)
								.join('')}
							</span>
						</div>
					</div>
				</div>`;
		});

		if (btnCargarMas) {
			btnCargarMas.dataset.offset = offset;
		}

		cargarBotonCargarMas();
	};

	const botonCargarMas = async (e) => {
		e.preventDefault();

		await cargarListadoPokemons(parseInt(btnCargarMas.dataset.offset) + 20);
	};

	const cargarBotonCargarMas = () => {
		btnCargarMas = document.querySelector('[data-id="btnCargarMas"]');

		btnCargarMas.addEventListener('click', botonCargarMas);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const nombreID = document
			.querySelector('#nombre-id-pokemon')
			.value.toLowerCase();

		const res = await fetch(`${baseUrl}/pokemon/${nombreID}`);
		const data = await res.json();

		const pokemon = new Pokemon(
			data.id,
			data.name,
			data.sprites.front_default,
			data.types.map((tipo) => tipo.type.name),
			data.stats.map((estadistica) => {
				return {
					nombre: estadistica.stat.name,
					valor: estadistica.base_stat,
				};
			})
		);

		mostrarPokemon.innerHTML = `
			<div class="card text-center">
				<div class="card-body">
					<div class="row align-items-center">
						<div class="col">
						<img src="${pokemon.imagen}" alt="${pokemon.nombre}">
							<h5 class="card-title">${
								pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)
							}</h5>
							<p class="card-text">ID: ${pokemon.id}</p>
							<p class="card-text">Tipos:</p>
							${pokemon.tipos
								.map(
									(tipo) =>
										`<img src="src/public/tipos/${tipo}.png" alt="${tipo}" />`
								)
								.join(' ')}
						</div>

						<div class="col">
							<canvas id="estadisticas" class="mx-auto" width="500" height="500"></canvas>
						</div>
					</div>
				</div>
			</div>
		`;

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
