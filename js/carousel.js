function insertMortarInformationCoordinate(Point){
  var str = '<div class="posInputContainer">';
  for(var i = 0 ; i < 3; ++i){
	str +='<h3>' + infos_point_id[i] +  '</h3>';
  }
  for(var i = 0 ; i < 3; ++i){
	str +='<h3>' + Point[infos_point_id[i].toLowerCase()] +  '</h3>';
  }
  return str + '</div>';
}

function loadMPosInsertWindow(number){
  var str = '<div class="cardTitle">'
  str += '<h2 class="name">' + (Mortar_arr[number].isStandard == true ? '기준포' : '날개포') + '</h2><br>';
  str += '<h2 class="name">' + Mortar_arr[number].name + '포' + '</h2><br>';
  str += '</div>'
  //str += `<h3 id="card-${number}-MTAZ">`+ ' MTAZ : '  + Math.round(Mortar_arr[number].FData.MTAZ) +  '</h3></div>';
  str += '<div class="cardBody">'
  str += '<canvas id="MPos' + number + '" style="margin:auto;width:95%;height:50%;background-color:transparent;"></canvas>'
  str += '<div class="cardBodyElement">';
  str += '<input type="button" value="그리기" onclick="calculateNewMPos('+number+')">';
  str += printAdjustArea(number+'MDistance','','미터');
  str += `<input type="button" value="좌표 확정" onclick="calculateNewMPos(${number},1)">`   
  //str += `<input type="button" value="계산" onclick="calculateCardData(${number})">`
  str += '</div>'
   document.getElementById('card-'+number).innerHTML = str + '</div>';
  /*let list = ['X','Y'];
  for(let i = 0 ; i < 2;  ++i){
	let cur_elem = 'adjust'+list[i];
	document.getElementById(cur_elem+number+'MDistance').oninput = function(){calculateNewMPos(number)};
  }*/
}

function insertMortarInformation(number){
  var str = '<div class="cardTitle">'
  str += '<h2 class="name">' + (Mortar_arr[number].isStandard == true ? '기준포' : '날개포') + '</h2><br>';
  str += '<h2 class="name">' + Mortar_arr[number].name + '포' + '</h2><br>';
  str += `<h3 id="card-${number}-MTAZ">`+ ' MTAZ : '  + Math.round(Mortar_arr[number].FData.MTAZ) +  '</h3></div>';
  str += '<div class="cardBody">';
  str += '<div class="cardBodyElement">';	
  str += '<h2 class="name">방렬편각</h2><br>';
  str += `<h3 id="card-${number}-LayingArgument">` + Mortar_arr[number].FData.LayingArgument +  '</h3>';
  str += '</div>';
  str += '<div class="cardBodyElement">';	
  str += '<h2 class="name">MTRN</h2><br>';
  str += `<h3 id="card-${number}-MTRN">` + Math.round(Mortar_arr[number].FData.MTRN) +  '</h3>';
  str += '</div>';
  str += '<div class="cardBodyElement">';
  str += printAdjustArea(number,'수정값');
  str += '<span style="font-weight:1000">↓</span>';// mediaquery로 pc일땐 ->, 모바일 일때는 현재 상태로 만들기.
  str += printAdjustArea(number+'calculated','편의수정량');
  str += `<input type="button" value="계산" onclick="calculateCardData(${number})">`
  if(number == standard_mortar - 1) str += '<input type="button" value="명중" id="hitButton" onclick="initCarouselFull()">'
  str += '</div>';
  document.getElementById('card-'+number).innerHTML = str +'</div>';
  let list = ['X','Y'];
  for(let i = 0 ; i < 2;  ++i){
	let cur_elem = 'adjust'+list[i];
	document.getElementById(cur_elem+number).oninput = function(){calculateAdjustValue(number)};
	document.getElementById(cur_elem+'Sign'+number).oninput = function(){calculateAdjustValue(number)};
	document.getElementById(cur_elem+number+'calculated').readOnly = true;
	document.getElementById(cur_elem+'Sign'+number+'calculated').disabled = true;
  }
}

function initCarousel(){
  OTAZ = document.getElementById('OTAZ').value;
  document.getElementsByClassName('calBody')[0].innerHTML = '';
  document.getElementsByClassName('calTop')[0].style = 'text-align:center;position:absolute;width:100%';
  var str = '';
  for(var i = 0 ; i < Mortar_arr.length ; ++i){
	str += '<button class="card" id="card-' + i + '"></button>';
  }
  document.getElementsByClassName('carousel')[0].innerHTML = str;
  document.getElementsByClassName('carousel')[0].style.height = '100vh';
  document.getElementById('card-' + (standard_mortar - 1 + num_of_mortars) % num_of_mortars).classList.add('card-mid');
	insertMortarInformation(standard_mortar-1);
}

function initCarouselFull(){
  document.getElementById('card-' + (standard_mortar - 2 + num_of_mortars) % num_of_mortars).classList.add('card-left');
  document.getElementById('card-' + (standard_mortar + num_of_mortars) % num_of_mortars).classList.add('card-right');
  document.getElementById('handler').innerHTML = `  <button class="arrow leftArrow" onclick="moveCarousel(-1)">&lt;</button>
  <button class="arrow rightArrow" onclick="moveCarousel(1)">&gt;</button>`;
  window.addEventListener("wheel", function(e){
	pointerX = e.pageX;
	pointerY = e.pageY;
	card = document.getElementsByClassName('card-mid')[0].getBoundingClientRect();
	if( (card.x < pointerX && pointerX < card.right) &&
	  (card.y < pointerY && pointerY < card.bottom) ) return;
	carouselScroll(e);
	e.preventDefault();
  },{passive : false});
  if(request.getParameter('is_MPos_setted') == 0){
	for(var i = 0 ; i < num_of_mortars ; ++i){
	  if(standard_mortar - 1 == i) continue;
	  loadMPosInsertWindow(i);
	}
  }
  else{
	for(var i = 0  ; i < num_of_mortars ; ++i){
	  insertMortarInformation(i);
	}
  }
  dragCarouselOnMobile(document.getElementsByClassName('card-mid')[0]);
}

function moveCarousel(direction){
  var cards = document.getElementsByClassName('card');
  var middle = document.getElementsByClassName('card-mid')[0].id;
  var totalCards = cards.length;
  middle = parseInt(middle[5]);
  cards[(middle + direction + totalCards)%totalCards].classList.remove('card-' + (direction == 1 ? 'right' : 'left'));
  cards[(middle + direction + totalCards)%totalCards].classList.add('card-mid');
  cards[(middle + direction + totalCards)%totalCards].onclick = '';

  cards[(middle + totalCards)%totalCards].classList.remove('card-mid');
  cards[(middle + totalCards)%totalCards].classList.add('card-' + (direction == 1 ? 'left' : 'right'));

  //cards[(middle + direction*2 + totalCards)%totalCards].classList.remove('card-' + (direction == -1 ? 'right' : 'left'));
  cards[(middle + direction*2 + totalCards)%totalCards].classList.add('card-' + (direction == 1 ? 'right' : 'left'));

  cards[(middle - direction + totalCards)%totalCards].classList.remove('card-' + (direction == -1 ? 'right' : 'left'));
  dragCarouselOnMobile(document.getElementsByClassName('card-mid')[0]);
}


var flag = true;

function carouselScroll(event) {
  var y = event.deltaY;
  if(!flag) return;
  if(y < 0)
	moveCarousel(-1);
  else
	moveCarousel(1);
  flag = false;
  setTimeout( () => {flag = true;}, 300);
}

function dragCarouselOnMobile(box){
  box.addEventListener('touchmove', function(e) {
	if(!flag) return;
    var touchLocation = e.targetTouches[0];

	if(Math.abs(touchLocation.pageX - window.innerWidth/2) > window.innerWidth/2*0.5){
	  moveCarousel(touchLocation.pageX - window.innerWidth/2 > 0 ? -1 : 1);
	  flag = false;
	  setTimeout( () => {flag = true;}, 300);
	}
    //box.style.left = touchLocation.pageX + 'px';
  })
}

function drawMortars(number,MTAZ,x,y){
  var canvas = document.getElementById('MPos'+number);
  var ctx = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //var width = canvas.getBoundingClientRect().width;
  //var height = canvas.getBoundingClientRect().height;
  var font = width/10;
  var coef = Math.max(Math.abs(x),Math.abs(y));
  x = x/coef;
  y = y/coef;
  coef = height / 3;
  ctx.beginPath();
  ctx.font = font + "px arial";
  ctx.textAlign = "center";
  ctx.translate(width/2,height/2);
  ctx.fillStyle = 'white';
  ctx.fillText('M',0,0);
  ctx.fillText('M',x*coef,-y*coef);
  ctx.rotate(MTAZ);
  ctx.strokeStyle = 'red';
  ctx.moveTo(0,0);
  ctx.lineTo(-width*Math.cos(MTAZ),-width*Math.sin(MTAZ));
  ctx.stroke();
  ctx.rotate(-MTAZ);
  ctx.translate(-width/2,-height/2);
}
