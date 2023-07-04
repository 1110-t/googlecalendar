class Fetch{
	constructor(){
		this.method = {
			method:'GET',
			cache: "no-cache",
			mode:"cors",
			// header
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			},
		};
	}
	makeMethod(){
	}
	connect(url){
		return new Promise(function(resolve){
			// fetch API
			fetch(url,this.method).then((response) =>
				response.json()
					).then((info) =>
						resolve(info)
					).catch((error) =>
						resolve(error)
			);
		}.bind(this));
	}
}

class getFetch extends Fetch{
	constructor(){
		super();
		this.method.method = 'GET';
	}
}

class postFetch extends Fetch{
	constructor(body){
		super();
		this.method.method = 'POST';
		this.method.body = body;
	}
}
