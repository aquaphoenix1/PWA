const dbName = "notesDB";

let login = "";

function dropDataBase(){
	window.indexedDB.deleteDatabase(dbName);
}

function imgClick(){
	$('#newNoteImage').click();
}

function init(newLogin){
    login = newLogin;
}

function getPhoto(){
	let deffered = $.Deferred();
	
	let filePath = $('#newNoteImage')[0];
		if (filePath.files.length > 0) {
            var file = filePath.files[0];
            var reader = new FileReader();
            reader.onload = (function (file) {
                return function (e) {
					deffered.resolve(e.target.result);
                };
            })(file);
            reader.readAsDataURL(file);
        }
		else{
			deffered.resolve("");
		}
		
	return deffered;
}

function changePreview(){
	let deffered = getPhoto();
	deffered.done((result)=>{
		$('#previewImage').attr('src', result);
	});
}

function addNewNoteClick(text, image, acceptFunction){
	$("#buttonsNotesListWrapper :input").prop("disabled", true);
	$("#notesList :input").prop("disabled", true);
	$('#newNoteText').val(text || '');
	$("#newNoteImage").val('');
	
	let $previewImage = $("#previewImage");
	$previewImage.attr('src', null);
	let $clone = $previewImage.clone(true);
	$previewImage.remove();
	
	$('.newNoteImageWrapper').prepend($clone);
	
	if(image){
		$clone.attr('src', image);
	}
	
	$('#accept').unbind('click').on('click', acceptFunction);
	
	$('#addNewNoteForm').css('display', 'flex');
}

function hideAddNewNoteForm(){
	$("#buttonsNotesListWrapper :input").prop("disabled", false);
	$("#notesList :input").prop("disabled", false);
	
	$('#addNewNoteForm').hide();
}

function acceptAddNewNoteClick(){
	let deferred = $.Deferred();

	deferred.done(function(value) {
		addNewNoteToDataBase($('#previewImage').attr('src'), $('#newNoteText').val(), value);
	});
	
	openDB(deferred);
}

function addNewNoteToDataBase(imageData, text, dataBase){
	let objectStore = dataBase.transaction('notes', 'readwrite').objectStore('notes');
	let req = objectStore.add({login: login, image: imageData, note: text});
		
	req.onsuccess = function (evt) {
		hideAddNewNoteForm();
		reloadNotes();
	};
	
	req.onerror = function() {
		alert(this.error);
	};
}

function cancelAddNewNoteClick(){
	hideAddNewNoteForm();
}

function openDB(deffered){
	let request = indexedDB.open(dbName, 3);
	
	request.onerror = function(event) {
		// Handle errors.
	};
	
	request.onupgradeneeded = function(event) {
	  let db = event.target.result;

	  let objectStore = db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
	  
	  objectStore.createIndex("login", "login", { unique: false });

	  objectStore.createIndex("image", "image", { unique: false });

	  objectStore.createIndex("note", "note", { unique: false });
	}
	
	request.onsuccess = function(){
		db = this.result;
		deffered.resolve(db);
	}
}

function removeAllNotes(){
     $('#notesList').children().each(function(){
        $(this).remove();
    });
}

function getNotesFromServer(callback){
	var deferred = $.Deferred();

	deferred.done(function(value) {
		var objectStore = value.transaction('notes', 'readonly').objectStore("notes");

		let data = [];

		objectStore.openCursor().onsuccess = function(event) {
			  let cursor = event.target.result;
			  if (cursor) {
				  if(cursor.value.login == login){
					  cursor.value.idNote = cursor.key;
					  data[data.length] = cursor.value;
				  }
				cursor.continue();
			  }
			  else{
				  callback(data);
			  }
		};
	});
	
	openDB(deferred);
}

function reloadNotes(){
   removeAllNotes();
   
   let callback = function(notes){
	   let $notesList = $('#notesList');

	   for(var i = 0; i < notes.length; i++){
		   let elem = createNote(notes[i]);
		   $notesList.append(elem);
	   }
   }

   getNotesFromServer(callback);
}

function deleteFromDb(id, callback){
	let deferred = $.Deferred();

	deferred.done(function(value) {
		let request = db.transaction("notes", "readwrite")
                .objectStore("notes")
                .delete(+id);
				
		request.onsuccess = function(event) {
			callback(id);
		};
	});
	
	openDB(deferred);
}

let timer = null;
let changedNoteId = null;

function changeExistingNote(image, text, db){
	let transaction = db.transaction("notes", "readwrite");
	let objectStore = transaction.objectStore("notes");

	let request = objectStore.openCursor();
				
	request.onsuccess = function(event) {
		let cursor = event.target.result;
		
		if(cursor){
			let value = cursor.value;
			if(value.login == login && value.id == +changedNoteId){
				value.note = text;
				value.image = image;
				cursor.update(value);
				
				hideAddNewNoteForm();
				reloadNotes();
			}
			else{
				cursor.continue();
			}
		}
	};
}

function createNote(noteData){
	let $div = $('<div class="note"></div>').attr('id', noteData.idNote);
	let $imageNote = $('<img class="imageNote"></img>').appendTo($div);
	if(noteData.image){
		 $imageNote.attr("src", noteData.image);
	}
	let $noteValue = $('<span class="noteValue"></span>').appendTo($div)
		.mousedown((ev)=>{
			if(!$("#notesList :input").prop("disabled")){
				let element = $(ev.target).parent().find('.buttonControlsWrapper');
				if(element.css('display') == 'flex'){
					element.hide();
				}
				else{
					element.css('display', 'flex');
				}
			}
			/*if(!$("#notesList :input").prop("disabled")){
				timer = setTimeout(() => {
					clearTimeout(timer);
					timer = null;
					$(ev.target).parent().find('.buttonControlsWrapper').css('display', 'flex');
						}, 500);
			}
			*/
		})/*
		.mouseup((ev)=>{
			if(!$("#notesList :input").prop("disabled")){
				clearTimeout(timer);
				if(timer != null){
					$(ev.target).parent().find('.buttonControlsWrapper').hide();
				}
			}
		})*/.text(noteData.note);
    let $controlButtonsWrapper = $('<div class="buttonControlsWrapper"></div>').appendTo($div);
	$('<button class="buttonControl">Редактировать</button>').appendTo($controlButtonsWrapper).click((ev)=>{
		$(ev.target).parent().parent().find('.buttonControlsWrapper').hide();
		
		let $elem = $(ev.target).closest('.note');
		changedNoteId = $elem.attr('id');
		let changeNoteAcceptFunction = function(event){
			event.stopPropagation();
			
			let deferred = $.Deferred();

			deferred.done(function(value) {
				changeExistingNote($('#previewImage').attr('src'), $('#newNoteText').val(), value);
			});
			
			openDB(deferred);
		}
		
		addNewNoteClick($elem.children('.noteValue').text(), $elem.children('.imageNote').attr('src'), changeNoteAcceptFunction);
	});
	
	$('<button class="buttonControl">Удалить</button>').appendTo($controlButtonsWrapper).click((ev)=>{
		let callback = function(id){
			$('#notesList').children('#' + id).remove();
		}
		
		deleteFromDb($(ev.target).parent().parent().attr('id'), callback);
	});

    return $div;
}
