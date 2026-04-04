const task = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDateInput");
const priority = document.getElementById("priorityInput");
const addButton = document.getElementById("addTaskButton");
const todaysTaskList = document.getElementById("todaysTaskList");
const completedTaskList = document.getElementById("completedTaskList");
const futureTaskList = document.getElementById("futureTaskList");
const taskList = document.getElementById("taskList");
let tasks = [];

// Update numbered order labels for tasks inside a list container
function updateTaskIndexes(container) {
    const rows = Array.from(container.querySelectorAll("div[data-priority]"));
    rows.forEach((row, index) => {
        const title = row.querySelector("p");
        if (title) {
            const taskName = row.dataset.taskName || title.textContent.replace(/^\d+\.\s*/, "");
            title.textContent = `${index + 1}.  ${taskName}`;
        }
    });
}

function updateAllTaskIndexes() {
    updateTaskIndexes(taskList);
    updateTaskIndexes(futureTaskList);
    updateTaskIndexes(completedTaskList);
}

// Function to get priority value for sorting (higher number = higher priority)
function getPriorityValue(priorityStr) {
    const priorityMap = { high: 3, medium: 2, low: 1 };
    return priorityMap[priorityStr] || 0;
}

// Function to sort tasks in a container by priority
function sortTasksByPriority(container) {
    const taskElements = Array.from(container.querySelectorAll("div[data-priority]"));
    taskElements.sort((a, b) => {
        const priorityA = getPriorityValue(a.getAttribute("data-priority"));
        const priorityB = getPriorityValue(b.getAttribute("data-priority"));
        return priorityB - priorityA; // Descending order (high to low)
    });
    
    // Re-append sorted elements
    taskElements.forEach(element => container.appendChild(element));
}
addButton.addEventListener("click", function() {
    const taskValue = task.value
    const dueDateValue = dueDate.value;
    const priorityValue = priority.value;

    if (taskValue === "" || dueDateValue === "" || priorityValue === "") {
        alert("Please fill in all fields.");
        return;
    }
    
    const p1 = document.createElement("p");
    p1.textContent = ` ${taskValue}`;
    const p2 = document.createElement("p");
    p2.textContent = `${dueDateValue}`;
    const p3 = document.createElement("p");
    p3.textContent = `${priorityValue}`;
    const lastElement = document.createElement("div");
    lastElement.className = "task-buttons";
    lastElement.style.display = "flex";
    lastElement.style.gap = "2px";
    lastElement.style.flexDirection = "row";
    const doneBtn = document.createElement("button");
    doneBtn.innerHTML = '<img src="img/check-circle 1.png" alt="Done" style="width: 24px; height: 24px;">';
    // doneBtn.parentNode.parentNode.parentNode===completedTaskList ? doneBtn.style.visibility = "hidden" : doneBtn.style.visibility = "visible";
    doneBtn.addEventListener("click", function() {
        // Find the task in the array and update completed status
        const taskIndex = tasks.findIndex(t => t.task === taskValue && t.dueDate === dueDateValue && t.priority === priorityValue);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = true;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            // Hide the Done button
            doneBtn.style.display = "none";
            // Remove from current list first
            if (rowItem.parentNode) {
                const oldParent = rowItem.parentNode;
                oldParent.removeChild(rowItem);
                updateTaskIndexes(oldParent);
            }
            // Then move to completed list
            completedTaskList.appendChild(rowItem);
            sortTasksByPriority(completedTaskList);
            updateTaskIndexes(completedTaskList);
        }
    });

    const delBtn = document.createElement("button");
    delBtn.innerHTML = '<img src="img/trash 1.png" alt="Delete" style="width: 24px; height: 24px;">';
    delBtn.addEventListener("click", function() {
        // Remove from tasks array
        tasks = tasks.filter(t => !(t.task === taskValue && t.dueDate === dueDateValue && t.priority === priorityValue));
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // Remove from DOM
        if (rowItem.parentNode) {
            const oldParent = rowItem.parentNode;
            oldParent.removeChild(rowItem);
            updateTaskIndexes(oldParent);
        }
    });
    const rowItem = document.createElement("div");
    rowItem.dataset.taskName = taskValue;
    rowItem.setAttribute("data-priority", priorityValue); // Add priority attribute for sorting
    lastElement.appendChild(doneBtn);
    lastElement.appendChild(delBtn);
    rowItem.appendChild(p1);
    rowItem.appendChild(p2);
    rowItem.appendChild(p3);
    rowItem.appendChild(lastElement);
    
    const todayDate = new Date().toISOString().split("T")[0];
     if (dueDateValue === todayDate) {
        taskList.appendChild(rowItem);
        sortTasksByPriority(taskList);
        updateTaskIndexes(taskList);
    } else {
        futureTaskList.appendChild(rowItem);
        sortTasksByPriority(futureTaskList);
        updateTaskIndexes(futureTaskList);
    }
    tasks.push({ task: taskValue, dueDate: dueDateValue, priority: priorityValue, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // Clear inputs
    task.value = "";
    dueDate.value = "";
    priority.value = "";
});


window.onload = function() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = storedTasks; // Update the global tasks array
    const todayDate = new Date().toISOString().split("T")[0];
    
    storedTasks.forEach((t,idx )=> {
        const p1 = document.createElement("p");
        p1.textContent = `${t.task}`;
        const p2 = document.createElement("p");
        p2.textContent = ` ${t.dueDate}`;
        const p3 = document.createElement("p");
        p3.textContent = `${t.priority}`;
        const lastElement = document.createElement("div");
        lastElement.className = "task-buttons";
        
        const doneBtn = document.createElement("button");
        doneBtn.innerHTML = '<img src="img/check-circle 1.png" alt="Done" style="width: 24px; height: 24px;">';
        doneBtn.addEventListener("click", function() {
            // Find the task and update
            const taskIndex = tasks.findIndex(task => task.task === t.task && task.dueDate === t.dueDate && task.priority === t.priority);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = true;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                // Hide the Done button
                doneBtn.style.display = "none";
                // Remove from current list first
                if (rowItem.parentNode) {
                    const oldParent = rowItem.parentNode;
                    oldParent.removeChild(rowItem);
                    updateTaskIndexes(oldParent);
                }
                // Then move to completed list
                completedTaskList.appendChild(rowItem);
                updateTaskIndexes(completedTaskList);
            }
        });

        const delBtn = document.createElement("button");
        delBtn.innerHTML = '<img src="img/trash 1.png" alt="Delete" style="width: 24px; height: 24px;">';
        delBtn.addEventListener("click", function() {
            // Remove from tasks array
            tasks = tasks.filter(task => !(task.task === t.task && task.dueDate === t.dueDate && task.priority === t.priority));
            localStorage.setItem("tasks", JSON.stringify(tasks));
            // Remove from DOM
            if (rowItem.parentNode) {
                const oldParent = rowItem.parentNode;
                oldParent.removeChild(rowItem);
                updateTaskIndexes(oldParent);
            }
        });
        
        const rowItem = document.createElement("div");
        rowItem.dataset.taskName = t.task;
        rowItem.setAttribute("data-priority", t.priority); // Add priority attribute for sorting
        lastElement.appendChild(doneBtn);
        lastElement.appendChild(delBtn);
        rowItem.appendChild(p1);
        rowItem.appendChild(p2);
        rowItem.appendChild(p3);
        rowItem.appendChild(lastElement);
        
        // Append to appropriate list based on completed and due date
        if (t.completed) {
            doneBtn.style.display = "none"; // Hide Done button for completed tasks
            completedTaskList.appendChild(rowItem);
        } else if (t.dueDate === todayDate) {
            taskList.appendChild(rowItem);
        } else {
            futureTaskList.appendChild(rowItem);
        }
    });
    
    // Sort all lists by priority after loading
    sortTasksByPriority(taskList);
    sortTasksByPriority(futureTaskList);
    sortTasksByPriority(completedTaskList);
    updateAllTaskIndexes();
}