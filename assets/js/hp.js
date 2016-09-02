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
			var target, fullImage, smallImage, fadein;
			
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

			fullImage = new Image();
			fullImage.src = util.asset("images/large", filename);
			fullImage.addEventListener("load", function(){
				target.style.backgroundImage = [
					"url(",
					util.asset("images/large", filename),
					")"
				].join("");
				//fadein();
			});
			
			smallImage = new Image();
			smallImage.src = util.asset("images/small", filename);
			target.style.backgroundImage = [
					"url(",
					util.asset("images/small", filename),
					")"
			].join("");
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
				lastScroll, currentScroll, deltaScroll;
				
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
					hotel.style.backgroundImage = [
						"url(",
						h.image,
						")"
					].join("");
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
				var explore, hotels, experiences;

				explore = new DocumentFragment();

				hotels = (function(){
					var section, title;
					section = document.createElement("section");
					section.classList.add("type");

					title = document.createElement("h1");
					title.classList.add("title");
					title.textContent = "Hotels";
					section.appendChild(title);

					HP.model.hotels.forEach(function(hotel, i){
						var item, title;

						item = document.createElement("div");
						item.classList.add("item");
						item.style.backgroundImage = [
							"url(",
							hotel.image,
							")"
						].join("");

						title = document.createElement("h3");
						title.classList.add("name");
						title.textContent = hotel.name;

						item.appendChild(title);
						section.appendChild(item);
					});

					return section;
				}());

				experiences = (function(){
					var section, title;
					section = document.createElement("section");
					section.classList.add("type");

					title = document.createElement("h1");
					title.classList.add("title");
					title.textContent = "Experiences";
					section.appendChild(title);

					HP.model.experiences.forEach(function(experience, i){
						var item, title;

						item = document.createElement("div");
						item.classList.add("item");
						item.style.backgroundImage = [
							"url(",
							experience.image,
							")"
						].join("");

						title = document.createElement("h3");
						title.classList.add("name");
						title.textContent = experience.name;

						item.appendChild(title);
						section.appendChild(item);
					});


					return section;
				}());

				explore.appendChild(hotels);
				explore.appendChild(experiences);
				return explore;
			};
			explore = util.ajax("api/explore.php", "", render, this);
		},
		"hotel": function(query){
			var hotel, render;
			render = function(){
				var hotel, marquee, titleblock,
				reviews, info, map;
				
				hotel = util.html("div");
				hotel.id = "hotel";
				
				marquee = util.html("div", "marquee", "bg");
				util.image.call(marquee, HP.model.images);

				titleblock = (function(){
					var titleblock, name, city,
					country, address, phone,
					experiences;
					
					titleblock = util.html("div", "titleblock");

					name = util.html("h1", "name");
					name.textContent = HP.model.name;

					city = util.html("h2", "city");
					city.textContent = [HP.model.city, HP.model.country].join(", ");

					/*
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
					*/

					titleblock.appendChild(name);
					titleblock.appendChild(city);
					/*
 					titleblock.appendChild(experiences);
 					titleblock.appendChild(address);
					*/

					return titleblock;
				}());
				
				reviews = util.html("div", "reviews");
				HP.model.reviews.forEach(function(r, i){
					var review, user,
					blurb, experiences;
					
					review = util.html("div", "review", "anim");

					user = (function user(){
						var user, portrait, name, date;
						user = util.html("div", "user");

						portrait = util.html("div", "portrait", "bg", "anim");
						portrait.style.backgroundImage = [
							"url(",
							"assets/images/small/",
							r.user.portrait,
							")"
						].join("");
						portrait.addEventListener("click", function(){
							HP.page("user", "id="+r.user.id);
						});

						name = util.html("h2", "name");
						name.textContent = r.user.name;

						user.appendChild(portrait);
						user.appendChild(name);
						return user;
					}());

					blurb = (function blurb(){
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
					
					experiences = (function(){
						var experiences, title;
						experiences = util.html("div", "experiences");
						
						title = util.html("h3");
						title.textContent = "Experiences";
						experiences.appendChild(title);
						
						HP.model.experiences.forEach(function(e, i){
							var experience, badge, name;
							
							experience = util.html("div", "experience");
							
							badge = util.html("div", "badge", "anim", "bg");
							badge.style.backgroundImage = [
								"url(",
								"assets/images/svg/",
								e.badge,
								")"
							].join("");
							badge.addEventListener("click", function(){
								HP.page("tag", ["type=experience&id=", e.id].join(""));
							});
							
							name = util.html("p");
							name.textContent = e.name;
							
							experience.appendChild(badge);
							experience.appendChild(name);
							experiences.appendChild(experience);
						});
						return experiences;
					}());

					review.appendChild(user);
					review.appendChild(blurb);
					review.appendChild(experiences);

					reviews.appendChild(review);
				});
				
				map = (function map(){
					var url, image, map, api;
					
					url = [
						"https://maps.googleapis.com/maps/api/staticmap?",
						"format=png32&center=",
						HP.model.latitude,
						",",
						HP.model.longitude,
						"&",
						"zoom=14&size=640x640&",
						"markers=color:black|",
						HP.model.latitude, ",",
						HP.model.longitude,
						"&",
						"scale=2&",
						"key=AIzaSyAefEZ492qLVz9D0pNhb300hafvoxYKwaE"
					].join("");
					
					image = new Image();
					image.src = url;
					
					map = util.html("div", "map", "bg");
									
					api = util.html("script");
					api.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAefEZ492qLVz9D0pNhb300hafvoxYKwaE";
					document.head.appendChild(api);
					api.addEventListener("load", function(){
						var position, gmap, marker;
						
						position = new google.maps.LatLng(
							HP.model.latitude,
							HP.model.longitude
						);					
					
						gmap = new google.maps.Map(map, {
							center: position,
							zoom: 16,
							streetViewControl: false,
							scrollwheel: false,
							fullscreenControl: true,
							mapTypeControl: false
						});
						
						marker = new google.maps.Marker({
							position: position,
							map: gmap
						});
					});
											
					return map;
				}());
				
				info = (function info(){
					var info, address, phone, website;	
					
					info = util.html("div", "info");
										
					address = util.html("h1", "address");
					address.innerHTML = HP.model.address;
					
					phone = util.html("a", "phone");
					phone.href = ["tel:", HP.model.phone].join("");
					phone.textContent = HP.model.phone;
					
					website = util.html("a", "website");
					website.target = "_blank";
					website.href = HP.model.website;
					website.textContent = HP.model.website;
					
					info.appendChild(address);
					info.appendChild(phone);
					info.appendChild(website);
					
					return info;
				}());
				
				hotel.appendChild(marquee);
				hotel.appendChild(titleblock);
				hotel.appendChild(reviews);
				hotel.appendChild(info);
				hotel.appendChild(map);
				
				return hotel;
			};
			hotel = util.ajax("api/hotel.php", query, render, this);
		},
		"tag1": function tag(query){
			var tag, render;
			render = function(){
				var tag = util.html("div");
				tag.id = "tag";
				
				marquee = util.html("div", "marquee", "bg");
				util.image.call(marquee, HP.model.image);
				
				hotel.appendChild(marquee);
				
				return tag;
			};
			tag = util.ajax("api/tag.php", query, render, this);
		},
		"destinations": function destinations(query){
			var destinations, render;
			render = function(){
				var buffer, map, info;
				buffer = new DocumentFragment();

				info = (function(){
					var model, info, image, set;

					info = document.createElement("div");
					info.classList.add("info");
					console.log(info);

					image = util.html("div", "marquee", "bg");

					set = function(data){
						model = data;
						info.innerHTML = null;
						image.style.backgroundImage = [
							"url(",
							"assets/images/small/",
							model.hotel.image,
							")"
						].join("");
						info.appendChild(image);
					};

					return {
						"set": set,
						"element": info
					};
				}());
				
				map = (function map(){
					var url, image, map, api, add;
					
					map = util.html("div", "map", "bg");
									
					api = util.html("script");
					api.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAefEZ492qLVz9D0pNhb300hafvoxYKwaE";

					add = function(){
						var gmap, bounds;

						gmap = new google.maps.Map(map, {
							zoom: 6,
							streetViewControl: false,
							scrollwheel: false,
							fullscreenControl: false,
							mapTypeControl: false,
							zoomControl: true,
							zoomControlOptions:{
								position: google.maps.ControlPosition.RIGHT_CENTER
							}
						});

						bounds = new google.maps.LatLngBounds();
						HP.model.forEach(function(e, i){
							var marker, position, image;
							position = new google.maps.LatLng(
								e.hotel.latitude,
								e.hotel.longitude
							);

							marker = new google.maps.OverlayView();
							marker.addListener("click", function(){
								gmap.panTo(position);
								gmap.setZoom(6);
								info.set(e);
							});
							marker.onAdd = function(){
								image = document.createElement("div");
								image.classList.add("marker");
								/*
								image.style.backgroundImage = [
									"url(",
									"assets/images/small/",
									e.user.portrait,
									")"
								].join("");
								*/
								this.getPanes().overlayMouseTarget.appendChild(image);
								google.maps.event.addDomListener(
									image,
									"click",
									function(){
										google.maps.event.trigger(marker, "click")
									}
								);
							};
							marker.draw = function(){
								var overlayProjection, p;
								overlayProjection = this.getProjection();
								p = overlayProjection.fromLatLngToDivPixel(position);

								image.style.left = (p.x - 7.5) + "px";
								image.style.top = (p.y - 7.5) + "px";
							};
							marker.onRemove = function(){
								image.parentNode.removeChild(image);
								image = null;
							};
							marker.setMap(gmap);
							bounds.extend(position);
						});

						gmap.fitBounds(bounds);
					}
	
					api.addEventListener("load", add);
					document.head.appendChild(api);

					return map;
				}());

				buffer.appendChild(map);
				buffer.appendChild(info.element);
				
				return buffer;
			};
			destinations = util.ajax("api/destinations.php", query, render, this);
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
				var header, logo, title,
				subtitle, nav, search;

				header = util.html("header");
				header.id = "main";

				title = util.html("div");
				title.id = "title";
				title.addEventListener("click", function(){
					HP.page("showcase");
				});

				logo = new Image();
				logo.id = "logo";
				logo.src = "assets/images/svg/logo.svg";

				subtitle = util.html("h1");
				subtitle.innerHTML = "Hotel Poet";

				nav = (function(){
					var nav, add, links;
					links = [
						{
							"name": "explore"
						},
						{
							"name": "destinations"
						},
						{
							"name": "become a hotel poet"
						},
						{
							"name": "about"
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
					return nav;
				}());

				search = (function(){
					var search, icon, query,
					overlay, close, results,
					marquee, field;

					query = (function(){
						var xhr, fetch;

						xhr = new XMLHttpRequest();

						fetch = function(query, context){
							xhr.open("GET", "api/search.php?q=" + query, true);
							xhr.onreadystatechange = function(e){
								if(e.target.readyState < 4) return;

								context.innerHTML = "";

								if(e.target.response === "false"){
									return context.textContent = "Sorry, no results were found...";
								};

								var results;
								results = JSON.parse(e.target.response);
								results.forEach(function(result, i){
									var item, name, image;

									image = new Image();
									image.src = result.image;

									item = document.createElement("div");
									item.classList.add("item");
									item.style.backgroundImage = [
										"url(",
										result.image,
										")"
									].join("");

									name = document.createElement("h3");
									name.classList.add("name");
									name.textContent = result.name;

									item.appendChild(name);
									context.appendChild(item);
								});
							};
							xhr.send();
						}

						return fetch;
					}());

					icon = document.createElement("div");
					icon.id = "searchIcon";
					icon.addEventListener("click", function(){
						document.body.classList.add("fixed");
						overlay.classList.remove("hidden");
					});

					overlay = document.createElement("div");
					overlay.id = "overlay";
					overlay.classList.add("hidden");

					search = document.createElement("div");
					search.id = "search";

					close = document.createElement("div");
					close.id = "close";
					close.addEventListener("click", function(){
						document.body.classList.remove("fixed");
						overlay.classList.add("hidden");
					});

					marquee = document.createElement("div");
					marquee.id = "marquee";

					results = document.createElement("div");
					results.id = "results";
					results.classList.add("hidden");

					field = document.createElement("input");
					field.type = "search";
					field.addEventListener("input", function(){
						if(this.value.match(/(^$|\W)/)){
							this.value = "";
							return results.classList.add("hidden");
						}

						results.classList.remove("hidden");
						query(this.value, results);
					});

					marquee.appendChild(field);

					search.appendChild(marquee);
					search.appendChild(results);
					search.appendChild(close);

					overlay.appendChild(search);

					page.appendChild(overlay);

					return icon;
				}());

				title.appendChild(logo);
				title.appendChild(subtitle);
				nav.appendChild(search);
				header.appendChild(title);
				header.appendChild(nav);
				page.appendChild(header);

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
