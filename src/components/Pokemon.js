/**
 * id
 * name
 * sprites->front_default
 * types->[type->name]
 * stats->[stats->base_stat]
 * - Salud
 * - Ataque
 * - Defensa
 * - Ataque especial
 * - Defensa especial
 * - Velocidad
 */

export default class Pokemon {
	constructor(id, nombre, imagen, tipos = [], estadisticas = []) {
		this._id = id;
		this._nombre = nombre;
		this._imagen = imagen;
		this._tipos = tipos;
		this._estadisticas = estadisticas;
	}

	get id() {
		return this._id;
	}

	set id(id) {
		this._id = id;
	}

	get nombre() {
		return this._nombre;
	}

	set nombre(nombre) {
		this._nombre = nombre;
	}

	get imagen() {
		return this._imagen;
	}

	set imagen(imagen) {
		this._imagen = imagen;
	}

	get tipos() {
		return this._tipos;
	}

	set tipos(tipos) {
		this._tipos.push(tipos);
	}

	get estadisticas() {
		return this._estadisticas;
	}

	set estadisticas({ nombre, valor }) {
		this._estadisticas.map((estadistica) => {
			if (estadistica.nombre === nombre) {
				estadistica.valor = valor;
			}

			return estadistica;
		});
	}
}
