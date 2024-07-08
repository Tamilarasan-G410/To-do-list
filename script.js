const inputBox = document.querySelector("#inputtask");
const inputButton = document.querySelector(".button");
const showtasks = document.querySelector(".showtasks");

inputButton.addEventListener("click", addTask);

function createshowtasks1() {
    const showtasks1 = document.createElement("div");
    showtasks1.classList.add("showtasks1");
    showtasks.append(showtasks1);
    return showtasks1;
}

function createTaskName(showtasks1) {
    const taskname = document.createElement("p");
    taskname.classList.add("taskname");
    taskname.innerHTML = inputBox.value;
    showtasks1.append(taskname);
}

function createButton(buttonClass, imgSource, imgClass) {
    const button = document.createElement("button");
    button.classList.add(buttonClass);
    
    const img = document.createElement("img");
    img.src = imgSource;
    img.classList.add(imgClass);
    
    button.append(img);
    return button;
}

function createTaskButtons(showtasks1) {
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");
    showtasks1.append(buttons);

    const editButton = createButton("editbtn", "../images/edit.png", "editbtni");
    editButton.addEventListener("click", function() { editTask(showtasks1); });
    buttons.append(editButton);

    const checkButton = createButton("checkbtn", "../images/checked.png", "checkbtni");
    checkButton.addEventListener("click", function() { completeTask(showtasks1); });
    
    buttons.append(checkButton);
    
    const deleteButton = createButton("deletebtn", "../images/delete.png", "deletebtni");
    deleteButton.addEventListener("click", function() { deleteTask(showtasks1); });
    buttons.append(deleteButton);
}

function addTask() {
    if (inputBox.value === "") {
        alert("Enter a value");
    } else {
        const showtasks1 = createshowtasks1();
        createTaskName(showtasks1);
        createTaskButtons(showtasks1);
        inputBox.value = "";
    }
}
let state = 0;
function completeTask(showtasks1) {
    if (state == 0) {
        showtasks1.querySelector(".taskname").style.textDecoration= "line-through";
        showtasks1.querySelector(".taskname").style.backgroundColor= "#D0D0D0";
        state = 1;
      } else {
        showtasks1.querySelector(".taskname").style.textDecoration = "none";
        showtasks1.querySelector(".taskname").style.backgroundColor = "aliceblue";
        state = 0;
      }
      console.log(state)
}

function deleteTask(showtasks1) {
    showtasks1.remove();
}



