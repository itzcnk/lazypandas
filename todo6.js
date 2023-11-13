/*document.addEventListener("DOMContentLoaded", function () {
    const taskTitleInput = document.getElementById("taskTitleInput");
    const taskDescriptionInput = document.getElementById("taskDescriptionInput");
    const taskDeadlineInput = document.getElementById("taskDeadlineInput");
    const priorityDropdown = document.getElementById("priorityDropdown");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addButton");
  
    // Add drop event listener to the taskList
    taskList.addEventListener("drop", handleDrop);
    taskList.addEventListener("dragover", handleDragOver);
  
    function handleDrop(event) {
      event.preventDefault();
  
      // Reset the visual indication when dropping into a droppable area
      if (event.target.tagName === "LI") {
        event.target.classList.remove("drop-hover");
      }
  
      // Handle the drop operation as needed
      const draggedTaskId = event.dataTransfer.getData("text/plain");
      const draggedTaskElement = document.getElementById(draggedTaskId);
  
      // Find the index of the dragged task
      const draggedIndex = Array.from(taskList.children).indexOf(
        draggedTaskElement
      );
  
      // Find the index of the drop target
      const dropIndex = Array.from(taskList.children).indexOf(event.target);
  
      // Determine the direction of the shift (1 for down, -1 for up)
      const shiftDirection = dropIndex > draggedIndex ? 1 : -1;
  
      // Shift the tasks to adjust for the dropped task
      for (let i = draggedIndex; i !== dropIndex; i += shiftDirection) {
        const currentTask = taskList.children[i];
        const nextTask = taskList.children[i + shiftDirection];
  
        taskList.insertBefore(currentTask, nextTask);
      }
    }
  
    function handleDragOver(event) {
      event.preventDefault();
      // Provide visual indication when dragging over a droppable area
      if (event.target.tagName === "LI") {
        event.target.classList.add("drop-hover");
      }
    }
  
    // Set focus on the title input when the page loads
    taskTitleInput.focus();
  
    function addTask() {
      const taskTitle = taskTitleInput.value.trim();
      const taskDescription = taskDescriptionInput.value.trim();
      const taskDeadline = taskDeadlineInput.value.trim();
      const taskPriority = priorityDropdown.value; // Get the selected priority

      if (!taskTitle || !taskDescription || !taskDeadline || !taskPriority) {
        // If any of the required fields is not entered, return without adding the task
        return;
      }

      const newTask = {
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline,
        priority: taskPriority, // Include the priority in the task object
      };

      // Insert the new task in the correct position based on the deadline and priority
      insertTaskInOrder(newTask);

      // Clear input fields after adding a task
      taskTitleInput.value = "";
      taskDescriptionInput.value = "";
      taskDeadlineInput.value = "";
      priorityDropdown.value = "low"; // Reset priority dropdown to default

      // Move focus to the title input
      taskTitleInput.focus();
    }
  
    addButton.addEventListener("click", addTask);
  
    // Trigger addTask on Enter key press in the title input
    taskTitleInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addTask();
        // Move focus to the description input after adding the task
        taskDescriptionInput.focus();
        event.preventDefault(); // Prevent default behavior of the Enter key
      }
    });
  
    // Trigger addTask on Enter key press in the description input
    taskDescriptionInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addTask();
        // Move focus to the deadline input after adding the task
        taskDeadlineInput.focus();
        event.preventDefault(); // Prevent default behavior of the Enter key
      }
    });
  
    // Trigger addTask on Enter key press in the deadline input
  taskDeadlineInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addTask();
      // Move focus to the priority dropdown after adding the task
      priorityDropdown.focus();
      event.preventDefault(); // Prevent default behavior of the Enter key
    }
  });

  priorityDropdown.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      // Move focus to the title input after editing the priority
      taskTitleInput.focus();
      event.preventDefault(); // Prevent default behavior of the Enter key
    }
  });

  taskList.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("edit-btn")) {
      editTask(target);
    }
  });

  
    // Make tasks draggable
    taskList.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", event.target.id);
    });
  
    taskList.addEventListener("dragover", function (event) {
        const rect = event.target.getBoundingClientRect();
        const offsetY = event.clientY - rect.top;
    
        // Adjust the threshold based on your preference
        if (offsetY < rect.height * 0.25 || offsetY > rect.height * 0.75) {
            event.preventDefault();
        }
    });
  
   
    taskList.addEventListener("drop", function (event) {
        event.preventDefault();
    
        const taskId = event.dataTransfer.getData("text/plain");
        const taskElement = document.getElementById(taskId);
    
        // Calculate the relative position of the cursor within the taskList
        const rect = taskList.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
    
        // Calculate the drop index based on the relative position
        const dropIndex = Math.floor(offsetX / taskElement.offsetWidth);
    
        // Insert the dragged task at the calculated index
        taskList.insertBefore(taskElement, taskList.children[dropIndex]);
    
        // Remove the drop-hover class from all li elements
        const tasks = document.querySelectorAll("#taskList li");
        tasks.forEach(task => task.classList.remove("drop-hover"));
    });
    
    
    
  
    function insertTaskInOrder(newTask) {
      const li = document.createElement("li");
      li.id = `task-${Date.now()}`; // Assign a unique ID to each task for draggable functionality
      li.draggable = true;
      // Add a dragstart event listener to initiate the drag operation
      li.addEventListener("dragstart", handleDragStart);
  
      // Add a dragend event listener to clean up styles after the drag operation
      li.addEventListener("dragend", handleDragEnd);
  
      li.innerHTML = `<h3>${newTask.title}</h3>
                        <p>${newTask.description}</p>
                        <p><strong>Deadline:</strong> ${newTask.deadline}</p>
                        <button class="edit-btn" onclick="editTask(this)">Edit</button>
                        <button onclick="removeTask(this)">Remove</button>`;
  
      // Find the correct position to insert the new task based on the deadline
      let inserted = false;
      const existingTasks = taskList.children;
  
      for (let i = 0; i < existingTasks.length; i++) {
        const existingDeadline = existingTasks[i]
          .querySelector("p:nth-child(3)")
          .textContent.replace("Deadline:", "")
          .trim();
  
        if (newTask.deadline < existingDeadline) {
          taskList.insertBefore(li, existingTasks[i]);
          inserted = true;
          break;
        }
      }
  
      // If the new task has the latest deadline, append it to the end
      if (!inserted) {
        taskList.appendChild(li);
      }
      // Add the handleDragStart function
      function handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.id);
  
        // Add the dragging class during the drag operation
        event.target.classList.add("dragging");
      }
  
      // Add the handleDragEnd function
      function handleDragEnd(event) {
        // Remove the dragging class after the drag operation
        event.target.classList.remove("dragging");
      }
    }
  
    function removeTask(button) {
      const li = button.parentNode;
      taskList.removeChild(li);
    }
  
    function editTask(button) {
      const li = button.parentNode;
      const titleElement = li.querySelector("h3");
      const descriptionElement = li.querySelector("p");
      const deadlineElement = li.querySelectorAll("p")[1];
  
      // Create input elements for editing
      const newTitleInput = createInput("text", titleElement.textContent);
      const newDescriptionInput = createTextarea(descriptionElement.textContent);
      const newDeadlineInput = createInput(
        "date",
        deadlineElement.textContent.replace("Deadline:", "").trim()
      );
  
      // Replace the title, description, and deadline with input elements
      replaceElement(titleElement, newTitleInput);
      replaceElement(descriptionElement, newDescriptionInput);
      replaceElement(deadlineElement, newDeadlineInput);
  
      // Create a Save button
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.addEventListener("click", saveEdit);
  
      // Append the Save button
      li.appendChild(saveButton);
  
      // Move focus to the newTitleInput after editing starts
      newTitleInput.focus();
  
      function saveEdit() {
        // Update the title, description, and deadline with the input values
        titleElement.textContent = newTitleInput.value;
        descriptionElement.textContent = newDescriptionInput.value;
        deadlineElement.textContent = `Deadline: ${newDeadlineInput.value}`;
  
        // Remove the input elements and show the updated title, description, and deadline
        replaceElement(newTitleInput, titleElement);
        replaceElement(newDescriptionInput, descriptionElement);
        replaceElement(newDeadlineInput, deadlineElement);
        saveButton.remove();
  
        // Move focus to the next input after saving
        newDeadlineInput.focus();
      }
  
      // Trigger saveEdit on Enter key press in the newTitleInput
      newTitleInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          newDescriptionInput.focus();
          event.preventDefault(); // Prevent default behavior of the Enter key
        }
      });
  
      // Trigger saveEdit on Enter key press in the newDescriptionInput
      newDescriptionInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          newDeadlineInput.focus();
          event.preventDefault(); // Prevent default behavior of the Enter key
        }
      });
  
      // Trigger saveEdit on Enter key press in the newDeadlineInput
      newDeadlineInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          saveEdit();
          event.preventDefault(); // Prevent default behavior of the Enter key
        }
      });
    }
  
    function createInput(type, value) {
      const input = document.createElement("input");
      input.type = type;
      input.value = value;
      return input;
    }
  
    function createTextarea(value) {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      return textarea;
    }
  
    function replaceElement(oldElement, newElement) {
      oldElement.replaceWith(newElement);
    }
  });*/
  








  document.addEventListener("DOMContentLoaded", function () {
    // Retrieve DOM elements
    const taskTitleInput = document.getElementById("taskTitleInput");
    const taskDescriptionInput = document.getElementById("taskDescriptionInput");
    const taskDeadlineInput = document.getElementById("taskDeadlineInput");
    const priorityDropdown = document.getElementById("priorityDropdown");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addButton");
  
    // Set focus on the title input when the page loads
    taskTitleInput.focus();
  
    // Function to add a new task to the list
    function addTask() {
      const taskTitle = taskTitleInput.value.trim();
      const taskDescription = taskDescriptionInput.value.trim();
      const taskDeadline = taskDeadlineInput.value.trim();
      const taskPriority = priorityDropdown.value;
  
      // Check if essential information is provided
      if (!taskTitle || !taskDescription || !taskDeadline || !taskPriority) {
        return;
      }
  
      // Create a new task object
      const newTask = {
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline,
        priority: taskPriority,
      };
  
      // Insert the new task in the correct position based on deadline and priority
      insertTaskInOrder(newTask);
  
      // Clear input fields after adding a task
      taskTitleInput.value = "";
      taskDescriptionInput.value = "";
      taskDeadlineInput.value = "";
      // priorityDropdown.value = "low";
  
      // Move focus to the title input
      taskTitleInput.focus();
    }
  
    // Event listener for the "Add" button click
    addButton.addEventListener("click", addTask);
  
    // Event listeners for handling Enter key presses in input fields
    taskTitleInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addTask();
        taskDescriptionInput.focus();
        event.preventDefault();
      }
    });
  
    taskDescriptionInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addTask();
        taskDeadlineInput.focus();
        event.preventDefault();
      }
    });
  
    taskDeadlineInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        priorityDropdown.click();
        event.preventDefault();
      }
    });
  
    priorityDropdown.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addTask();
        taskTitleInput.focus();
        event.preventDefault();
      }
    });
  
    // Event listener for the task list to handle clicks on task elements
    taskList.addEventListener("click", function (event) {
      const target = event.target;
  
      // Check if the clicked element is an "Edit" button
      if (target.classList.contains("edit-btn")) {
        editTask(target);
      }
    });
  
    // Event listeners for making tasks draggable
    taskList.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", event.target.id);
    });
  
    taskList.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
  
    taskList.addEventListener("drop", function (event) {
      event.preventDefault();
      const taskId = event.dataTransfer.getData("text/plain");
      const taskElement = document.getElementById(taskId);
      taskList.insertBefore(taskElement, event.target);
    });
  
    // Function to insert a task in order based on deadline and priority
    function insertTaskInOrder(newTask) {
      const li = document.createElement("li");
      li.id = `task-${Date.now()}`;
      li.draggable = true;
  
      // Task HTML structure with title, description, deadline, priority, edit, and remove buttons
      li.innerHTML = `<h3>${newTask.title}</h3>
                        <p>${newTask.description}</p>
                        <p><strong>Deadline:</strong> ${newTask.deadline}</p>
                        <p><strong>Priority:</strong> ${newTask.priority}</p>
                        <button class="edit-btn" onclick="editTask(this)">Edit</button>
                        <button onclick="removeTask(this)">Remove</button>`;
  
      // Find the correct position to insert the new task based on the deadline and priority
      let inserted = false;
      const existingTasks = taskList.children;
  
      for (let i = 0; i < existingTasks.length; i++) {
        const existingDeadline = existingTasks[i]
          .querySelector("p:nth-child(3)")
          .textContent.replace("Deadline:", "")
          .trim();
  
        const existingPriority = existingTasks[i]
          .querySelector("p:nth-child(4)")
          .textContent.replace("Priority:", "")
          .trim();
  
        // Compare the new task with existing tasks based on deadline and priority
        if (newTask.deadline < existingDeadline || (newTask.deadline === existingDeadline && newTask.priority < existingPriority)) {
          taskList.insertBefore(li, existingTasks[i]);
          inserted = true;
          break;
        }
      }
  
      // If the new task has the latest deadline and priority, append it to the end
      if (!inserted) {
        taskList.appendChild(li);
      }
    }
  
    // Function to remove a task from the list
    function removeTask(button) {
      const li = button.parentNode;
      taskList.removeChild(li);
    }
  
    // Function to edit a task
    function editTask(button) {
      const li = button.parentNode;
      const titleElement = li.querySelector("h3");
      const descriptionElement = li.querySelector("p");
      const deadlineElement = li.querySelectorAll("p")[1];
      const priorityElement = li.querySelectorAll("p")[2];
  
      // Create input elements for editing
      const newTitleInput = createInput("text", titleElement.textContent);
      const newDescriptionInput = createTextarea(descriptionElement.textContent);
      const newDeadlineInput = createInput(
        "date",
        deadlineElement.textContent.replace("Deadline:", "").trim()
      );
      const newPriorityInput = createPriorityDropdown(priorityElement.textContent.replace("Priority:", "").trim());
  
      // Replace the title, description, deadline, and priority with input elements
      replaceElement(titleElement, newTitleInput);
      replaceElement(descriptionElement, newDescriptionInput);
      replaceElement(deadlineElement, newDeadlineInput);
      replaceElement(priorityElement, newPriorityInput);
  
      // Create a Save button
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.addEventListener("click", saveEdit);
  
      // Append the Save button
      li.appendChild(saveButton);
  
      // Move focus to the newTitleInput after editing starts
      newTitleInput.focus();
  
      // Function to save the edited task
      function saveEdit() {
        titleElement.textContent = newTitleInput.value;
        descriptionElement.textContent = newDescriptionInput.value;
        deadlineElement.textContent = `Deadline: ${newDeadlineInput.value}`;
        priorityElement.textContent = `Priority: ${newPriorityInput.value}`;
  
        // Remove the input elements and show the updated title, description, deadline, and priority
        replaceElement(newTitleInput, titleElement);
        replaceElement(newDescriptionInput, descriptionElement);
        replaceElement(newDeadlineInput, deadlineElement);
        replaceElement(newPriorityInput, priorityElement);
        saveButton.remove();
  
        // Move focus to the next input after saving
        newDeadlineInput.focus();
      }
  
      // Trigger saveEdit on Enter key press in the newTitleInput
      newTitleInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          newDescriptionInput.focus();
          event.preventDefault();
        }
      });
  
      // Trigger saveEdit on Enter key press in the newDescriptionInput
      newDescriptionInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          newDeadlineInput.focus();
          event.preventDefault();
        }
      });
  
      // Trigger saveEdit on Enter key press in the newDeadlineInput
      newDeadlineInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          newPriorityInput.focus();
          event.preventDefault();
        }
      });
  
      // Trigger saveEdit on Enter key press in the newPriorityInput
      newPriorityInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          saveEdit();
          event.preventDefault();
        }
      });
    }
  
    // Function to create an input element
    function createInput(type, value) {
      const input = document.createElement("input");
      input.type = type;
      input.value = value;
      return input;
    }
  
    // Function to create a textarea element
    function createTextarea(value) {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      return textarea;
    }
  
    // Function to create a priority dropdown element
    function createPriorityDropdown(selectedPriority) {
      const select = document.createElement("select");
      const priorities = ["low", "medium", "high"];
  
      for (const priority of priorities) {
        const option = document.createElement("option");
        option.value = priority;
        option.textContent = priority;
        if (priority === selectedPriority) {
          option.selected = true;
        }
        select.appendChild(option);
      }
  
      return select;
    }
  
    // Function to replace an element with another
    function replaceElement(oldElement, newElement) {
      oldElement.replaceWith(newElement);
    }
  });
  