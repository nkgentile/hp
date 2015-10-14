"use strict";
var HP;

HP = (function(){
	var util, model, pages, page;
	
	util = {
		"asset": function(type, name){
			return [
				"assets/",
				type,
				"/",
				name,
			].join("");
		},
		"html": function(tag, className){
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
		},
		"image": function(filename){
			var target, image;
			target = this;
			image = new Image();
			image.src = util.asset("img", filename);
			image.addEventListener("load", function(){
				target.style.backgroundImage = [
					"url(",
					image.src,
					")"
				].join("");
			});
			target.style.backgroundImage = [
				"url(",
				"assets/img/",
				"loading.gif",
				")"
			].join("");
		},
		"ajax": function(file, param, render, context){
			var buffer, xhr, query, nocache;
			
			nocache = function(){
				return [
					"nocache",
					new Date().getTime()
				].join("=");
			};
			
			query = function(){
			/*	return [
					nocache(),
					param || ""
				].join("&");*/
				return param || "";
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
				var html;
				if(this.readyState < 4)
					return;
				if(this.status !== 200)
					console.error(this.responseText);
					
				HP.model = JSON.parse(this.responseText);
				context.appendChild(render());
			});
			xhr.send();
			return xhr;
		},
		"active": function(){
			this.classList.toggle("active");
		}
	};
	
	pages = {
		"showcase": function(){
			var showcase, render;
			render = function(){
				var reviews, add, showcase, slides, add,
				index, next, prev, go,
				timer, animate, stop, nav;
				
				reviews = HP.model;
	
				add = function(json){
					var review, info, user, hotel;

					review = util.html("div", "review", "anim");
					util.image.call(review, json.image);
					review.addEventListener("click", function(){
						page("review", "id="+json.id);
					});
					showcase.appendChild(review);	
					slides.push(review);
		
					info = util.html("footer", "info");
					review.appendChild(info);

					user = (function(){
						var user, name, portrait;
			
						user = util.html("div", "user");
						info.appendChild(user);
			
						portrait = new Image();
						portrait.src = "assets/img/" + json["portrait"];
						user.appendChild(portrait);

						name = (function(){
							var u, name, city;

							u = util.html("div", "info", "anim");
							user.appendChild(u);
				
							name = util.html("h3", "name");
							name.innerHTML = json["user"];
							u.appendChild(name);
				
							city = util.html("p", "city");
							city.innerHTML = json["city"];
							u.appendChild(city);
							return u;
						}());

						portrait.addEventListener("mouseover", function(){
							util.active.call(name);
						});
						portrait.addEventListener("mouseout", function(){
							util.active.call(name);
						});
						user.addEventListener("click", function(e){
							page("user", "id="+json.id);
							e.stopPropagation();
						});
					}());

					hotel = (function(){
						var hotel, name, city, blurb;

						hotel = util.html("div", "hotel");
						info.appendChild(hotel);

						name = util.html("h1", "name");
						name.innerHTML = json["hotel"];
						hotel.appendChild(name);

						city = util.html("h2", "location");
						city.innerHTML = [
							json["city"], json["country"]
						].join(", ");
						hotel.appendChild(city);
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
				showcase = util.html("div", "showcase");
				reviews.forEach(add);
				nav = (function(){
					var nav, nodes, add;

					add = function(element, i){
						var node;
						node = util.html("div", "node", "anim");
						node.addEventListener("click", function(){
							index = i;
							go();
						});
						nav.appendChild(node);
						nodes.push(node);
					};

					nodes = [];
					nav = util.html("div", "nav");
					//append nav somewhere
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
			showcase = util.ajax("api/showcase.php", "", render, this);
		},
		"destinations": function(){
			var page, grid, header, render;
		
			document.body.innerHTML = "";
			page = util.html("div", "page", "anim");
			document.body.appendChild(page);
		
			header = page.appendChild(menu());
		
			render = function(destinations){
				var grid, add;

				add = function(d){
					var destination, title;
					destination = util.html("div", "destination", "cell", "circle", "anim");
					destination.style.backgroundImage = [
						"url(",
						"assets/svg/",
						d["badge"],
						")"
					].join("");
					grid.appendChild(destination);
				
					title = util.html("h1", "name", "anim");
					title.innerHTML = d.name;
					destination.addEventListener("mouseover", function(){
						title.classList.toggle("active");
					});
					destination.addEventListener("mouseout", function(){
						title.classList.toggle("active");
					});
					destination.appendChild(title);
				};

				grid = util.html("div", "grid");
				destinations.forEach(add);

				return grid;
			};
		
			grid = util.ajax("api/destinations.php", "", render);
		},
		"experiences": function(){
		},
		"review": function(query){
			var review, render;
			render = function(){
				var json, review, header, slideshow, body, footer;
				json = HP.model;
				review = util.html("div");
				review.id = "review";

				slideshow = (function(){
					var slideshow, add;
					slideshow = util.html("div", "slideshow");
					review.appendChild(slideshow);
					add = function(json){
						var slide;
						slide = util.html("div", "slide", "bg", "anim");
						util.image.call(slide, json)
						slideshow.appendChild(slide);
					};
					try{
						json.images.forEach(add);
					} catch(e){
						add(json.images);
					}
					return slideshow;
				}());

				header = (function(){
					var header, title;

					header = util.html("header");
					review.appendChild(header);

					title = util.html("h1", "title");
					title.innerHTML = json.hotel;
					header.appendChild(title);

					return header;
				}());

				body = util.html("div", "body");
				body.innerHTML = json.review;
				review.appendChild(body);

				return review;
			};
			review = util.ajax("api/review.php", query, render, this);
		},
		"user": function(query){
			var user, render;
			render = function(){
				var json, user,
				header, profile,
				reviews, footer;
				
				json = HP.model;
				
				user = util.html("div");
				user.id = "user";
				
				header = (function(){
					var header, portrait;
					
					header = util.html("header", "bg");
					header.id = "user";
					util.image.call(header, json.background);
					user.appendChild(header);

					portrait = util.html("div");
					portrait.id = "portrait";
					portrait.appendChild(
						(function(){
							var image;
							image = new Image;
							image.src = util.asset("img", json.image);
							return image;
						}())
					);
					header.appendChild(portrait);

					return header;
				}());

				profile = (function(){
					var profile, name, city, username;
					profile = util.html("div");
					profile.id = "profile";
					user.appendChild(profile);

					name = util.html("h1", "name");
					name.innerHTML = json.name;
					profile.appendChild(name);

					username = util.html("h2", "username");
					username.innerHTML = json.username;
					profile.appendChild(username);

					city = util.html("h2", "city");
					city.innerHTML = json.city;
					profile.appendChild(city);

					return profile;
				}());

				reviews = (function(){
					var add;
					add = function(json){
						var review;
						review = util.html("div", "review", "bg");
						util.image.call(review, json.image);
						review.addEventListener("click", function(){
							page("review", "id="+json.id);
						});
						user.appendChild(review);
					};
					json.reviews.forEach(add);
				}());
				
				return user;
			};
			user = util.ajax("api/user.php", query, render, this);
		}
	};
	
	page = (function(){
		var buffer, render,
		
		buffer = new DocumentFragment();
		
		render = function(){
			var page,
			header, footer,
			content, overlay;
		
			page = util.html("div");
			page.id = "page";
			buffer.appendChild(page);
		
			header = (function(){
				var header, logo, title, subtitle, nav;

				header = util.html("header");
				header.id = "main";
				page.appendChild(header);

				title = util.html("div");
				title.id = "title";
				title.addEventListener("click", function(){
					HP.page("showcase");
				});
				header.appendChild(title);

				logo = new Image();
				logo.id = "logo";
				logo.src = "assets/svg/logo.svg";
				title.appendChild(logo);

				subtitle = util.html("h1");
				subtitle.innerHTML = "Hotel Poet";
				title.appendChild(subtitle);

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
						link = util.html("span", "anim");
						link.innerHTML = el.name;
						link.addEventListener("click", el.click);
						nav.appendChild(link);
					};
					nav = util.html("nav");
					nav.id = "main";
					links.forEach(add);
					header.appendChild(nav);
					return nav;
				}());

				return header;
			}());
		
			content = util.html("div", "view");
			content.id = "content";
			page.appendChild(content);
		
			document.body.appendChild(buffer);
		};
		
		window.addEventListener("load", render);
		window.addEventListener("load", function(){
			HP.page("showcase");
		});
			
		return function(page, query){
			if(!pages[page])
				return console.error("Page doesn't exist");
			content.innerHTML = "";
			pages[page].call(content, query);
		};
	}());
	
	return {
		"pages": pages,
		"page": page,
		"model": model
	};
}());
