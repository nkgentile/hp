var html, ajax, render, colors, header;

html = function(tag, className){
	var html;
	try{
		html = document.createElement(tag);
	} catch(e) {
		console.error(e);
		return document.createElement("div");
	}
	if(className)
		for(var i=1, len=arguments.length; i<len; i++)
			html.classList.add(arguments[i]);
	return html;
};

pages = {
	"showcase": function(){
		var page, showcase, header, render;
		
		page = html("div", "page", "anim");
		document.body.appendChild(page);
		
		header = page.appendChild(menu());
		
		render = function(reviews){
			var add, showcase, slides, add,
			index, next, prev, go,
			timer, animate, stop, nav;
	
			add = function(json){
				var review, info, user, hotel;

				review = html("div", "review", "anim");
				review.style.backgroundImage = [
					"url(",
					"assets/img/",
					json["image"],
					")"
				].join("");
				review.addEventListener("click", function(){
					pages.review(json);
				});
				showcase.appendChild(review);	
				slides.push(review);
		
				info = html("footer", "info");
				review.appendChild(info);

				user = (function(){
					var user, name, portrait;
			
					user = html("div", "user");
					info.appendChild(user);
			
					portrait = new Image();
					portrait.src = "assets/img/" + json["portrait"];
					user.appendChild(portrait);

					name = (function(){
						var u, name, location;

						u = html("div", "info", "anim");
						user.appendChild(u);
				
						name = html("h3", "name");
						name.innerHTML = json["user"];
						u.appendChild(name);
				
						location = html("p", "location");
						location.innerHTML = json["location"];
						u.appendChild(location);
						return u;
					}());

					portrait.addEventListener("mouseover", function(){
						name.classList.toggle("active");
					});
					portrait.addEventListener("mouseout", function(){
						name.classList.toggle("active");
					});
				}());

				hotel = (function(){
					var hotel, name, location, blurb;

					hotel = html("div", "hotel");
					info.appendChild(hotel);

					name = html("h1", "name");
					name.innerHTML = json["hotel"];
					hotel.appendChild(name);

					location = html("h2", "location");
					location.innerHTML = [
						json["city"], json["country"]
					].join(", ");
					hotel.appendChild(location);
				}());
			};
	
			//navigation
			index = 0;
			next = function(){
				index++;
				index%=slides.length;
				go();
			};
			prev = function(){
				if(index === 0)
					return;
				index--;
				go();
			};
			go = function(){
				slides[0].style.marginLeft = [
					"-",
					index,
					"00%"
				].join("");
				nav.forEach(function(node){
					node.classList.remove("active");
				});
				nav[index].classList.add("active");
			};

			//Populate slideshow
			slides = [];
			showcase = html("div", "showcase");
			reviews.forEach(add);
			nav = (function(){
				var nav, nodes, add;

				add = function(element, i){
					var node;
					node = html("div", "node", "anim");
					node.addEventListener("click", function(){
						index = i;
						go();
					});
					nav.appendChild(node);
					nodes.push(node);
				};

				nodes = [];
				nav = html("div", "nav");
				document.getElementsByTagName("header")[0].appendChild(nav);
				slides.forEach(add);
				nodes[0].classList.add("active");
				return nodes;
			}());

			//Animate slideshow
			animate = (function(){
				timer = setInterval(next, 3000);
			}());

			stop = function(){
				clearInterval(timer);
			};
			return showcase;
		};
		
		showcase = ajax("api/showcase.php", "", render);
	},
	"review": function(json){
		console.log(json);
	},
	"destinations": function(){
		var page, grid, header, render;
		
		document.body.innerHTML = "";
		page = html("div", "page", "anim");
		document.body.appendChild(page);
		
		header = page.appendChild(menu());
		
		render = function(destinations){
			var grid, add;

			add = function(d){
				var destination, title;
				destination = html("div", "destination", "cell", "circle", "anim");
				destination.style.backgroundImage = [
					"url(",
					"assets/svg/",
					d["badge"],
					")"
				].join("");
				grid.appendChild(destination);
				
				title = html("h1", "name", "anim");
				title.innerHTML = d.name;
				destination.addEventListener("mouseover", function(){
					title.classList.toggle("active");
				});
				destination.addEventListener("mouseout", function(){
					title.classList.toggle("active");
				});
				destination.appendChild(title);
			};

			grid = html("div", "grid");
			destinations.forEach(add);

			return grid;
		};
		
		grid = ajax("api/destinations.php", "", render);
	},
	"experiences": function(){
	}
};

menu = function(){
	var header, buffer, logo, title, nav;
	buffer = new DocumentFragment();
	buffer.appendChild(html("div"));
	
	logo = new Image();
	logo.id = "logo";
	logo.src = "assets/svg/logo.svg";
	buffer.appendChild(logo);

	title = html("h1", "title");
	title.innerHTML = "Hotel Poet";
	buffer.appendChild(title);

	nav = (function(){
		var nav, add, links;
		links = [
			{
				"name": "destinations",
				"click": pages.destinations
			},
			{
				"name": "experiences",
				"click": pages.experiences
			},
			{
				"name": "how it works",
				"click": pages.how
			},
			{
				"name": "about",
				"click": pages.about
			}
		];
		add = function(el){
			var link;
			link = html("span", "anim");
			link.innerHTML = el.name;
			link.addEventListener("click", el.click);
			nav.appendChild(link);
		};
		nav = html("nav", "main");
		links.forEach(add);
		buffer.appendChild(nav);
		return nav;
	}());

	header = html("header", "main")
	header.appendChild(buffer);
	return header;
};

ajax = function(file, param, render){
	var buffer, xhr, query, nocache;

	nocache = function(){
		return [
			"nocache",
			new Date().getTime()
		].join("=");
	};

	query = function(){
		return [
			nocache(),
			param || ""
		].join("&");
	};

	buffer = new DocumentFragment();
	
	xhr = new XMLHttpRequest();
	xhr.open(
		"GET",
		[
			file,
			query()
		].join("?"),
		true
	);
	xhr.addEventListener("readystatechange", function(){
		var json, html;

		if(this.readyState < 4)
			return;
		if(this.status !== 200)
			console.error(this.responseText);

		try{
			json = JSON.parse(this.responseText);
		} catch(e){
			console.error(e);
			return;
		}

		try{
			html = render(json);
		} catch(e){
			console.error(e);
			return;
		}
		buffer.appendChild(html);

		document.getElementsByClassName("page")[0].appendChild(buffer);
	});
	xhr.send();

	return buffer;
};

window.onload = pages.showcase;
