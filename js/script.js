
console.log("TaskFlow JavaScript is connected!");


// 1. USER DETAILS
function loadUser(user) {
    const username = user.username;

    document.getElementById("first-letter").textContent =
        username.charAt(0).toUpperCase();

    document.getElementById("welcome-username").textContent = username;
    document.getElementById("username").textContent = username;
}

// Temporary user for testing.
// Later, Firebase or Supabase will provide this information.
loadUser({ username: "Reyna" });


// 2. GREETING
const hour = new Date().getHours();
let greeting;

if (hour >= 4 && hour < 12) {
    greeting = "Good Morning";
}
else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
}
else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
}
else {
    greeting = "Good Night";
}

document.getElementById("time-of-day").textContent = greeting;


// 3. SAMPLE TASKS
let task=[]

// 4. GET TASK STATUS
function getStatus(task) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate + "T00:00:00");

    if (task.status === "Completed") {
        return "Completed";
    }

    if (dueDate < today) {
        return "Overdue";
    }

    return "Pending";
}


// 5. UPDATE DASHBOARD
function updateProgress() {
    const total = tasks.length;

    const completed = tasks.filter(task =>
        getStatus(task) === "Completed"
    ).length;

    const pending = tasks.filter(task =>
        getStatus(task) === "Pending"
    ).length;

    const overdue = tasks.filter(task =>
        getStatus(task) === "Overdue"
    ).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("total-task-count").textContent = total;
    document.getElementById("completed-task-count").textContent = completed;
    document.getElementById("pending-task-count").textContent = pending;
    document.getElementById("overdue-task-count").textContent = overdue;

    document.getElementById("progress-text").textContent = percentage + "%";
    document.getElementById("progress-bar").style.width = percentage + "%";
}


// 6. DISPLAY TASKS
function displayTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    const search = document.getElementById("search-input").value.toLowerCase();
    const statusFilter = document.getElementById("status-filter").value;
    const priorityFilter = document.getElementById("priority-filter").value;

    const filteredTasks = tasks.filter(function(task) {
        const status = getStatus(task);

        return (
            task.title.toLowerCase().includes(search) &&
            (statusFilter === "all" || statusFilter === "" || status === statusFilter) &&
            (priorityFilter === "all" || priorityFilter === "" || task.priority === priorityFilter)
        );
    });

    filteredTasks.forEach(function(task) {
        const status = getStatus(task);

        taskList.innerHTML += `
            <div class="task-card">

                <div class="card-section-1">
                    <h3>${escapeHTML(task.title)}</h3>
                    <p>${escapeHTML(task.description)}</p>
                </div>

                <div class="card-section-2">
                    <p class="${task.priority.toLowerCase()}">${task.priority}</p>
                </div>

                <div class="card-section-3">
                    <p class="status ${status.toLowerCase()}">${status}</p>
                </div>

                <div class="card-section-4">
                    <p class="date-class">
                        <img src="images/calender.svg" alt="">
                        ${task.dueDate}
                    </p>
                </div>

                <div class="card-section-5">
                    <button class="edit-task-btn" data-id="${task.id}" title="Edit task">
                        <img src="images/edit.svg" alt="Edit">
                    </button>

                    <button class="delete-task-btn" data-id="${task.id}" title="Delete task">
                        <img src="images/delete.svg" alt="Delete">
                    </button>
                </div>

            </div>
        `;
    });

    document.getElementById("task-list-count").textContent =
        filteredTasks.length + " Tasks";

    updateProgress();
}


// 7. TASK FORM ELEMENTS
const taskForm = document.getElementById("task-form");
const taskFormContainer = document.getElementById("task-form-container");


// 8. OPEN ADD TASK FORM
function openAddForm() {
    taskForm.reset();

    document.getElementById("task-id").value = "";
    document.getElementById("form-title").textContent = "Add New Task";
    document.getElementById("task-status").value = "Pending";

    taskFormContainer.classList.add("active");
}


// 9. OPEN EDIT TASK FORM
function openEditForm(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) return;

    document.getElementById("task-id").value = task.id;
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-description").value = task.description;
    document.getElementById("task-priority").value = task.priority;
    document.getElementById("task-status").value = task.status;
    document.getElementById("task-date").value = task.dueDate;

    document.getElementById("form-title").textContent = "Edit Task";

    taskFormContainer.classList.add("active");
}


// 10. SAVE TASK
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("task-id").value;

    const taskData = {
        title: document.getElementById("task-title").value.trim(),
        description: document.getElementById("task-description").value.trim(),
        priority: document.getElementById("task-priority").value,
        status: document.getElementById("task-status").value,
        dueDate: document.getElementById("task-date").value
    };

    if (!taskData.title || !taskData.dueDate) return;

    if (id) {
        const task = tasks.find(task => task.id === Number(id));

        if (task) {
            Object.assign(task, taskData);
        }
    }
    else {
        tasks.push({
            id: Date.now(),
            ...taskData
        });
    }

    taskFormContainer.classList.remove("active");
    displayTasks();
});


// 11. CANCEL FORM
document.getElementById("cancel-task").addEventListener("click", function() {
    taskFormContainer.classList.remove("active");
});


// 12. DELETE TASK
function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    displayTasks();
}


// 13. EDIT AND DELETE BUTTONS
document.getElementById("task-list").addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.classList.contains("edit-task-btn")) {
        openEditForm(id);
    }

    if (button.classList.contains("delete-task-btn")) {
        deleteTask(id);
    }
});


// 14. ADD NEW TASK BUTTON
document.getElementById("add-new-task").addEventListener("click", openAddForm);


// 15. SEARCH AND FILTERS
document.getElementById("search-input").addEventListener("input", displayTasks);

document.getElementById("status-filter").addEventListener("change", displayTasks);

document.getElementById("priority-filter").addEventListener("change", displayTasks);


// 16. RESET FILTERS
document.getElementById("reset-button").addEventListener("click", function() {
    document.getElementById("search-input").value = "";
    document.getElementById("status-filter").value = "";
    document.getElementById("priority-filter").value = "";

    displayTasks();
});


// 17. ESCAPE HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character];
    });
}


// 18. DISPLAY TASKS INITIALLY
displayTasks();
