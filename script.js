function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

const inputBox = document.getElementById("input-box");
const taskList = document.getElementById("task-list");

// Initializing tasks array to store the tasks
let tasks = [];

// Loading tasks from local storage when the page loads
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (savedTasks) {
    tasks = savedTasks;
    displayTasks();
  }
}

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskText = inputBox.value.trim();

  if (taskText !== "") {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.classList.add("hidden");
    // Create a new task object
    const task = {
      uuid: create_UUID(),
      text: taskText,
      completed: false,
      date: new Date().toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    // Add the task to the tasks array
    tasks.push(task);

    // Save tasks to local storage
    saveTasks();

    // Add the task to the task list
    displayTasks();

    // Clear the input field
    inputBox.value = "";
  } else {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.classList.remove("hidden");
    errorMessage.classList.add("text-red-500");
    errorMessage.innerHTML =
      "please enter a task, Input field can not be empty";
  }
}

function toggleTask(index) {
  // Toggle the completed state of the task

  tasks.find((todo) => todo.uuid == index).completed = !tasks.find(
    (todo) => todo.uuid == index
  ).completed;

  // Save tasks to local storage
  saveTasks();

  // Update the task list to reflect the change
  displayTasks();
}

function deleteTask(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", "Your task has been deleted.", "success");
      tasks.splice(index, 1);

      // Save tasks to local storage
      saveTasks();

      // Update the task list to reflect the change
      displayTasks();
    }
  });
  // Remove the task from the tasks array
}

function displayTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className =
      "list-item flex items-center justify-between border-b border-gray-300 drop-shadow-lg shadow-red py-2";
    taskItem.innerHTML = `
    <div class="flex justify-between cursor-pointer group" >
               <button class = "hidden group-hover:block"  onclick = "toPreview('${
                 task.uuid
               }')">Preview Task</button> 
                <div class = "group-hover:hidden">
                    <input type="checkbox" class="mr-2  form-checkbox" ${
                      task.completed ? "checked" : ""
                    } onclick="toggleTask('${task.uuid}')">
                    <span class="task-text ${
                      task.completed ? "line-through" : ""
                    }">${task.text}</span>
                    </div>
                    
                
              
                <div class="flex flex-col-reverse items-center gap-2">
                <span>${task.date}</span>
                <div class="flex items-center gap-5" >
                    <button onclick="editTask('${
                      task.uuid
                    }')" class="border-0 outline-none px-[15px] py-[6px] bg-[#999999] text-white rounded-[10px] text-[16px] ">Edit</button>
                    <button onclick="deleteTask('${
                      task.uuid
                    }')"  class="border-0 outline-none px-[15px] py-[6px] bg-[#d30000] text-white rounded-[10px] text-[16px]">Delete</button>
                  </div>
                </div>
                </div>
            `;
    taskList.appendChild(taskItem);
  });
}

function editTask(index) {
  let task = tasks.find((todo) => todo.uuid == index);

  Swal.fire({
    title: "Do you want to save the changes?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`,
    input: "text",
    inputValue: task.text,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Saved!", "", "success");
      tasks.find((todo) => todo.uuid == index).text = result.value;
      saveTasks();
      displayTasks();
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}

function toPreview(uuid) {
  localStorage.setItem("taskUuid", uuid);
  window.location.href = "./preview.html";
}
// Load tasks when the page loads
loadTasks();
