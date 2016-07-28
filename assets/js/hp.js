"use strict";
var HP;

HP = (function(){
	var util, model, pages, page, router;
	
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
			var target, image, fadein;
			
			fadein = function(){
				var opacity, rate, fadein;

				opacity = 0;
				rate = 1;

				fadein = function(){
					opacity+=rate;
					if(opacity <= 100){
						target.style.opacity = opacity * 0.01;
						return requestAnimationFrame(fadein);
					}
					return target.style.opacity = null;
				}
				return requestAnimationFrame(fadein);
			};

			target = this;

			image = new Image();
			image.src = util.asset("img", filename);
			image.addEventListener("load", function(){
				target.style.backgroundImage = [
					"url(",
					image.src,
					")"
				].join("");
				//fadein();
			});
		},
		"ajax": function(file, param, render, context){
			var buffer, xhr, query, nocache;
			
			query = function(){
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
				var showcase, hotels, slideshow,
				lastScroll, currentScroll, deltaScroll,
				slideshow;
				
				showcase = util.html("div", "showcase");
				
				slideshow = {
					"length": HP.model.length,
					"index": 0,
					"scroll":{
						"last": new Date(),
						"current": undefined,
						"delta": function delta(){
							return slideshow.scroll.current.getTime() - slideshow.scroll.last.getTime();
						},
						"reset": function reset(){
							slideshow.scroll.last = slideshow.scroll.current;
						}
					},
					"next": function next(){
						if(slideshow.index === slideshow.length-1)
							slideshow.index = 0;
						else
							slideshow.index+=1;
							
						slideshow.go(slideshow.index);
					},
					"prev": function prev(){
						if(slideshow.index === 0)
							slideshow.index = slideshow.length - 1;
						else
							slideshow.index -= 1;
						
						slideshow.go(slideshow.index);
					},
					"go": function go(i){
						showcase.firstElementChild.style.marginLeft = ["-", i, "00%"].join("");
					}
				};
				
				showcase.addEventListener("wheel", function(e){
					slideshow.scroll.current = new Date();
					
					if(slideshow.scroll.delta() > 500){
						if(e.deltaY > 0)
							slideshow.next();
						else
							slideshow.prev();
							
						slideshow.scroll.reset();
					}
				});

				hotels = HP.model;
				hotels.forEach(function(h, i){
					var hotel, info;
					hotel = util.html("div", "hotel", "bg", "anim");
					util.image.call(hotel, h.image);
					showcase.appendChild(hotel);
					hotel.addEventListener("click", function(e){
						HP.page(
							"hotel",
							["id=",h.id].join("")
						);
					});

					info = (function(){
						var info, hotel, location;
						info = util.html("div", "info", "anim", "bg");

						hotel = util.html("h1", "hotel", "anim");
						hotel.textContent = h.name;
						info.appendChild(hotel);

						location = util.html("h3", "location", "anim");
						location.textContent = [h.city, h.country].join(", ");
						info.appendChild(location);

						return info;
					}());
					hotel.appendChild(info);
				});
				return showcase;
			};
			showcase = util.ajax("api/showcase.php", "", render, this);
		},
		"review": function(query){
			var review, render;
			render = function(){
				var json, review, header, slideshow, user, body, footer;
				json = HP.model;
				review = util.html("div");
				review.id = "review";

				slideshow = (function(){
					var slideshow, add;
					slideshow = util.html("div", "slideshow");
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
					var header, title, hotel, city;

					header = util.html("header");

					title = util.html("div", "title");
					header.appendChild(title);

					hotel = util.html("h1", "hotel");
					hotel.innerHTML = json.hotel;
					title.appendChild(hotel);

					city = util.html("h2", "city");
					city.innerHTML = json.city;
					title.appendChild(city);

					return header;
				}());

				user = (function(){
					var user, portrait, name;

					user = util.html("div", "user");

					portrait = util.html("div", "portrait", "bg", "anim");
					util.image.call(portrait, json.portrait);
					portrait.addEventListener("mouseover", util.active);
					portrait.addEventListener("mouseout", util.active);
					portrait.addEventListener("click", function(){
						HP.page("user", "id="+json.id);
					});
					user.appendChild(portrait);

					name = util.html("h3", "name");
					name.textContent = json.user;
					user.appendChild(name);
					console.log(json);

					return user;
				}());


				body = (function(){
					var body;
					body = util.html("div", "body");
					body.appendChild(header);
					body.appendChild(user);
					body.appendChild((function(){
						var text;
						text = util.html("div", "text");
						text.innerHTML = json.review;
						return text;
					}()));
					return body;
				}());

				review.appendChild(slideshow);
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
				
				user = util.html("div");
				user.id = "user";
				
				header = (function(){
					var header, portrait;
					
					header = util.html("header", "bg");
					header.id = "user";
					util.image.call(header, HP.model.background);
					user.appendChild(header);

					portrait = util.html("div", "anim");
					portrait.id = "portrait";
					portrait.appendChild(
						(function(){
							var image;
							image = new Image;
							image.src = util.asset("img", HP.model.portrait);
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
					name.innerHTML = HP.model.name;
					profile.appendChild(name);

					city = util.html("h2", "city");
					city.innerHTML = HP.model.city;
					profile.appendChild(city);

					username = util.html("h2", "username");
					username.innerHTML = HP.model.username;
					profile.appendChild(username);

					return profile;
				}());

				reviews = (function(){
					var add;
					add = function(json){
						var review, caption, hotel, city;
						review = util.html("div", "review", "bg");
						util.image.call(review, json.image);
						review.addEventListener("click", function(){
							page("hotel", "id="+json.id);
						});
						
						caption = util.html("div", "caption", "anim");

						hotel = util.html("h1", "hotel");
						hotel.textContent = json.name;
						review.appendChild(caption);
						user.appendChild(review);
					};
					HP.model.reviews.forEach(add);
				}());
				
				return user;
			};
			user = util.ajax("api/user.php", query, render, this);
		},
		"explore": function(){
			var explore, render;
			render = function(){
				var explore, marquee, prompt, search, cards;
				explore = util.html("div");
				explore.id = "explore";

				marquee = util.html("div", "marquee", "anim", "bg");
				explore.appendChild(marquee);

				prompt = util.html("h1");
				prompt.id = "prompt";
				prompt.textContent = "Where would you like to go?";
				marquee.appendChild(prompt);

				search = util.html("input", "search", "anim", "bg");
				search.type = "text";
				marquee.appendChild(search);

				cards = HP.model;

				cards.forEach(function(c, i){
					var card, badge, title;
					card = util.html("div", "card", "anim", "bg");
					util.image.call(card, c.image);
					explore.appendChild(card);

					badge = util.html("div", "badge", "anim", "bg");
					badge.style.backgroundColor = c.color;
					util.image.call(badge, c.badge);
					card.appendChild(badge);

					title = util.html("h3", "title", "anim");
					title.textContent = c.name;
					card.appendChild(title);

					card.addEventListener("mouseenter", function(e){
						card.classList.add("active");
					});
					card.addEventListener("mouseleave", function(e){
						card.classList.remove("active");
					});
				});

				return explore;
			};
			explore = util.ajax("api/explore.php", "", render, this);
		},
		"hotel": function(query){
			var hotel, render;
			render = function(){
				var hotel, marquee, titleblock, reviews;

				console.log(HP.model);

				hotel = util.html("div");
				hotel.id = "hotel";

				marquee = util.html("div", "marquee", "bg");
				util.image.call(marquee, HP.model.images);
				hotel.appendChild(marquee);

				titleblock = (function(){
					var titleblock, name, city, country, address, phone, experiences;
					titleblock = util.html("div", "titleblock");

					name = util.html("h1", "name");
					name.textContent = HP.model.name;

					address = util.html("h1", "address");
					address.innerHTML = HP.model.address;

					city = util.html("h2", "city");
					city.textContent = [HP.model.city, HP.model.country].join(", ");

					experiences = (function(){
						var experiences;
						experiences = util.html("div", "experiences");
						HP.model.experiences.forEach(function(e, i){
							var experience;
							experience = util.html("div", "experience", "anim", "bg");
							util.image.call(experience, e.badge);
							experience.addEventListener("click", function(){
								HP.page("tag", ["type=experience&id=", e.id].join(""));
							});
							experiences.appendChild(experience);
						});
						return experiences;
					}());

					titleblock.appendChild(name);
					titleblock.appendChild(city);
					titleblock.appendChild(experiences);
					titleblock.appendChild(address);

					return titleblock;
				}());
				hotel.appendChild(titleblock);

				reviews = util.html("div", "reviews");
				HP.model.reviews.forEach(function(r, i){
					var review, user, blurb;
					review = util.html("div", "review", "anim");

					user = (function(){
						var user, portrait, name, date;
						user = util.html("div", "user");

						portrait = util.html("div", "portrait", "bg", "anim");
						util.image.call(portrait, r.user.portrait);
						portrait.addEventListener("click", function(){
							HP.page("user", "id="+r.user.id);
						});

						name = util.html("h2", "name");
						name.textContent = r.user.name;

						user.appendChild(portrait);
						user.appendChild(name);
						return user;
					}());

					blurb = (function(){
						var blurb, date, body;

						blurb = util.html("div", "blurb", "anim");
						
						date = util.html("h3", "date");
						date.textContent = (new Date(r.date)).toDateString();

						body = util.html("div", "body");
						body.innerHTML = r.body;

						blurb.appendChild(date);
						blurb.appendChild(body);
						return blurb;
					}());

					review.appendChild(user);
					review.appendChild(blurb);

					reviews.appendChild(review);
				});
				hotel.appendChild(reviews);

				return hotel;
			};
			hotel = util.ajax("api/hotel.php", query, render, this);
		},
		"tag": function tag(query){
			var tag, render;
			render = function(){
				var tag = util.html("div");
				console.log(HP.model);
				return tag;
			};
			tag = util.ajax("api/tag.php", query, render, this);
		}
	};
	
	page = (function(){
		var buffer, render,
		
		buffer = new DocumentFragment();

		render = function(){
			var page,
			header, footer,
			content, overlay;
		
			page = util.html("div", "page", "anim");
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
							"name": "explore",
						},
						{
							"name": "how it works",
						},
						{
							"name": "about",
						}
					];
					add = function(el){
						var link;
						link = util.html("span", "anim");
						link.innerHTML = el.name;
						link.addEventListener("click", function(){
							HP.page(el.name, "");
						});
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

			footer = (function(){
				var footer;
				footer = util.html("footer");
				footer.id = "main";
				page.appendChild(footer);
				return footer;
			}());
		
			document.body.appendChild(buffer);
		};
		
		window.addEventListener("load", render);
		window.addEventListener("load", function(){
			HP.page("showcase", "");
		});
			
		return function(name, query){
			if(!pages[name])
				return console.error("Page doesn't exist: " + name);
			content.innerHTML = "";
			document.getElementsByClassName("page")[0].id = name;
			pages[name].call(content, query);
		};
	}());

	router = {
		pages: [],
		register: function(){
		},
	};
	return {
		"pages": pages,
		"page": page,
		"model": model
	};
}());
