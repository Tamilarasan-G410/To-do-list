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
    const taskname = document.createElement("input");
    taskname.classList.add("taskname");
    taskname.value = taskName;
    taskname.readOnly=true;
    if (showtasks1.state === 1) {
        taskname.style.backgroundColor = "#D0D0D0";
    }
    showtasks1.append(taskname);
    
}
//function to create the buttons
function createButton(buttonClass, imgSource, imgClass,title) {
    const button = document.createElement("button");
    button.classList.add(buttonClass);
    button.title=title;
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

    const editButton = createButton("editbtn", "../images/edit.png", "editbtni","Edit the task");
    editButton.addEventListener("click", ()=> { editTask(showtasks1); });
    buttons.append(editButton);

    const checkButton = createButton("checkbtn", "../images/checked.png", "checkbtni","Complete the task");
    checkButton.addEventListener("click", ()=> { completeTask(showtasks1); });
    buttons.append(checkButton);
    
    const deleteButton = createButton("deletebtn", "../images/bin.png", "deletebtni","Delete the task");
    deleteButton.addEventListener("click", ()=> { deleteTask(showtasks1); });
    buttons.append(deleteButton);
}
// function to validate the input in the inputbox and call the above functions
function addTask(e) {
    e.preventDefault();
    const taskValue = inputBox.value.trim();
    if (taskValue === "") {
        errormessage.innerHTML = "Task cannot be empty.";
    } else if (inputBox.value.charAt(0) === " ") {
        errormessage.innerHTML = "Cannot start with a space.";
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
let currentlyEditedTask = null;
function editTask(showtasks1) {
    const taskname = showtasks1.querySelector(".taskname");
    const cb = showtasks1.querySelector(".checkbtn")
    function saveIfValid() {
        if (taskname.value.trim() === '') {
            taskname.classList.add("error");
            taskname.placeholder = 'Task cannot be empty!';
            taskname.value = ''; 
            return false;
        }
        return true;
    }
    if (taskname.readOnly) {
        if (currentlyEditedTask && currentlyEditedTask !== showtasks1) {
            return;
        }
        taskname.readOnly = false;
        taskname.focus();
        taskname.style.outline = '2px solid #413f64';
        taskname.classList.remove("error");
        cb.disabled=true;
        inputBox.disabled=true;
        inputButton.disabled=true;
        currentlyEditedTask = showtasks1;
    } else {
        if (saveIfValid()) {
            taskname.readOnly = true;
            taskname.blur();
            taskname.style.outline = 'none';
            cb.disabled=false;
            inputBox.disabled=false;
            inputButton.disabled=false;
            saveTasksToLocalStorage();
            currentlyEditedTask = null; 
        }
    }
    taskname.addEventListener("focus", () => {
        taskname.classList.remove("error");
        taskname.placeholder = '';
    });
}
// function which facilitates completing the task
function completeTask(showtasks1) {
const eb = showtasks1.querySelector(".editbtn");   
    if (showtasks1.state == 0) {
        showtasks1.querySelector(".taskname").style.backgroundColor= "#D0D0D0";
        showtasks1.setAttribute("data-status", "completed")
        showtasks1.state = 1;
        eb.disabled=true;
    } else {
        showtasks1.querySelector(".taskname").style.backgroundColor = "aliceblue";
        showtasks1.setAttribute("data-status", "assigned")
        showtasks1.state = 0;
        eb.disabled=false;
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
    taskContainers.forEach(task => {
        const status = task.getAttribute("data-status");
        if (status === "completed") {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    });
    checkForEmptyStates("completed");
}
//function to show tasks in assigned section
function assignedTasks() {
    const taskContainers = document.querySelectorAll(".showtasks1");
    taskContainers.forEach(task => {
        const status = task.getAttribute("data-status");
        if (status === "assigned") {
            task.style.display = "flex";
        }  else  {
            task.style.display = "none";
        }
    });
    checkForEmptyStates("assigned");
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
        const taskName = task.querySelector(".taskname").value;
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
