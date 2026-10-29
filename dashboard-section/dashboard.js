// Accessing User Task
const addBtnEl = document.getElementById('addBtn');

addBtnEl.addEventListener("click", async () => {
    const userDetails = localStorage.getItem("userLoginDetails");
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
    } catch (e) {
        alert("An error occurred: " + error.message);
        console.error("Error registering user:", error);
    }
})