let players_display = {
	players_list: document.getElementById("players"),
	table_header: document.getElementById("vangSwissRow"),
	
	pairs_list_header:
		"<tr>\n" +
		"<th>table number</th>" +
		"<th>player name</th>\n" +
		"<th class='printHidden'>select winners</th>\n" +
		"<th>scores</th>\n" +
		"<th>first or second</th>\n" +
		"<th class='printHidden'>first count</th>\n" +
		"<th class='printHidden'>players to drop</th>\n" +
		"<th class='printHidden'>had bye</th>\n" +
		"</tr>\n",
		
	placement_list_header:
		"<tr>\n" +
		"<th>placement</th>" +
		"<th>player name</th>\n" +
		"<th>final scores</th>\n" +
		"<th class='printHidden'>loser scores</th>\n" +
		"<th class='printHidden'>winner scores</th>\n" +
		"<th class='printHidden'>tier2 loser scores</th>\n" +
		"<th class='printHidden'>tier2 winner scores</th>\n" +
		"<th>dropped</th>\n" +
		"</tr>\n",
	
	update_display: function() {
		let players = playerPool.players;
		document.getElementById("nextRoundButton").disabled = swissBracket.ended;
		document.getElementById("roundDisplay").innerHTML = "Round " + swissBracket.roundCount;
		this.resize_players_display(players.length);
		if (swissBracket.ended)
			this.display_placement_list(players);
		else
			this.display_pairs_list(players);
		this.enable_drop_button();
		this.enable_next_round_button();
		this.enable_end_bracket_button();
	},

	resize_players_display: function(size) {
		let current_length = this.players_list.childElementCount;
		for(;current_length < size;current_length++) {
			let table_row = document.createElement("tr");
			for (let x = 0;x < 8;x++) {
				let item = document.createElement("td");
				table_row.appendChild(item);
			}
			this.players_list.appendChild(table_row);
		}
		
		for (;current_length > size;current_length--) {
			this.players_list.firstChild.remove();
		}
	},

	//start in tournament display section

	display_pairs_list: function(players) {
		this.table_header.innerHTML = this.pairs_list_header;

		for (let x = 0; x < players.length; x++) {
			this.display_pairs_list_row(x, players[x]);
		}

	},
	
	display_pairs_list_row: function(row_num, player) {
		let table_num = Math.floor(row_num / 2) + 1;

		let table_row = this.players_list.childNodes[row_num];
		table_row.className = (table_num % 2 ? "oddTable" : "");
		
		for (td of table_row.childNodes) {
			this.clear_td_content(td);
		}

		let table_num_display = table_row.childNodes[0];
		table_num_display.textContent = table_num;

		let player_name_display = table_row.childNodes[1];
		player_name_display.textContent = String(player.name);

		let score_input_display = table_row.childNodes[2];
		let score_input = document.createElement("button");
		score_input.className = "scoreInput btn";
		score_input.name = "table" + table_num;
		row_num % 2 === 0
			? this.switch_button_to_winner(score_input)
			: this.switch_button_to_loser(score_input);
		score_input.addEventListener("click", (event) => { this.score_input_handler(event, score_input) })
		score_input_display.appendChild(score_input);
		score_input_display.className = "printHidden";

		let player_score_display = table_row.childNodes[3];
		player_score_display.textContent = (player.getScoreString());

		let playerStatus = table_row.childNodes[4]
		playerStatus.textContent = (player.isFirst()
			? "first"
			: player.isSecond()
				? "second"
				: "bye");

		let first_count = table_row.childNodes[5];
		first_count.className = "printHidden";
		first_count.textContent = String(player.firstCount);

		let dropPlayerDisplay = table_row.childNodes[6];
		let dropPlayerMark = document.createElement("input");
		dropPlayerMark.type = "checkbox";
		dropPlayerMark.className = "dropInput";
		dropPlayerMark.addEventListener("click", this.enable_drop_button);
		dropPlayerDisplay.appendChild(dropPlayerMark);
		dropPlayerDisplay.className = "printHidden";

		let hadBye = table_row.childNodes[7];
		hadBye.className = "printHidden";
		hadBye.textContent = player.hadBye;
	},
	
	//end in tournament display section
	
	//start placement display section

	display_placement_list: function(players) {
		this.table_header.innerHTML = this.placement_list_header;
		for (let x = 0; x < players.length; x++) {
			this.display_placement_list_row(x, players[x]);
		}
	},

	display_placement_list_row: function(row_num, player) {
		let table_row = this.players_list.childNodes[row_num];
		table_row.className = "";
		
		for (td of table_row.childNodes) {
			this.clear_td_content(td);
		}
		
		let placement_display = table_row.childNodes[0];
		placement_display.textContent = row_num + 1;
		
		let player_name_display = table_row.childNodes[1];
		player_name_display.textContent = String(player.name);
		
		let player_score_display = table_row.childNodes[2];
		player_score_display.textContent = (player.getScoreString());
		
		let loser_score_display = table_row.childNodes[3];
		loser_score_display.textContent = player.loserScore;
		
		let winner_score_display = table_row.childNodes[4];
		winner_score_display.textContent = player.winnerScore;
		
		let tier_2_loser_score_display = table_row.childNodes[5];
		tier_2_loser_score_display.textContent = player.tier2loserScore;
		
		let tier_2_winner_score_display = table_row.childNodes[6];
		tier_2_winner_score_display.textContent = player.tier2winnerScore;
		
		let dropped_display = table_row.childNodes[7];
		dropped_display.textContent = player.dropped;
	},
	
	//end placement display section

	//start input section

	add_player: function() {
		let player_names = document.getElementById("newPlayerNames").value.split("\n");
		for (let player_name of player_names) {
			if (player_name.trim() !== "") {
				let new_player = new SwissPlayer(player_name);
				playerPool.addPlayer(new_player);
			}
		}
		this.update_display();
	},

	start_bracket: function() {
		if (!swissBracket.started || window.confirm("Current tournament progress will be lost, proceed?")) {
			swissBracket.reset();
			this.update_display();
			debugHelper.logUniquePairsCount(playerPool.players);
		}
	},

	drop_and_pair: function() {
		this.drop_marked_players();
		swissBracket.pairPlayers();
		this.update_display();
	},

	drop_and_next_round: function() {
		debugHelper.lastState = playerPool.players;
		playerPool.tallyScores();
		this.drop_marked_players();
		swissBracket.nextRound();
		debugHelper.logUniquePairsCount(playerPool.players);
		this.update_display();
	},

	end_bracket: function() {
		swissBracket.endBracket();
		this.update_display();
	},

	enable_next_round_button: function() {
		document.getElementById("nextRoundButton").disabled = !swissBracket.started;
	},

	enable_drop_button: function() {
		drop_inputs = document.getElementsByClassName("dropInput");
		let disabled = true;
		for (let input of drop_inputs) {
			if (input.checked) {
				disabled = false;
				break;
			}
		}
		document.getElementById("dropButton").disabled = disabled;
	},
	
	enable_end_bracket_button: function() {
		document.getElementById("endBracketButton").disabled = swissBracket.ended;
	},

	score_input_handler: function(event, score_input) {
		let this_table = document.getElementsByName(score_input.name);
		if (score_input.classList.contains("btn-success")) {
			this.switch_button_to_loser(score_input);
		} else {
			for (let input of this_table) {
				this.switch_button_to_loser(input);
			}
			this.switch_button_to_winner(score_input);
		}
	},

	switch_button_to_winner: function(button) {
		button.classList.remove("btn-danger");
		button.classList.add("btn-success");
		button.textContent = "winner";
	},

	switch_button_to_loser: function(button) {
		button.classList.remove("btn-success");
		button.classList.add("btn-danger");
		button.textContent = "loser";
	},

	drop_marked_players: function() {
		let drop_inputs = document.getElementsByClassName("dropInput");
		for (let x = drop_inputs.length - 1; x >= 0; x--) {
			if (drop_inputs[x].checked) {
				playerPool.dropPlayer(x);
			}
		}
	},
	
	//end input section
	
	//start helper section
	
	clear_td_content: function(td) {
		while(td.firstChild) {
			td.firstChild.remove();
		}
	},
	
	//end helper section

	//unused functions
	
	removeConfirmation: function(playerCell) {
		if (window.confirm("Do you really want to remove this player?")) {
			playerPool.removePlayer(playerCell);
			updateDisplay();
		}
	},

	removeAllPlayersConfirmation: function () {
		if (
			window.confirm(
				"You're about to remove all players.  Do you want to proceed?"
			)
		) {
			playerPool.removeAllPlayers();
			updateDisplay();
		}
	},
}