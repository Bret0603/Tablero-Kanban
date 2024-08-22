const draggables = document.querySelectorAll(".task-container");
const droppables = document.querySelectorAll(".swin-lane");


const handleDragStart = (event) => {
    event.target.classList.add('is-dragging');
};


const handleDragEnd = (event) => {
    event.target.classList.remove('is-dragging');
};

draggables.forEach(taskContainer => {
    taskContainer.addEventListener("dragstart", handleDragStart);
    taskContainer.addEventListener("dragend", handleDragEnd);
});

droppables.forEach(zone => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        const belowTask = insertAboveTask(zone, e.clientY);
        const draggingTask = document.querySelector(".is-dragging");
        if (belowTask) {
            zone.insertBefore(draggingTask, belowTask);
        } else {
            zone.appendChild(draggingTask);
        }
    });
});

const insertAboveTask = (zone, mouseY) => {
    const tasks = zone.querySelectorAll(".task-container:not(.is-dragging)");
    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    tasks.forEach(task => {
        const { top } = task.getBoundingClientRect();
        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestTask = task;
        }
    });

    return closestTask;
};

