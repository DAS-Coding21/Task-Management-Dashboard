// Accessing User Task
const addBtnEl = document.getElementById('addBtn');


addBtnEl.addEventListener("click", async () => {
    const userDetails = localStorage.getItem("userLoginData");
    const parseUserDetails = JSON.parse(userDetails);

    const userId = parseUserDetails[0].userId;
    const taskTitle = document.getElementById('taskInput').value;

    const taskList = {
        userId,
        taskTitle,
    };

    try {
        const response = await fetch("http://localhost:3000/tasks/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskList)
        });
        const taskResponse = await response.json();

        if (taskResponse.success) {
            console.log(taskResponse.message);
            console.log(taskResponse.task);
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
        console.error("Error registering user:", error);
    }
})

async function updateTaskStatus(newStatus, task) {
    try {
        const response = await fetch(
            `http://localhost:3000/tasks/${task.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: newStatus
                })
            }
        );

        const StatusResult = await response.json();
        if (!response.ok || !StatusResult.success) {
            throw new Error(StatusResult.message || "Failed to update task status.");
        }
        console.log(StatusResult);

    } catch (error) {
        console.error('Failed to update task status:', error);
    }
}

function renderTaskList(tasks) {
    const taskListContainerEl = document.getElementById('taskListContainer');

    if (tasks.length === 0) {
        container.innerHTML = `<p>No tasks yet. Add one above!</p>`;
        return;
    }

    // Design task card
    tasks.forEach(task => {
        const taskCardEl = document.createElement('div');
        taskCardEl.classList.add("task-card");

        const checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-container");
        taskCardEl.appendChild(checkboxContainer);

        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        const checkboxStatus = task.id;
        checkbox.setAttribute("id", checkboxStatus);
        checkbox.checked = task.status === "completed";
        checkbox.classList.add("checkbox");
        checkboxContainer.appendChild(checkbox);

        const taskLabelContainer = document.createElement("div");
        taskLabelContainer.classList.add("task-label-container");
        taskCardEl.appendChild(taskLabelContainer);

        const taskLabelEl = document.createElement('label');
        taskLabelEl.setAttribute("for", checkboxStatus);
        taskLabelEl.textContent = task.title;
        if (task.status === "completed") {
            taskLabelEl.classList.add("label-status");
        }
        taskLabelContainer.appendChild(taskLabelEl);

        checkbox.addEventListener("change", async () => {
            const newStatus = checkbox.checked ? "completed" : "pending";

            if (checkbox.checked) {
                taskLabelEl.classList.add("label-status");
            } else {
                taskLabelEl.classList.remove("label-status");
            }

            await updateTaskStatus(newStatus, task);
        });

        const delBtnEl = document.createElement("button");
        taskLabelContainer.appendChild(delBtnEl);

        const delIconEl = document.createElement('i');
        delIconEl.classList.add("fa-solid", "fa-trash");
        delBtnEl.appendChild(delIconEl);

        taskListContainerEl.appendChild(taskCardEl);
    });
}

function renderTasksStatus(tasks) {
    const totalTaskEl = document.getElementById('totalTasks');
    const pendingTaskEl = document.getElementById('pendignTasks');
    const completeTaskEl = document.getElementById('completeTasks');

    // 1. Total tasks is just the length of the array
    const totalTasks = tasks.length;
    totalTaskEl.textContent = totalTasks

    // 2. Filter tasks where status is 'complete'
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    completeTaskEl.textContent = completedTasks;

    // 3. Filter tasks where status is 'pending'
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    pendingTaskEl.textContent = pendingTasks;
}

async function fetchUserTasks(userId) {
    try {
        // Knocking on the server's door: GET http://localhost:3000/api/tasks/2
        const response = await fetch(`http://localhost:3000/tasks/${userId}`);
        const data = await response.json();
        if (data.success) {
            renderTaskList(data.tasks); // Send data to be drawn on screen
            renderTasksStatus(data.tasks); //Send data to count the task based on their status
        }
    } catch (error) {
        console.log('Failed to load tasks from server:', error);
    }
}

// 1. Run automatically when the dashboard page loads
document.addEventListener('DOMContentLoaded', function () {
    const userDetails = localStorage.getItem("userLoginData");
    const parseUserDetails = JSON.parse(userDetails);

    const userId = parseUserDetails[0].userId;
    console.log(userId);
    const userName = parseUserDetails[0].userName;
    console.log(userName);

    // Display user's name in the greeting header if available
    if (userName) {
        document.getElementById('username').textContent = `${userName}`;
    }

    // Security check: If no userId is found in localStorage, kick them back to login
    if (!userId) {
        window.location.href = 'index.html'; // Change to your login page file name if different
        return;
    }

    // Fetch and display this user's tasks from the backend database
    fetchUserTasks(userId);
});