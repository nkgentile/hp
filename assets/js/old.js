"use strict";
var HP;

HP = (function(){
	var utils, pages, views, page;
	
	pages = {
		"showcase": function(){
			var showcase, render;
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
						HP.views.review(json.id);
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
			showcase = ajax("api/showcase.php", "", render, HP.page.content);
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
	
	views = {
		"review": function(id){
			var review, render;
			render = function(json){
				var review, header, slideshow, body, footer;
				review = html("div", "review");

				header = (function(){
					var header, title;

					header = html("header");
					review.appendChild(header);

					title = html("h1", "title");
					title.innerHTML = json.hotel;
					header.appendChild(title);

					return header;
				}());

				slideshow = (function(){}());

				return review;
			};
			review = ajax("api/review.php", "id="+id, render, HP.page.content);
		},
		"user": function(id){
			var user, render;
		}
	};
	
	page = (function(){
		//create page
		//return content and overlay
		var buffer, page,
		header, footer,
		content, overlay;
		
		buffer = new DocumentFragment();
		
		page = html("div");
		page.id = "page";
		buffer.appendChild(page);
		
		header = (function(){
			var header, buffer, logo, title, nav;
			header = html("header", "main");
			page.appendChild(header);

			logo = new Image();
			logo.id = "logo";
			logo.src = "assets/svg/logo.svg";
			header.appendChild(logo);

			title = html("h1", "title");
			title.innerHTML = "Hotel Poet";
			header.appendChild(title);

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
				header.appendChild(nav);
				return nav;
			}());

			return header;
		}());
		
		content = html("div", "view");
		content.id = "content";
		page.appendChild(content);
		
		//overlay = html("div", "view");
		//overlay.id = "overlay";
		//page.appendChild(overlay);
		
		window.addEventListener("load", function(){
			document.body.appendChild(buffer);
		});
			
		return {
			"header": header,
			"content": function(html){
				content.innerHTML = "";
				content.appendChild(html);
			},
			"overlay": function(html){
			},
			"footer": footer
		};
	}());
	
	return {
		"views": views,
		"pages": pages,
		"page": page,
		"overlay": (function overlay(){
			var overlay;

			return {
				"open": function(el){
					overlay = html("div", "view", "anim", "active");
					overlay.id = "overlay";
					overlay.appendChild(el);
					document.body.appendChild(overlay);

				},
				"close": function(){
					overlay.classList.toggle("active");
					document.body.removeChild(overlay);
				}
			};
		}())
	};
}());
