function characterThemes() {
			document.getElementById("creation_type").style.display = "none";
			document.getElementById("character_themes").style.display = "block";
			document.getElementById("back").style.display = "block";
		}
		
		function movieThemes() {
			document.getElementById("creation_type").style.display = "none";
			document.getElementById("movie_themes").style.display = "block";
			document.getElementById("back").style.display = "block";
		}
		
		function creationType() {
			document.getElementById("creation_type").style.display = "block";
			document.getElementById("character_themes").style.display = "none";
			document.getElementById("movie_themes").style.display = "none";
			document.getElementById("back").style.display = "none";
		}
		
		function showCredits() {
			document.getElementById("credits").style.display="block";
			document.getElementById("credits_button").style.display="none";
		}
