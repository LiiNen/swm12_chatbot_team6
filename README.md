<h1 align="center">멘토링 신청 도와줘!</h1>
<h4 align="center">SW마에스트로 연수 과정 도우미, 멘토링 헬퍼</h4>
<p align="center"><img src="/service_img/logo_made.png"/></p>

<p align="center">
  <a href="https://www.notion.so/1fff39fc14a14fdf932592ab28f8858d"> 업무 공유 notion 바로가기 </a>
</p>

<br><br>
## 프로젝트 개요
<p>본 대화 내용은 실화를 바탕으로 재구성되었습니다.</p>
<p align="center"><img src="/readme_img/project_intro.png"></p>

<br><br>
## 프로젝트 목적
'멘토링 헬퍼'는 SW마에스트로 연수 과정에서 느꼈던 '멘토링 신청'의 불편함을 해소하기 위해 개발되었습니다.<br>
또한 전체 조회와 별개로 알림에는 구독형 서비스를 채택하여 원하는 알림만 받을 수 있도록 구성하였습니다.

 - 워크스페이스 구성원이라면 누구나 **본인이 원할 때** 멘토링 목록을 확인할 수 있다.
 - 멘토링을 신청했다면, 제목/날짜를 바탕으로 **구글 캘린더**에 **자동으로** 입력할 수 있다.
 - 지금은 멘토링 게시판에서 보이지 않는, **삭제된 게시글**을 확인할 수 있다.
 - 선택적으로 알림을 받을 수 있는 **구독형 서비스**로, 특정 키워드의 게시글은 **알림**을 받을 수 있다.
 - 구독형 서비스는 **언제나 취소가 가능**하도록 한다.

<br><br>
## ✔️ ChatBot Scenario
<p align="center"><img src="/readme_img/chatbot_scenario.png"></p>

<br><br>
## ✔️ 멘토링 헬퍼 Views
<table width="1000">
<tbody>
  <tr>
    <td width=220 height=10 align="center">멘토링 헬퍼</td>
    <td width=220 align="center">최신 멘토링 리스트</td>
    <td width=220 align="center">구글 캘린더 연동</td>
    <td width=220 align="center">취소된 멘토링 리스트</td>
  </tr>
<tr>
<td width=220 align="center"><a href="https://raw.githubusercontent.com/LiiNen/swm12_chatbot_team6/main/readme_img/storyboard_img/0_main.png"><img src="/readme_img/storyboard_img/0_main.png"/></a></td>
<td width=220 align="center"><a href="https://raw.githubusercontent.com/LiiNen/swm12_chatbot_team6/main/readme_img/storyboard_img/1_mentoringList_blur.png"><img src="/readme_img/storyboard_img/1_mentoringList_blur.png" width="70%"></a></td>
<td width=220 align="center"><a href="https://raw.githubusercontent.com/LiiNen/swm12_chatbot_team6/main/readme_img/storyboard_img/1-1_googleCalender.png"><img src="/readme_img/storyboard_img/1-1_googleCalender.png"/></a></td>
<td width=220 align="center"><a href="https://raw.githubusercontent.com/LiiNen/swm12_chatbot_team6/main/readme_img/storyboard_img/2_canceledList.png"><img src="/readme_img/storyboard_img/2_canceledList.png"/></a></td>
</tr>
  <tr>
    <td width=220 height=10 align="center">알림신청 키워드 등록</td>
    <td width=220 align="center">키워드 알림 도착</td>
    <td width=220 align="center">키워드 등록 완료</td>
    <td width=220 align="center">키워드 등록 취소</td>
  </tr>
<tr>
  <td width=220 align="center"><a href="https://raw.githubusercontent.com/LiiNen/swm12_chatbot_team6/main/readme_img/storyboard_img/3_keywordModal.png"><img src="/readme_img/storyboard_img/3_keywordModal.png" width="85%"></a></td>
  <td width=220 align="center"><a href="https://raw.githubusercontent.com/LiiNen/swm12_chatbot_team6/main/readme_img/storyboard_img/4_subcribe_blur.png"><img src="/readme_img/storyboard_img/4_subscribe_blur.png"/></a></td>
  <td width=220 align="center"><a href="https://raw.githubusercontent.com/LiiNen/swm12_chatbot_team6/main/readme_img/storyboard_img/3-1_keywordAccept.png"><img src="/readme_img/storyboard_img/3-1_keywordAccept.png"/></a></td>
  <td width=220 align="center"><a href="https://raw.githubusercontent.com/LiiNen/swm12_chatbot_team6/main/readme_img/storyboard_img/3-2_keywordDecline.png"><img src="/readme_img/storyboard_img/3-2_keywordDecline.png"/></a></td>
</tr>
</tbody>
</table>

<br><br>
## ✔️ Architecture
<p align="center"><img src="/readme_img/Architecture.png"></p>

<br><br>
## ✔️ Tech Stack
<p><img src="/readme_img/TechStack.png"></p>

<br><br>
## ✔️ DB Schema
<p align="center"><img src="/readme_img/Schema.png"></p>

<br><br>
## 팀 정보 (Team Information)
<table width="788">
<thead>
<tr>
<th width="150" align="center">성명</th>
<th width="500" align="center">담당</th>
<th width="120" align="center">깃허브</th>
<th width="200" align="center">이메일</th>
</tr> 
</thead>
<tbody>
  <tr>
    <td width="100" align="center">김정훈</td>
    <td width="300" align="left">　Block Kit Builder(멘토링 조회), UI/UX, 문서화</td>
    <td width="100" align="left">
      <a href="https://github.com/LiiNen"><img src="http://img.shields.io/badge/LiiNen-655ced?style=social&logo=github"/></a>
    </td>
    <td width="175" align="left">
      <a href="mailto:kjeonghoon065@gmail.com"><img src="https://img.shields.io/static/v1?label=&message=kjeonghoon065@gmail.com&color=green&style=flat-square&logo=gmail"></a>
    </td>
  </tr>
  <tr>
    <td width="100" align="center">박찬규</td>
    <td width="300" align="left">　google API, google Calender 연동, 문서화</td>
    <td width="100" align="left">
      <a href="https://github.com/changu100"><img src="http://img.shields.io/badge/changu100-655ced?style=social&logo=github"/></a>
    </td>
    <td width="175" align="left">
      <a href="mailto:blue_rose17@naver.com"><img src="https://img.shields.io/static/v1?label=&message=blue_rose17@naver.com&color=green&style=flat-square&logo=gmail"></a>
    </td>
  </tr>
  <tr>
    <td width="100" align="center">오창환</td>
    <td width="300" align="left">　crawler 개발, crawler server 운용</td>
    <td width="100" align="left">
      <a href="https://github.com/hwan27"><img src="http://img.shields.io/badge/hwan27-655ced?style=social&logo=github"/></a>
    </td>
    <td width="175" align="left">
      <a href="mailto:meadea27@gmail.com"><img src="https://img.shields.io/static/v1?label=&message=meadea27@gmail.com&color=green&style=flat-square&logo=gmail"></a>
    </td>
  </tr>
  <tr>
    <td width="100" align="center">이든솔</td>
    <td width="300" align="left">　DB설계, back-end server 운용, 쿼리작성</td>
    <td width="100" align="left">
      <a href="https://github.com/Party4Bread"><img src="http://img.shields.io/badge/Party4Bread-655ced?style=social&logo=github"/></a>
    </td>
    <td width="175" align="left">
      <a href="mailto:party4bread@gmail.com"><img src="https://img.shields.io/static/v1?label=&message=party4bread@gmail.com&color=green&style=flat-square&logo=gmail"></a>
    </td>
  </tr>
  <tr>
    <td width="100" align="center">이병곤</td>
    <td width="300" align="left">　블록킷</td>
    <td width="100" align="left">
      <a href="https://github.com/binkoni"><img src="http://img.shields.io/badge/binkoni-655ced?style=social&logo=github"/></a>
    </td>
    <td width="175" align="left">
      <a href="mailto:gonny952@gmail.com"><img src="https://img.shields.io/static/v1?label=&message=gonny952@gmail.com&color=green&style=flat-square&logo=gmail"></a>
    </td>
  </tr>
  <tr>
    <td width="100" align="center">임연수</td>
    <td width="300" align="left">　Block Kit Builder(구독 신청), 백엔드</td>
    <td width="100" align="left">
      <a href="https://github.com/limyeonsoo"><img src="http://img.shields.io/badge/limyeonsoo-655ced?style=social&logo=github"/></a>
    </td>
    <td width="175" align="left">
      <a href="mailto:yslim6168@naver.com"><img src="https://img.shields.io/static/v1?label=&message=yslim6168@naver.com&color=green&style=flat-square&logo=gmail"></a>
    </td>
  </tr>
</tbody>
</table>
