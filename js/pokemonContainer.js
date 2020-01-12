class PokemonContainer {
	constructor(){
		this.pokemonList = [];
		this.count = null;
		this.paginationFlag = false;
	}
}

PokemonContainer.prototype.fetchPokemon = function(offset,limit,e){
		var self = this;
		self.pokemonList = [];
		var page = document.getElementById("pagesId");
		var elem = page.getElementsByTagName("*");
		for(let key in elem){
			if(elem[key].tagName === "A"){
				elem[key].classList.remove("active");
			}
		}
		if(e !== undefined){
			e.target.classList.add("active");
		}
		var pokemonContainer = document.getElementById("pokemonContainerId");
		pokemonContainer.innerHTML = "";
		var template = `<div id="pokemonId_0" class="pokemonClass">
							<img id=pokimgId_0></img>
						</div>`;
		pokemonContainer.innerHTML = template;
		var pokemonDiv = document.getElementById("pokemonId_0");
		try{
			fetch("https://pokeapi.co/api/v2/pokemon?offset="+offset+"&limit="+limit,{
				method : "GET"
			}).then(function(response){
				if(response.ok){
					return response.json();
				}
				throw new Error("Response not ok");
			}).then(function(result){
				var promises = [];
				var results = result.results;
				var numberOfPages = 0;
				self.count = result.count;
				numberOfPages = Math.ceil(self.count/limit);
				if(!self.paginationFlag){
					self.paginationFlag = true;
					self.createPagination(numberOfPages);
				}
				results.forEach(function(item,index){
					var pokemon = new Pokemon();
					promises.push(fetch(item.url,{
						method: "GET"
					}).then(function(response){
						if(response.ok){
							return response.json();
						}
						throw new Error("Response not ok");
					}).then(function(result){
						pokemon.name = result.name;
						pokemon.abilities = result.abilities;
						pokemon.base_experience = result.base_experience;
						pokemon.height = result.height;
						pokemon.id = result.id;
						pokemon.moves = result.moves;
						pokemon.sprites = result.sprites;
						pokemon.stats = result.stats;
						pokemon.types = result.types;
						pokemon.weight = result.weight;
						pokemon.species = result.species;
						self.pokemonList.push(pokemon);
					}));
				})
				Promise.all(promises).then(function(){
					self.pokemonList.sort(function(a,b){
						return a.id - b.id;
					});
					self.pokemonList.forEach(function(item,index){
						if(index === 0){
							var pokemonImg = document.getElementById("pokimgId_0");
							pokemonImg.src = item.sprites.front_default;
							pokemonImg.onclick = item.renderPokemonDetails.bind(item);
						}
						else{
							var clonePokeDiv = pokemonDiv.cloneNode(true);
							clonePokeDiv.id = "pokemonId_" + index;
							var elements = clonePokeDiv.getElementsByTagName("*");
							for(let key in elements){
								if(elements[key].id === "pokimgId_0"){
									elements[key].id = "pokimgId_" + index;
									elements[key].src = item.sprites.front_default;
									elements[key].onclick = item.renderPokemonDetails.bind(item);
								}
							}
							pokemonContainer.appendChild(clonePokeDiv);
						}
					})


				})
			});
		}catch(error){
			console.log(error.message);
		}
	}

	PokemonContainer.prototype.createPagination = function(numberOfPages){
		var self = this;
		var aTag = document.getElementById("pageI_0");
		var pages = document.getElementById("pagesId");
		for(let i = 0; i < numberOfPages; i++){
			if(i === 0){
				aTag.onclick = function(event){
					var e = event;
					self.fetchPokemon.call(self,i*100,100,e);
				}
				aTag.innerHTML = i + 1;
			}
			else{
				var cloneAnchorTag = aTag.cloneNode(true);
				cloneAnchorTag.id = "pageI_" + i;
				cloneAnchorTag.onclick = function(event){
					var e = event;
					self.fetchPokemon.call(self,i*100,100,e);
				}
				cloneAnchorTag.innerHTML = i + 1;
				pages.appendChild(cloneAnchorTag);
			}

		}
		aTag.classList.add("active");
	}

