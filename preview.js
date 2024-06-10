const taskDB = JSON.parse(localStorage.getItem("tasks"));

function displayTaskContent() {
  const id = localStorage.getItem("taskUuid");
  console.log(taskDB, "message");
  const task = taskDB.find((task) => task.uuid == id);
  console.log(task, id);
  const previewPage = document.getElementById("previewPage");
  previewPage.innerHTML = "";
  previewPage.innerHTML += `<div class="flex justify-between" >
                
                <div>
                    <input type="checkbox" class="mr-2  form-checkbox" ${
                      task.completed ? "checked" : ""
                    } onclick="toggleTask('${task.uuid}')">
                    <span class="task-text ${
                      task.completed ? "line-through" : ""
                    }">${task.text}</span>
                    </div>
                    
                
              
                <div class="flex flex-col-reverse items-center gap-2">
                <span>${task.date}</span>
                <span class = "cursor-pointer" onclick = addDescription('${
                  task.uuid
                }')>${task.description || "Add Description"}</span>
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
}
function addDescription(uuid) {
  const task = taskDB.find((task) => task.uuid == uuid);
  console.log(uuid, task, "err");
  Swal.fire({
    title: "Do you want to save the changes?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`,
    input: "text",
    inputValue: task.description || "Add description",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire("Saved!", "", "success");
      task.description = result.value;
      localStorage.setItem("tasks", JSON.stringify(taskDB));
      displayTaskContent();
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}
displayTaskContent();

function toMainPage(uuid) {
  localStorage.setItem("taskUuid", uuid);
  window.location.href = "./index.html";
}
