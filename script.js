const inputBox = document.querySelector("#inputtask");
const inputButton = document.querySelector(".button");
const showtasks = document.querySelector(".showtasks");
const errormessage = document.querySelector(".error-message")
const noTasksMessage = document.querySelector(".no-tasks-message");
const noCompletedTasksMessage = document.querySelector(".no-completed-tasks-message");
const noAssignedTasksMessage = document.querySelector(".no-assigned-tasks-message");
const deleteAllButton = document.querySelector(".delete-all");
deleteAllButton.addEventListener("click", deleteAllTasks);
const form =document.querySelector("#form");
form.addEventListener("submit", addTask);
let currentFilter = "all";
checkForEmptyStates(currentFilter);
inputBox.addEventListener("click", () => {
    errormessage.innerHTML = "";
});


function createshowtasks1() {
    const showtasks1 = document.createElement("div");
    showtasks1.classList.add("showtasks1");
    showtasks.append(showtasks1);
    showtasks1.state=0;
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

function addTask(e) {
    e.preventDefault();
    const taskValue = inputBox.value.trim();
    if (taskValue === "") {
        errormessage.innerHTML = "Task cannot be empty.";
    } else if (inputBox.value.charAt(0) === " ") {
        errormessage.innerHTML = "Task cannot start with a space.";
    } else {
        const showtasks1 = createshowtasks1();
        createTaskName(showtasks1, taskValue);
        createTaskButtons(showtasks1);
        showtasks1.setAttribute("data-status", "assigned");
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
        showtasks1.setAttribute("data-status", "completed")
        showtasks1.state = 1;
      } else {
        showtasks1.querySelector(".taskname").style.textDecoration = "none";
        showtasks1.querySelector(".taskname").style.backgroundColor = "aliceblue";
        showtasks1.setAttribute("data-status", "assigned")
        showtasks1.state = 0;
      }
      if (currentFilter === "all") {
        allTasks();
    } else if (currentFilter === "completed") {
        completedTasks();
    } else if (currentFilter === "assigned") {
        assignedTasks();
    }
    checkForEmptyStates(currentFilter);
}

function deleteTask(showtasks1) {
    showtasks1.remove();
    if (currentFilter === "all") {
        allTasks();
    } else if (currentFilter === "completed") {
        completedTasks();
    } else if (currentFilter === "assigned") {
        assignedTasks();
    }
}
function deleteAllTasks() {
    const taskContainers = document.querySelectorAll(".showtasks1");
    taskContainers.forEach(task => task.remove());
    // Update the display after deleting all tasks
    checkForEmptyStates(currentFilter);
}

const all = document.querySelector("#all");
const completed = document.querySelector("#completed");
const assigned = document.querySelector("#assigned");

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

function allTasks() {
    const taskContainers = document.querySelectorAll(".showtasks1");
    taskContainers.forEach(task => {
        task.style.display = "flex";
    });
    checkForEmptyStates("all");
}

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
    checkForEmptyStates("completed", hasCompletedTasks);
}

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
    checkForEmptyStates("assigned", hasAssignedTasks);
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
    
}
function checkForEmptyStates(filter,  hasFilteredTasks = false) {
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



// function editTask(showtasks1) {
//     const taskname = showtasks1.querySelector(".taskname");

//     if (taskname.isContentEditable) {
//         // Add event listener for "Enter" key
//         taskname.addEventListener("keydown", function(event) {
//             if (event.key === "Enter") {
//                 event.preventDefault(); // Prevent new line
//                 taskname.contentEditable = "false";
//                 taskname.blur();
//                 // Remove event listener after use to avoid multiple handlers
//                 taskname.removeEventListener("keydown", arguments.callee);
//             }
//         });
        
//         // When clicking outside the taskname element, finish editing
//         taskname.addEventListener("blur", function() {
//             taskname.contentEditable = "false";
//         });

//         taskname.focus();
//     } else {
//         taskname.contentEditable = "true";
//         taskname.focus(); 
//     }
// }


