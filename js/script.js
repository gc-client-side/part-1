(function() {

	document.addEventListener('DOMContentLoaded', function() {
		var signUp = document.getElementById('sign-up'),
				formElems = signUp.elements;

		signUp.addEventListener('submit', function(e) {
			e.preventDefault();

			for (var i=0, len=formElems.length; i<len; i++) {
				var value = formElems[i].value.trim(),
						id = formElems[i].id;
				if (!value && id) // if empty value
					document.getElementById(id).setAttribute('class', 'invalid');
				else if (id) // if id exists (not submit button)
					document.getElementById(id).setAttribute('class', 'valid');
			};

		})
	});
}());