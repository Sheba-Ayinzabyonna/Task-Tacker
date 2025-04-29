const initialTasks = [
  { id: 1, text: "Complete project proposal", completed: true },
  { id: 2, text: "Review team presentations", completed: false },
  { id: 3, text: "Update documentation", completed: false },
  { id: 4, text: "Schedule team meeting", completed: true },
  { id: 5, text: "Prepare monthly report", completed: false },
];

let tasks = [...initialTasks];
let currentTab = "all";

const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const taskForm = document.getElementById("task-form");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const tabButtons = document.querySelectorAll(".tab");

function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks;
  if (currentTab === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentTab === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }
  filteredTasks.forEach((task, idx) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.innerHTML = `
      <input type="checkbox" class="checkbox" id="chk-${task.id}" ${
      task.completed ? "checked" : ""
    }>
      <span class="task-label">${task.text}</span>
      <div class="task-actions">
        <button class="edit-btn" title="Edit">&#9998;</button>
        <button class="delete-btn" title="Delete">&#128465;</button>
      </div>
    `;
    // Checkbox toggle
    li.querySelector(".checkbox").addEventListener("change", () =>
      toggleTask(task.id)
    );
    // Edit button
    li.querySelector(".edit-btn").addEventListener("click", () =>
      editTask(task.id)
    );
    // Delete button
    li.querySelector(".delete-btn").addEventListener("click", () =>
      deleteTask(task.id)
    );
    taskList.appendChild(li);
  });
  updateFooter();
  updateTabCounts();
}

function updateFooter() {
  const activeCount = tasks.filter((t) => !t.completed).length;
  itemsLeft.textContent = `${activeCount} item${
    activeCount !== 1 ? "s" : ""
  } left`;
}

function updateTabCounts() {
  tabButtons[0].textContent = `All Tasks (${tasks.length})`;
  tabButtons[1].textContent = `Active (${
    tasks.filter((t) => !t.completed).length
  })`;
  tabButtons[2].textContent = `Completed (${
    tasks.filter((t) => t.completed).length
  })`;
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = !task.completed;
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  const newText = prompt("Edit task:", task.text);
  if (newText !== null && newText.trim() !== "") {
    task.text = newText.trim();
    renderTasks();
  }
}

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = taskInput.value.trim();
  if (value) {
    const newId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    tasks.push({ id: newId, text: value, completed: false });
    taskInput.value = "";
    renderTasks();
  }
});

clearCompletedBtn.addEventListener("click", function () {
  tasks = tasks.filter((t) => !t.completed);
  renderTasks();
});

tabButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
    renderTasks();
  });
});

// Initial render
renderTasks();
