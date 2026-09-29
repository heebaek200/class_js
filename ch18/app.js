// app.js

// 공통 요소 선택
const getTodoBtn    = document.getElementById("getTodoBtn");
const postBtn       = document.getElementById("postBtn");
const patchBtn      = document.getElementById("patchBtn");
const putBtn        = document.getElementById("putBtn");
const deleteBtn     = document.getElementById("deleteBtn");
const listBtn       = document.getElementById("listBtn");
const resultDisplay = document.getElementById("resultDisplay");
const todoList      = document.getElementById("todoList");

// API 주소 - "http://localhost:8080/api"
const BASE_URL = "https://jsonplaceholder.typicode.com";

/**
 * 전달받은 데이터를 JSON 문자열로 변환하여 결과창에 출력한다.
 * 새로운 결과가 들어올 때마다 shake 클래스를 다시 적용해
 * 짧은 진동 애니메이션이 매번 실행되도록 처리한다.
 */
function showResult(data) {

    // 결과 데이터 출력
    resultDisplay.textContent = JSON.stringify(data, null, 2);

    // 이전 애니메이션 클래스를 제거한다.
    resultDisplay.classList.remove("shake");

    // 브라우저가 클래스 제거 상태를 한 번 렌더링하도록 강제한다.
    void resultDisplay.offsetWidth;

    // 클래스를 다시 추가해 애니메이션을 처음부터 실행한다.
    resultDisplay.classList.add("shake");
}

/**
 * 전달받은 TODO 배열을 화면의 목록 영역에 카드 형태로 출력한다.
 * 각 항목은 제목, ID, 사용자 ID, 완료 여부를 표시한다.
 * 기존 목록은 먼저 비우고 새 데이터만 다시 렌더링한다.
 */
function showList(data) {

    // 기존 목록 제거
    todoList.innerHTML = "";

    // 데이터가 없을 경우 안내 문구 출력
    if (!data || data.length === 0) {
        const emptyItem = document.createElement("li");

        emptyItem.classList.add("todo-empty");
        emptyItem.textContent = "조회된 할 일이 없습니다.";

        todoList.append(emptyItem);
        return;
    }

    // TODO 데이터를 하나씩 카드 형태로 생성한다.
    data.forEach((todo) => {

        const li = document.createElement("li");
        li.classList.add("todo-item");

        // 완료 여부에 따라 클래스 추가
        if (todo.completed) {
            li.classList.add("completed");
        }

        // 제목 영역
        const title = document.createElement("strong");
        title.classList.add("todo-title");
        title.textContent = todo.title;

        // 메타 정보 영역
        const meta = document.createElement("div");
        meta.classList.add("todo-meta");

        const idBadge = document.createElement("span");
        idBadge.textContent = `ID #${todo.id}`;

        const userBadge = document.createElement("span");
        userBadge.textContent = `USER ${todo.userId}`;

        // 완료 여부 배지
        const statusBadge = document.createElement("span");
        statusBadge.classList.add("todo-status");

        if (todo.completed) {
            statusBadge.textContent = "완료";
            statusBadge.classList.add("done");
        } else {
            statusBadge.textContent = "진행 중";
            statusBadge.classList.add("pending");
        }

        // 요소 조립
        meta.append(idBadge, userBadge, statusBadge);
        li.append(title, meta);
        todoList.append(li);
    });
}

// 1. GET 조회
async function fetchTodo() {
    resultDisplay.textContent = "Loading(GET) .......";

    try {
        // 엔드포인트
        // 1) 요청을 보내고 응답이 도착할 때까지 여기서 잠시 대기
        // fetch 함수에서 기본값은 GET 요청이다.
        const response = await fetch(`${BASE_URL}/todos/1`);

        console.log(response.status);   // 응답코드

        // 2) 응답 본문 (JSON 문자열)을 객체로 바꿀 때까지 기다린다.
        const data = await response.json();
        console.log(data);

        // 3) 화면에 뿌려보자
        showResult(data);
    } catch (error) {
        // 인터넷이 끊기는 등 요청 자체가 실패했을 때
        resultDisplay.textContent = "요청 실패 : " + error.message;
    }
}

// 1. GET 조회 - then catch 사용
function fetchTodo2() {
    resultDisplay.textContent = "Loading(GET) .......";
    
    // fetch 함수는 Promise를 돌려준다.
    fetch(
        `${BASE_URL}/todos/100`,
        {
            method: "GET"
        }
    )
    .then((response) => {
        // 1) 응답이 도착하면 실행된다.
        console.log(response.status);       // 응답 상태 코드
        
        return response.json();
    })
    .then((data) => {
        // 응답 본문에 문자열을 JS Object 파생해서 넘겨받는다.
        console.log(data);
        showResult(data);
    })
    .catch((error) => {
        // 실패
        resultDisplay.textContent = "요청 실패 : " + error.message;
    });

}

getTodoBtn.addEventListener("click", fetchTodo2);

// 2. POST: 생성
async function createTodo() {
    resultDisplay.textContent = "Loading(GET) .......";

    const newTodo = {title: "자바스크립트복습", completed: false, userId: 1};

    try {
        const response = await fetch(`${BASE_URL}/todos`, {
            method : "POST",
            headers: {"Content-Type" : "application/json; charset=UTF-8"},
            body   : JSON.stringify(newTodo)
        });

        // 상태 코드: POST는 201(Created)
        console.log(response.status);

        const data = await response.json();     // JSON 형식의 문자열이 객체로 변환됨.
        showResult(data);
    } catch (error) {
        resultDisplay.textContent = "요청 실패 : " + error.message;
    }
}

postBtn.addEventListener("click", createTodo);

// 과제 3. PATCH
async function patchTodo() {
    resultDisplay.textContent = "Loading(PATCH) .......";

    const id = 1;
    const updateTodo = {completed: true};

    try {
        const response = await fetch(`${BASE_URL}/todos/${id}`, {
            method : "PATCH",
            headers: {"Content-Type" : "application/json; charset=UTF-8"},
            body   : JSON.stringify(updateTodo)
        });

        // 상태 코드
        console.log(response.status);

        const data = await response.json();     // JSON 형식의 문자열이 객체로 변환됨.
        showResult(data);

    } catch (error) {
        resultDisplay.textContent = "요청 실패 : " + error.message;
    }
}

patchBtn.addEventListener("click", patchTodo);

// 과제 4. PUT
async function putTodo() {
    resultDisplay.textContent = "Loading(PUT) .......";

    const id = 1;
    const updateTodo = {title: "새로운 이름으로 변경합니다", userId: 2, completed: true};

    try {
        const response = await fetch(`${BASE_URL}/todos/${id}`, {
            method : "PUT",
            headers: {"Content-Type" : "application/json; charset=UTF-8"},
            body   : JSON.stringify(updateTodo)
        });

        // 상태 코드
        console.log(response.status);

        const data = await response.json();     // JSON 형식의 문자열이 객체로 변환됨.
        showResult(data);

    } catch (error) {
        resultDisplay.textContent = "요청 실패 : " + error.message;
    }
}

putBtn.addEventListener("click", putTodo);

// 과제 5. DELETE
async function deleteTodo() {
    resultDisplay.textContent = "Loading(DELETE) .......";

    const id = 1;

    try {
        const response = await fetch(`${BASE_URL}/todos/${id}`, {
            method : "DELETE"
        });

        // 상태 코드
        console.log(response.status);

        // const data = await response.json();     // JSON 형식의 문자열이 객체로 변환됨.
        // showResult(data);

        resultDisplay.textContent = "삭제되었습니다.";

    } catch (error) {
        resultDisplay.textContent = "요청 실패 : " + error.message;
    }
}

deleteBtn.addEventListener("click", deleteTodo);


// 과제 6. 목록 그리기
async function getTodoList() {
    resultDisplay.textContent = "Loading(GET) .......";

    try {
        const response = await fetch(`${BASE_URL}/todos`);

        console.log(response.status);   // 응답코드

        const data = await response.json();
        console.log(data);

        
        resultDisplay.textContent = "목록을 조회했습니다.";
        showList(data);
    } catch (error) {
        // 인터넷이 끊기는 등 요청 자체가 실패했을 때
        resultDisplay.textContent = "요청 실패 : " + error.message;
    }
}

listBtn.addEventListener("click", getTodoList);

