## React Study 레포지토리입니다.

이 곳에서는 ReactJS 와 관련된 튜토리얼을 진행하면서 프로젝트까지 진행해 나갈 예정입니다.

다음은 진행 과제입니다.

- Task 1: [대화형 틱틱토 게임 만들기](https://ko.reactjs.org/tutorial/tutorial.html)

  - 이는 React 페이지에 있는 기본 자습서에서 시작된 튜토리얼입니다.
  - 기본 자습서에서 제안하는 추가적인 아이디어까지 구현합니다.

- Task 2: [타입스크립트로 리액트 Hooks 사용하기](https://velog.io/@velopert/using-hooks-with-typescript)

  - TypeScript로 React 개발하기를 진행합니다.
  - 사이트에서 배운 내용
    - useState를 사용 할 때에는 useState<string> 과 같이 Generics 를 사용합니다.
    - useState의 Generics 는 상황에 따라 생략 할 수도 있는데, 상태가 null 인 상황이 발생 할 수 있거나, 배열 또는 까다로운 객체를 다루는 경우 Generics 를 명시해야 합니다.
    - useReducer를 사용 할 때에는 액션에 대한 타입스크립트 타입들을 모두 준비해서 문자를 사용하여 결합시켜야합니다.
    - 타입스크립트 환경에서 useReducer 를 쓰면 자동완성이 잘되고 타입체킹도 잘 됩니다.
    - useRef를 사용 할 땐 Generics 로 타입을 정합니다.
    - useRef를 사용하여 DOM에 대한 정보를 담을 땐, 초깃값을 null 로 설정해야 하고 값을 사용하기 위해서 null 체킹도 해주어야 합니다.

- Task 3: [TypeScript 환경에서 리액트 Context API 제대로 활용하기](https://velog.io/@velopert/typescript-context-api)

  - Context API 다루기
  - useReducer 다루기

- Task 4: [Todo 앱 만들기](https://velopert.com/3480)
