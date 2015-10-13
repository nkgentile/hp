"use strict";
var html, ajax, asset;

asset = function(type, name){
	return [
		"assets/",
		type,
		"/",
		name,
	].join("");
};

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

ajax = function(file, param, render, target){
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
			console.error(html);
			return;
		}
		buffer.appendChild(html);
		try{
			if(typeof target === "object")
				target.appendChild(buffer);
			else if(typeof target === "function")
				target(buffer);
		} catch(e){
			console.error(e);
			return;
		}
	});
	xhr.send();

	return xhr;
};
