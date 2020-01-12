class Pokemon{
	constrcutor(){
		this.name = null;
		this.abilities = [];
		this.base_experience = null;
		this.height = null;
		this.id = null;
		this.moves = [];
		this.sprites = {};
		this.stats = [];
		this.types = [];
		this.weight = null;
	}
}

Pokemon.prototype.renderPokemonDetails = function(){
	document.getElementById('id01').style.display='block';
	var pokemonNameDiv = document.getElementById("pokemonNameId");
	var headerDiv = document.getElementById("headerId");
	pokemonNameDiv.innerHTML = this.name;
	fetch(this.species.url,{
		method : "GET"
	}).then(function(response){
		if(response.ok){
			return response.json();
		}
		throw new Error("Response not ok");
	}).then(function(result){
		headerDiv.style.backgroundColor = result.color.name;
	}).catch(function(e){
		console.log(e.message);
	})
	var abilities = document.getElementById("abilitiesId");
	abilities.innerHTML = "Abilities";
	this.abilities.forEach(function(item,index){
		var button = document.createElement("button");
		abilities.appendChild(button);
		button.innerHTML = item.ability.name;
		button.style.position = "relative";
		button.style.left = "10px";
		var div = document.createElement("div");
		div.style.display = "none";
		abilities.appendChild(div);
		button.onclick = function(){
			var p = fetch(item.ability.url,{
				method:"GET"
			}).then(function(response){
				if(response.ok){
					return response.json();
				}
				throw new Error("Response not ok");
			}).then(function(result){
				div.innerHTML = result.effect_entries[0].short_effect;
				div.style.display = "block";
			}).catch(function(error){
				console.log("error.message");
			})
		}
	})
}