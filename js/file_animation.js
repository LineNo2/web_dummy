function setEventListener(){
  var div = document.getElementsByClassName('fileBody');
  for(var i = 0 ; i < div.length ; ++i){
	var cur = div[i];
	cur.addEventListener('transitionend', (ev) => {
  });
  }
}

function openIdx(idx){
  var fileBody = document.getElementsByClassName('fileBody')
  for(var i = 0 ; i < fileBody.length ; ++i){
	fileBody[i].classList.remove('fileBodyChecked');
  }
  var cur = fileBody[idx];
  cur.classList.add('fileBodyChecked');
}
