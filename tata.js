const inputBox = document.querySelector("#inputtask");
const inputButton = document.querySelector(".button");
const showtasks = document.querySelector(".showtasks");
const noTasksMessage = document.querySelector(".no-tasks-message");
const noCompletedTasksMessage = document.querySelector(".no-completed-tasks-message");
const noAssignedTasksMessage = document.querySelector(".no-assigned-tasks-message");
const deleteAllButton = document.querySelector(".delete-all");
const form = document.querySelector("#form");
const all = document.querySelector("#all");
const completed = document.querySelector("#completed");
const assigned = document.querySelector("#assigned");

// Initialize tasks from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
    loadTasksFromLocalStorage();
    checkForEmptyStates("all"); // Initial check for empty states
});

// Event listeners
form.addEventListener("submit", addTask);
deleteAllButton.addEventListener("click", deleteAllTasks);
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

function createshowtasks1() {
    const showtasks1 = document.createElement("div");
    showtasks1.classList.add("showtasks1");
    showtasks.append(showtasks1);
    showtasks1.state = 0;
    return showtasks1;
}

function createTaskName(showtasks1, taskName) {
    const taskname = document.createElement("p");
    taskname.classList.add("taskname");
    taskname.innerHTML = taskName;
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

function addTask(e) {
    e.preventDefault();
    if (inputBox.value === "") {
        alert("Enter a value");
    } else {
        const showtasks1 = createshowtasks1();
        createTaskName(showtasks1, inputBox.value); // Pass the input value
        createTaskButtons(showtasks1);
        showtasks1.setAttribute("data-status", "assigned");

        // Save tasks to local storage
        saveTasksToLocalStorage();

        inputBox.value = "";
        currentFilter = "all";
        document.querySelector("#all").checked = true;
        allTasks();
        checkForEmptyStates(currentFilter);
    }
}


function completeTask(showtasks1) {
    if (showtasks1.state == 0) {
        showtasks1.querySelector(".taskname").style.textDecoration= "line-through";
        showtasks1.querySelector(".taskname").style.backgroundColor= "#D0D0D0";
        showtasks1.setAttribute("data-status", "completed");
        showtasks1.state = 1;
    } else {
        showtasks1.querySelector(".taskname").style.textDecoration = "none";
        showtasks1.querySelector(".taskname").style.backgroundColor = "aliceblue";
        showtasks1.setAttribute("data-status", "assigned");
        showtasks1.state = 0;
    }
    saveTasksToLocalStorage();
    filterTasks(currentFilter);
}

function deleteTask(showtasks1) {
    showtasks1.remove();
    saveTasksToLocalStorage();
    filterTasks(currentFilter);
}

function deleteAllTasks() {
    const taskContainers = document.querySelectorAll(".showtasks1");
    taskContainers.forEach(task => task.remove());
    saveTasksToLocalStorage();
    checkForEmptyStates(currentFilter);
}

function saveTasksToLocalStorage() {
    const taskContainers = document.querySelectorAll(".showtasks1");
    const tasks = [];
    taskContainers.forEach(task => {
        const taskObj = {
            name: task.querySelector(".taskname").innerHTML,
            status: task.getAttribute("data-status"),
            state: task.state
        };
        tasks.push(taskObj);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const showtasks1 = createshowtasks1();
        createTaskName(showtasks1, task.name); // Pass the stored task name
        createTaskButtons(showtasks1);
        showtasks1.setAttribute("data-status", task.status);
        showtasks1.state = task.state;

        // Set styles based on task status
        if (task.status === "completed") {
            showtasks1.querySelector(".taskname").style.textDecoration= "line-through";
            showtasks1.querySelector(".taskname").style.backgroundColor= "#D0D0D0";
        }
    });
}

function filterTasks(filter) {
    if (filter === "all") {
        allTasks();
    } else if (filter === "completed") {
        completedTasks();
    } else if (filter === "assigned") {
        assignedTasks();
    }
    checkForEmptyStates(filter);
}

function allTasks() {
    const taskContainers = document.querySelectorAll(".showtasks1");
    taskContainers.forEach(task => {
        task.style.display = "flex";
    });
}

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
}

function assignedTasks() {
    const taskContainers = document.querySelectorAll(".showtasks1");
    taskContainers.forEach(task => {
        const status = task.getAttribute("data-status");
        if (status === "assigned") {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    });
}

function editTask(showtasks1) {
    const taskname = showtasks1.querySelector(".taskname");
    if (taskname.isContentEditable) {
        taskname.contentEditable = "false";
        taskname.blur();
    } else {
        taskname.contentEditable = "true";
        taskname.focus(); 
    }
    saveTasksToLocalStorage();
}

function checkForEmptyStates(filter) {
    const taskContainers = document.querySelectorAll(".showtasks1");
    let hasTasks = false;
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
