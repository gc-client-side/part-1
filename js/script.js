(function() {
	var _slice = Array.prototype.slice;
	var _map = Array.prototype.map;
	var _filter = Array.prototype.filter;
	var _some = Array.prototype.some;

	//functional helpers
	function compose() {
		var fs = _slice.call(arguments),
			i = fs.length - 1;

		return function(v) {
			while (i >= 0) {
				v = fs[i].call(this, v);
				i--;
			}	

			i = fs.length-1;

			return v;
		}
	}

	function map(fn) {
		return function(obj) {
			return _map.call(obj, fn);
		}
	}

	function filter(fn) {
		return function(obj) {
			return _filter.call(obj, fn);
		}
	}

	function Either(left, right) {
		return function(v) {
			return left.call(this, v) || right.call(this, v);
		}
	}


	document.addEventListener('DOMContentLoaded', function() {
		var signUp = document.getElementById('sign-up'),
			formElems = signUp.elements,
			submit = document.getElementById('submit');



		var notEmpty = function(obj) {
			if (obj.value) {
				return obj;
			}
			return false;	
		}

		var isEmpty = function(obj) {
			obj.err = "field is empty!"
			return obj;
		} 

		var isValid = function(obj) {
			var name = obj.id,
				result,
				ptn;

			if (obj.err) {
				return false;
			}

			switch (name) {
				case 'username':
					ptn = /^[a-zA-Z\d]*$/;
					if (obj.value.search(ptn) === -1) {
						obj.err = 'username must not contain spaces or special characters.';
					}
					break;
				case 'password':
					//at least one special char and one number
					ptn = /^(?=.*[^a-zA-Z\d])(?=.*[\d]).*$/;
					if (obj.value.search(ptn) === -1) {
						obj.err = 'password must contain at least one number and one special character';
					}
					//password confirm
					if (obj.value !== document.getElementById('pw_confirm').value) {
						console.log('why');
						obj.err = 'passwords do not match';
					}
					
					break;
				case 'email':
					ptn =  /^[a-zA-Z\d]+(\.+[a-zA-Z\d]+)*@[a-zA-Z\d]+(\.+[a-zA-Z\d]+)*$/;
					if (obj.value.search(ptn) === -1) {
						obj.err = 'invalid email';
					}
					break;
				case 'phone':
					ptn = /^[\(\)\-\s\d]*$/;
					if (obj.value.search(ptn) === -1) {
						obj.err = 'invalid phone number';
					}
					break;
				default:
					return false;
					break;
			}


			return (obj.err) ? false : obj;
		}

		var showErr = function(obj) {
			if (obj.err) {
				document.getElementById(obj.id + "-err").textContent = obj.err;
			}
			return obj;
		}	

		var clearErr = function(obj) {
			//clear error messages
			obj.err = undefined;
			document.getElementById(obj.id+'-err').textContent = '';
			return obj;
		}


		var hasError = function(a) {
			return a.err;
		}

		var allErrorFree = function(fields) {
			return !_some.call(fields, hasError);
		} 

		var isInput = function(node) {
			return node.nodeName === "INPUT";
		}



		var filterInputs = filter(isInput);

		var checkEmpty = Either(notEmpty, isEmpty);

		var validate = Either(isValid, showErr); 

		var handleField = compose(validate,  checkEmpty, clearErr);

		var handleAllFields = compose(map(handleField), filterInputs);

		var submitSuccessful = compose(allErrorFree, handleAllFields)

		
		submit.addEventListener('click', function(e) {
			e.preventDefault();
			if (submitSuccessful(formElems)) {
				document.body.innerHTML = "<h1>SUCCESS</h1>";	
			}		
		})
	});
}());
