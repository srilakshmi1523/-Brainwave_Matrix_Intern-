document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();
    const tasksList = document.getElementById('tasksList');
    const taskInput = document.getElementById('taskInput');
    const taskTime = document.getElementById('taskTime');
    const taskCategory = document.getElementById('taskCategory');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const currentDateElement = document.getElementById('currentDate');
    const prevDayBtn = document.getElementById('prevDay');
    const nextDayBtn = document.getElementById('nextDay');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    function saveTasksToStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    function updateDateDisplay() {
        currentDateElement.textContent = formatDate(currentDate);
    }

    function renderTasks() {
        const currentDateStr = currentDate.toDateString();
        const filteredTasks = tasks.filter(task => new Date(task.date).toDateString() === currentDateStr);
        
        tasksList.innerHTML = filteredTasks
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <div class="task-content">
                        <span class="task-time">${task.time}</span>
                        <span class="task-category ${task.category}">${task.category}</span>
                        <span class="task-text">${task.text}</span>
                    </div>
                    <div class="task-actions">
                        <button class="complete-btn" onclick="toggleTaskComplete('${task.id}')">
                            ${task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
    }

    function addTask() {
        if (!taskInput.value.trim()) return;

        const newTask = {
            id: Date.now().toString(),
            text: taskInput.value.trim(),
            time: taskTime.value || '00:00',
            category: taskCategory.value,
            date: currentDate.toISOString(),
            completed: false
        };

        tasks.push(newTask);
        saveTasksToStorage();
        renderTasks();

        taskInput.value = '';
        taskTime.value = '';
    }

    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    prevDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
        renderTasks();
    });

    nextDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDateDisplay();
        renderTasks();
    });

    // Global functions for task actions
    window.toggleTaskComplete = (taskId) => {
        tasks = tasks.map(task => 
            task.id === taskId 
                ? { ...task, completed: !task.completed }
                : task
        );
        saveTasksToStorage();
        renderTasks();
    };

    window.deleteTask = (taskId) => {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasksToStorage();
        renderTasks();
    };

    // Initial render
    updateDateDisplay();
    renderTasks();
});