# [What to do now? (지금 뭐하지?)](https://github.com/pokycookie/what-to-do-now/releases/download/0.1.0/WTDN-0.1.0.exe)

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=Electron&logoColor=white)
![SVG](https://img.shields.io/badge/SVG-FFB13B?style=for-the-badge&logo=SVG&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-ED702D?style=for-the-badge&logoColor=white)
![Emotion](https://img.shields.io/badge/Emotion-C43BAD?style=for-the-badge&logoColor=white)

## 소개

지금 뭐하지 애플리케이션은 할 일은 많은데 지금 당장 뭘하는게 좋을지 모르겠고, 생각하기도 싫은 당신을 위해 당장 할 일의 우선순위를 정해줍니다.

사용자가 일정을 관리하는 방법은 아주 단순합니다. 일정 추가 버튼을 눌러 해야할 일정을 추가하기만 하면, 프로그램이 알아서 일정의 순서를 조절해 줍니다.

여기서 사용하는 일정은 기본일정과 고정일정 두 가지의 종류가 있습니다.

- 기본일정: 마감시간안에 끝내기만 하면 되는 일정 ex) 프로젝트 마감, 학교 과제 등
- 고정일정: 시작과 끝 시간이 정해져 있는 일정 ex) 여행 일정, 결혼식 등

사용자가 일정의 종류만 잘 지켜서 생성하기만 하면, 그 다음은 프로그램이 알아서 일정의 순서를 조절해줍니다. 이때 고정일정은 항상 정해진 시간대에 일정이 들어가고, 기본일정은 마감일을 넘지 않도록 사이사이에 배치됩니다.

## 사용법

### 일정 등록

일정을 등록하기 위해서는 메인 화면의 우측 하단의 추가 버튼을 사용하면 됩니다. 추가할 일정의 이름을 정하고, 달력과 시간버튼을 이용해 마감시간을 정합니다. 기본일정의 경우에는 마감시간 외에도 소요시간을 추가로 정해야합니다. 소요시간은 해당 일정을 끝내는데 걸리는 시간을 예상해서 입력합니다.

![task-add](https://github.com/pokycookie/maple-meister/assets/58474094/7ad4d822-c6b6-43ce-85fb-f21e18609381)

만약 고정일정을 생성하고 싶다면, 상단의 고정일정 토글 버튼을 눌러 생성할 일정을 고정일정 타입으로 변경할 수 있습니다. 고정일정을 생성할 때는 마감시간과 소요시간을 입력하는 기본일정과 달리, 일정의 시작시간과 종료시간을 입력하게 됩니다.

![fixedTask-add](https://github.com/pokycookie/maple-meister/assets/58474094/c8ef2174-7eb5-4311-99c6-bcd3c955cf49)

또한 고정일정으로 일정을 추가하는 경우에는 달력에서 연속되는 날짜를 동시에 선택할 수 있습니다. 3박 4일 여행과 같이 여러 날짜에 걸쳐서 고정일정을 생성해야 하는 경우에 유용하게 사용할 수 있습니다.

![fixedTask-add2](https://github.com/pokycookie/maple-meister/assets/58474094/aba2ca5f-adf6-4b81-8c5e-3e41c5b41566)

### 일정 확인

일정을 확인하는 방법은 두 가지가 있습니다.

먼저 기본적으로 확인할 수 있는 일간 뷰어입니다. 일간 뷰어에서는 그날 하루의 일정을 한눈에 보여줍니다. 원형으로 표현된 그래프는 하루 24시간을 나타냅니다. 여기서 푸른 영역은 기본일정을, 붉은 영역은 고정일정을 나타냅니다. 마지막으로 얇은 주황색 막대는 현재 시간을 보여줍니다.

각 영역에 마우스를 올리면 어떠한 일정인지, 몇 시간 후 마감인지를 중앙의 인디케이터에서 확인할 수 있습니다. 마우스를 올리지 않은 상태에서는 가장 급한 기본일정을 보여주며, 마우스 휠을 이용하거나, 위쪽의 원형 버튼을 눌러 이후의 일정도 확인할 수 있습니다. 이때 확인할 수 있는 일정은 기본일정에만 한정되며, 오늘 이후의 일정도 전부 확인할 수 있습니다.

![viewer-daily](https://github.com/pokycookie/maple-meister/assets/58474094/9123e386-c3dc-4c96-a938-978060c13c95)

일정을 확인할 수 있는 또 다른 방법은 월간 뷰어입니다. 좌측의 메뉴바에서 시계모양 버튼을 눌러 달력모양으로 바꾸면 월간 뷰어로 전환할 수 있습니다. 한번 더 누르면 일간 뷰어로 전환됩니다.

월간 뷰어에서는 달력의 형태로 전반적인 일정을 확인할 수 있습니다. 일간 뷰어와 마찬가지로 푸른색 영역은 기본일정으로, 붉은색 영역은 고정일정을 나타냅니다. 막대의 위치와 길이는 모두 시작시간, 종료시간, 소요시간에 영향을 받습니다. 각 영역에 마우스를 올리면 어떠한 일정인지 간략히 확인할 수 있습니다.

![viewer-monthly](https://github.com/pokycookie/maple-meister/assets/58474094/097d3db7-19bd-4e4b-a09a-9bdeb8990fb8)

### 일정 체크

미리 작성해둔 일정을 달성했는지 실패했는지 체크하기 위해서는 일간 뷰어를 사용하면 됩니다. 일간 뷰어의 중앙의 인디케이터에 마우스를 올려보면 좌우로 버튼을 확인할 수 있습니다. 좌측의 버튼은 완료를, 우측의 버튼을 실패를 나타냅니다. 어떠한 버튼을 누르든 그 즉시 일정은 현재 관리하는 일정목록에서 사라지게 됩니다.

만약 기본일정의 마감시간이 지났음에도 완료 또는 실패를 누르지 않았다면, 마감시간이 지나는 즉시 자동으로 실패처리가 되어 일정목록에서 사라집니다.

![task-done](https://github.com/pokycookie/maple-meister/assets/58474094/31e64815-0b89-49d8-99ce-31c07759b051)

### 데이터베이스

사실 일간 뷰어와 월간 뷰어 말고도 일정을 확인할 수 있는 방법이 하나 더 존재합니다. 바로 두 번째 메뉴인 데이터베이스 메뉴를 이용하는 것입니다.

데이터베이스 메뉴에서는 현재 작성된 모든 기본일정, 고정일정과 추가로 지난일정까지 표의 형태로 확인할 수 있습니다. 지난일정은 성공 또는 실패 처리되어 현재의 일정 목록에서 사라진 일정들이 모이는 곳으로, 계획한 일정을 얼마만큼 성공했는지 확인할 때 사용할 수 있습니다.

![database-check](https://github.com/pokycookie/maple-meister/assets/58474094/29d609a7-570f-466b-98e8-ac188a5a2ca6)

표의 형태로 있는 일정들을 클릭하면 일정을 수정 또는 삭제 할 수 있습니다. 일정의 이름을 변경하거나 시작시간, 종료시간, 소요시간 등을 자유롭게 수정할 수 있습니다. 단, 기본일정을 고정일정으로 또는 고정일정을 기본일정으로 변경하지는 못합니다.

![database-edit](https://github.com/pokycookie/maple-meister/assets/58474094/bb878bbb-f7c0-4386-8742-23ae20f31507)

지난일정 탭에서 지난 일정을 클릭하면 일정을 복구 또는 삭제 할 수 있습니다. 일정을 복구하게 되면 해당 일정은 성공과 실패의 여부가 사라지며, 즉시 관리중인 일정목록으로 들어가게 됩니다. 이때 이미 마감시간이 지나서 지난일정이 된 경우에는 복구하는 즉시 다시 지난일정이 되게 되므로, 반드시 마감시간을 현재시간 이후로 수정하여 복구해야 합니다.

![database-restore](https://github.com/pokycookie/maple-meister/assets/58474094/63d6689a-7531-4c13-8201-f26f1d667329)

## 기술 스택

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=Electron&logoColor=white)
![SVG](https://img.shields.io/badge/SVG-FFB13B?style=for-the-badge&logo=SVG&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-ED702D?style=for-the-badge&logoColor=white)
![Emotion](https://img.shields.io/badge/Emotion-C43BAD?style=for-the-badge&logoColor=white)

## 프로그램 다운로드

- [ver 0.1.0](https://github.com/pokycookie/what-to-do-now/releases/download/0.1.0/WTDN-0.1.0.exe)
