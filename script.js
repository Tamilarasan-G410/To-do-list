const inputBox = document.querySelector("#inputtask");
const inputButton = document.querySelector(".button");
inputButton.addEventListener("click", addTask);
const showtasks = document.querySelector(".showtasks");

function createTaskElement() {
    const showtasks1 = document.createElement("div");
    showtasks1.classList.add("showtasks1");
    showtasks.append(showtasks1);
    return showtasks1;
}

function createTaskName(taskElement) {
    const taskname = document.createElement("p");
    taskname.classList.add("taskname");
    taskElement.append(taskname);
    taskname.innerHTML = inputBox.value;
}

function createButton(buttonClass, imgSource, imgClass) {
    const buttons = document.createElement("button");
    buttons.classList.add(buttonClass);
    
    const img = document.createElement("img");
    img.src = imgSource;
    img.classList.add(imgClass);
    
    buttons.append(img);
    return buttons;
}

function createTaskButtons(taskElement) {
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");
    taskElement.append(buttons);

    buttons.append(createButton("editbtn", "../images/edit.png", "editbtni"));
    buttons.append(createButton("checkbtn", "../images/checked.png", "checkbtni"));
    buttons.append(createButton("deletebtn", "../images/delete.png", "deletebtni"));
}

function addTask() {
    if (inputBox.value === "") {
        alert("Enter a value");
    } else {
        const taskElement = createTaskElement();
        createTaskName(taskElement);
        createTaskButtons(taskElement);
        inputBox.value = "";
    }
}

const completeButton=document.querySelector(".checkbtn");
completeButton.addEventListener("click",completeTask);


function completeTask(){
    const tasknamee=document.querySelector(".taskname");
    tasknamee.style = 'text-decoration:line-through;';
}
