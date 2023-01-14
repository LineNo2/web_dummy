# ⊛⊛⊛ 계산기

## 설명

 군 입대할때 아무런 준비도 없이 들어갔던 필자는, X사단 신교대에서 보병으로 배치받았다. 하지만 이 보병은 무언가 달랐다. 바로 팔 하나가 빠진다는 전설의 81mm ⊛⊛⊛병으로 배치된 것이다. 거의 1년이 가까운 ⊛⊛⊛병을 하니, ⊛⊛⊛ 사격에 필수적인 계산병 자리가 비게 되었다. 그 기회를 놓치지 않고 계산병을 하게되었고, 그 결과 만들게 된 서비스가 바로 이 '⊛⊛⊛ 계산기' 이다.  
 아마 인터넷에 검색해 보면 ⊛⊛⊛ 계산식을 공학용 계산기 버전으로 버젓이 10년 가까이 올려놓은 사람도 있으므로, 이를 github에 public으로 공개하였다. 다만, 아무나 검색해서 볼수 없게 하기 위해 repo 이름을 `web_dummy`로 하였고, 나름 readme에서도 '⊛⊛⊛'로 표기했다. 생각해보니 부대 사람들에게도 이 서비스의 링크를 남기고 왔으므로, 딱히 상관은 없겠다 싶어 이번에 readme를 작성하려고 한다.

 ## 사용 기술

- WEB(vanilla js)

## 사용법

### /
![main](https://user-images.githubusercontent.com/57629885/212477246-697d0ef3-91fd-4b37-a81f-51d196dec6f4.gif)
- 사격 방식을 정할 수 있다.
  - 단일 사격
  - 여러⊛ 사격

### /set_mortar
![set-mortar](https://user-images.githubusercontent.com/57629885/212477236-4f8f2f20-b94d-4c3b-ad05-c228d1c50adb.gif)
- ⊛의 좌표를 입력할 수 있다.
  - 모든 ⊛의 좌표를 절대 좌표로 입력받기
  - 기준⊛의 좌표만 받고, ⊛간 거리를 통해 나머지 좌표를 추출하기
    - 이 방법으로 입력을 받으면, 기준⊛의 좌표만 받고 나머지는 계산 과정에서 따로 입력한다.

### /cal_fd
![cal-fd-select](https://user-images.githubusercontent.com/57629885/212477243-a4e08731-d2bc-45f8-bcd5-984110a5dfeb.gif)
- 계산 방식을 고를 수 있다. 각 계산법 별로 요구되는 제원이 다르다.
  - 방안좌표법
  - 극표정법
  - 기지점 전이법
![cal-fd-shift](https://user-images.githubusercontent.com/57629885/212477244-f83724b9-4554-446d-8ad9-ac73f0a1a50a.gif)  
- 계산 버튼을 누르면, 수정사격을 할 수 있는 창이 나온다.
![cal-fd-popdown](https://user-images.githubusercontent.com/57629885/212477248-c72192f4-43f3-46d1-92ba-ff4cc545caec.gif)
- 위에는 스크롤 다운 버튼이 생기고, 누르면 각 풀이 별 해설을 연결해 주는 페이지가 나온다.
![cal-fd-multi](https://user-images.githubusercontent.com/57629885/212477240-bc4edeb8-eea7-4f4f-adea-625de4e24bd7.gif)
- 최초 사격이 명중했다면, 명중 버튼을 누르고 나머지 ⊛들도 추가해준다.
### /solution
![solution](https://user-images.githubusercontent.com/57629885/212477239-90ff5075-5d55-431d-b268-1e0610858acd.gif)
- 각 계산법에 대해 풀이를 ⊛17 계산판에 보여준다.
- canvas를 통해 그렸으며, 가장 많은 노력을 쏟아부었다.

