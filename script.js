//query-selectors
const inputBox = document.querySelector("#inputtask");
const inputButton = document.querySelector(".button");
const showtasks = document.querySelector(".showtasks");
const errormessage = document.querySelector(".error-message");
const noTasksMessage = document.querySelector(".no-tasks-message");
const noCompletedTasksMessage = document.querySelector(".no-completed-tasks-message");
const noAssignedTasksMessage = document.querySelector(".no-assigned-tasks-message");
const deleteAllButton = document.querySelector(".delete-all");
const all = document.querySelector("#all");
const completed = document.querySelector("#completed");
const assigned = document.querySelector("#assigned");
const form = document.querySelector("#form");

//event-listeners
deleteAllButton.addEventListener("click", deleteAllTasks);
form.addEventListener("submit", addTask);
inputBox.addEventListener("click", () => {
    errormessage.innerHTML = "";
});
all.addEventListener("change", () => {
    currentFilter = "all";
    allTasks();
});
completed.addEventListener("change", () => {
    currentFilter = "completed";
    completedTasks();
});
assigned.addEventListener("change", () => {
    currentFilter = "assigned";
    assignedTasks();
});

let currentFilter = "all";
checkForEmptyStates(currentFilter);
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

//function to create the tasks
function createshowtasks1(taskName, taskStatus) {
    const showtasks1 = document.createElement("div");
    showtasks1.classList.add("showtasks1");
    showtasks.append(showtasks1);
    showtasks1.state = taskStatus === "completed" ? 1 : 0;
    showtasks1.setAttribute("data-status", taskStatus);
    return showtasks1;
}

//function to get the taskname from the input form
function createTaskName(showtasks1, taskName) {
    const taskname = document.createElement("p");
    taskname.classList.add("taskname");
    taskname.innerHTML = taskName;
    showtasks1.append(taskname);
}
//function to create the buttons
function createButton(buttonClass, imgSource, imgClass) {
    const button = document.createElement("button");
    button.classList.add(buttonClass);
    
    const img = document.createElement("img");
    img.src = imgSource;
    img.classList.add(imgClass);
    
    button.append(img);
    return button;
}
//function to create the edit,check and delete button
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
// function to validate the input in the inputbox and call the above functions
function addTask(e) {
    e.preventDefault();
    const taskValue = inputBox.value.trim();
    if (taskValue === "") {
        errormessage.innerHTML = "Task cannot be empty.";
    } else if (inputBox.value.charAt(0) === " ") {
        errormessage.innerHTML = "Task cannot start with a space.";
    } else {
        const showtasks1 = createshowtasks1(taskValue, "assigned");
        createTaskName(showtasks1, taskValue);
        createTaskButtons(showtasks1);
        inputBox.value = "";
        saveTasksToLocalStorage();
        currentFilter = "all";
        document.querySelector("#all").checked = true;
        allTasks();
        checkForEmptyStates(currentFilter);
    }
}
// function which facilitates completing the task
function completeTask(showtasks1) {
    if (showtasks1.state == 0) {
        showtasks1.querySelector(".taskname").style.textDecoration= "line-through";
        showtasks1.querySelector(".taskname").style.backgroundColor= "#D0D0D0";
        showtasks1.setAttribute("data-status", "completed")
        showtasks1.state = 1;
    } else {
        showtasks1.querySelector(".taskname").style.textDecoration = "none";
        showtasks1.querySelector(".taskname").style.backgroundColor = "aliceblue";
        showtasks1.setAttribute("data-status", "assigned")
        showtasks1.state = 0;
    }
    saveTasksToLocalStorage();
    if (currentFilter === "all") {
        allTasks();
    } else if (currentFilter === "completed") {
        completedTasks();
    } else if (currentFilter === "assigned") {
        assignedTasks();
    }
    checkForEmptyStates(currentFilter);
}
//function which facilitates  deleting the task
function deleteTask(showtasks1) {
    showtasks1.remove();
    saveTasksToLocalStorage();
    if (currentFilter === "all") {
        allTasks();
    } else if (currentFilter === "completed") {
        completedTasks();
    } else if (currentFilter === "assigned") {
        assignedTasks();
    }
}
//function which facilitates deleting all the tasks
function deleteAllTasks() {
    const taskContainers = document.querySelectorAll(".showtasks1");
    taskContainers.forEach(task => task.remove());
    saveTasksToLocalStorage();
    checkForEmptyStates(currentFilter);
}
//function to show tasks in all section
function allTasks() {
    const taskContainers = document.querySelectorAll(".showtasks1");
    taskContainers.forEach(task => {
        task.style.display = "flex";
    });
    checkForEmptyStates("all");
}
//function to show tasks in completed section 
function completedTasks() {
    const taskContainers = document.querySelectorAll(".showtasks1");
    let hasCompletedTasks = false;
    taskContainers.forEach(task => {
        const status = task.getAttribute("data-status");
        if (status === "completed") {
            task.style.display = "flex";
            hasCompletedTasks = true;
        } else {
            task.style.display = "none";
        }
    });
    checkForEmptyStates("completed");
}
//function to show tasks in assigned section
function assignedTasks() {
    const taskContainers = document.querySelectorAll(".showtasks1");
    let hasAssignedTasks = false;
    taskContainers.forEach(task => {
        const status = task.getAttribute("data-status");
        if (status === "assigned") {
            task.style.display = "flex";
            hasAssignedTasks = true;
        }  else  {
            task.style.display = "none";
        }
    });
    checkForEmptyStates("assigned");
}
//function which facilitates editing the task
function editTask(showtasks1) {
    const taskname = showtasks1.querySelector(".taskname");
    if (taskname.isContentEditable) {
        taskname.contentEditable = "false";
        taskname.blur();
        saveTasksToLocalStorage();
    } else {
        taskname.contentEditable = "true";
        taskname.focus(); 
    }
}
//function to show "no task" messages
function checkForEmptyStates(filter) {
    const taskContainers = document.querySelectorAll(".showtasks1");
    let hasTasks = false;
    let hasFilteredTasks=false;

    taskContainers.forEach(task => {
        const status = task.getAttribute("data-status");
        if (status === "assigned" || status === "completed") {
            hasTasks = true;
            if (filter === "all" || status === filter) {
                hasFilteredTasks = true;
            }
        }
    });

    noTasksMessage.style.display = "none";
    noCompletedTasksMessage.style.display = "none";
    noAssignedTasksMessage.style.display = "none";

    if (!hasTasks) {
        noTasksMessage.style.display = "block";
    } else if (filter === "completed" && !hasFilteredTasks) {
        noCompletedTasksMessage.style.display = "block";
    } else if (filter === "assigned" && !hasFilteredTasks) {
        noAssignedTasksMessage.style.display = "block";
    }
}
// function to store data in local storage
function saveTasksToLocalStorage() {
    const tasks = [];
    const taskContainers = document.querySelectorAll(".showtasks1");
    taskContainers.forEach(task => {
        const taskName = task.querySelector(".taskname").innerText;
        const taskStatus = task.getAttribute("data-status");
        tasks.push({ name: taskName, status: taskStatus });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
//function to load the data from the local storage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const showtasks1 = createshowtasks1(task.name, task.status);
        createTaskName(showtasks1, task.name);
        createTaskButtons(showtasks1);
    });
    checkForEmptyStates(currentFilter);
}
