var curNote = null;

function store(data) {
  localStorage.setItem(curNote, data);
}

function clear() {
  $('#summernote').summernote('code', '')
  localStorage.setItem(curNote, '');
}

function save(note) {
  localStorage.setItem('curNote', note);
  store($('#summernote').summernote('code'))
}

function retrieve() {
  var note = localStorage.getItem(curNote);
  $('#summernote').summernote('code', note)
}

function removeNote() {
  var notes = findAllNotes();
  var note = notes[notes.length - 1];
  if (notes.length == 1) {
    clear();
  } else {
    var newNote = notes[notes.length - 2];
    swapNote(newNote);
    $('#' + newNote).addClass('active');
    $('#' + note).remove();
    localStorage.removeItem(note);
  }
}

function swapNote(nextNote) {
  save(curNote);
  curNote = nextNote;
  retrieve();
}

function addNote() {
  var notes = findAllNotes();
  var lastNote = notes[notes.length - 1];
  var num = parseInt(lastNote.match(/\d+/)[0]) + 1;
  addTab('note' + num);
}

function addTab(note) {
  var title = formatNoteTitle(note);
  var elementString = '<li role="presentation" class="note" id="' + note + '"><a href="#">' + title + '</a></li>';
  $('.nav').append(elementString);
  localStorage.setItem(note, '');
  attachClickHandlers();
}

function addControlTabs() {
  var addElement = '<li role="presentation" class="pull-right" id="add"><a href="#"><i class="fa fa-plus"></a></li>';
  var removeElement = '<li role="presentation" class="pull-right" id="remove"><a href="#"><i class="fa fa-times"></a></li>';
  $('.nav').append(addElement);
  $('.nav').append(removeElement);
}

function attachClickHandlers() {
  $('.nav li.note a').off("click").on('click', function() {
    $(this).parent().parent().find('.active').removeClass('active');
    $(this).parent().addClass('active');
    attachClickHandlers();
    swapNote($(this).parent().attr('id'))
  });
  $('.nav li#add a').off("click").on('click', function() {
    addNote();
  });
  $('.nav li#remove a').off("click").on('click', function() {
    removeNote();
  });
}

function findAllNotes() {
  var notes = [];
  var index = 1;

  while (index > 0) {
    var note = "note" + index;
    var item = localStorage.getItem(note);

    if (item == null) {
      index = -1
    } else {
      index++;
      notes.push(note);
    }
  }

  return notes;
}

function formatNoteTitle(title) {
  var title = title.replace(/(\d+)/g, function (_, num){
    return ' ' + num + ' ';
  });
  title = title.trim();
  title = title.charAt(0).toUpperCase() + title.slice(1);
  return title;
}

function setTabs(notes, curNote) {
  if (notes.length < 1) {
    notes.push('note1');
  }

  $('.nav').empty();

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];
    addTab(note);
  }

  $('.nav').append()

  $('.nav').children('#' + curNote).first().addClass('active');
}

function notepadInit() {
  $('#summernote').summernote({
    height: ($(document).height() - 170),
    width: "100%",
    focus: true,
    airMode: false,
    onChange: function(contents, $editable) {
      store(contents);
    }
  });

  curNote = localStorage.getItem('curNote');

  if (curNote == null) {
    curNote = 'note1';
  }

  var notes = findAllNotes();
  setTabs(notes, curNote);
  addControlTabs();
  attachClickHandlers();

  retrieve();


  $(window).keydown(function (e){
    if ((e.metaKey || e.ctrlKey) && e.keyCode == 83) { /*ctrl+s or command+s*/
      save(curNote);
      e.preventDefault();
      return false;
    }
  });

  $(window).unload(function() {
    save(curNote);
  });
}