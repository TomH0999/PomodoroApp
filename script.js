const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const modeBtn = document.getElementById('modeBtn');
const taskInput =document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');
const workPlaylist = [
    "Sounds/Work_Playlist/1.mp3",
    "Sounds/Work_Playlist/2.mp3",
    "Sounds/Work_Playlist/3.mp3",
    "Sounds/Work_Playlist/4.mp3",
    "Sounds/Work_Playlist/5.mp3"
]
const breakPlaylist = [
    "Sounds/Break_Playlist/1.mp3",
]

let currentAudio = null;
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkMode = true; // true for work mode, false for break mode
const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const alarmSound =  new Audio("Sounds/gong.mp3");

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
    document.title = `${formattedMinutes}:${formattedSeconds} - Pomodoro App`;
}

function startTimer() {
    if (timerId !== null) return;
    resumeBackgroundMusic();

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            alarmSound.play();
            if (isWorkMode) {
                switchMode(); // Switch to break mode automatically
                alert('Time is up! Take a break.');
            } else {
                switchMode(); // Switch back to work mode automatically
                alert('Break is over! Back to work.');
            }
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    pauseBackgroundMusic();
}

function resetTimer() {
    pauseTimer();
    stopBackgroundMusic();
    timeLeft = isWorkMode ? WORK_TIME : BREAK_TIME;
    updateDisplay();
}

function switchMode() {
    pauseTimer();
    stopBackgroundMusic();
    isWorkMode = !isWorkMode;
    if (isWorkMode) {
        timeLeft = WORK_TIME;
        document.getElementById('timer-title').textContent = 'Work Timer';
    } else {
        timeLeft = BREAK_TIME;
        document.getElementById('timer-title').textContent = 'Break Timer';
    }
    updateDisplay();
}

function getRandomTrack(playlist) {
    const randomIndex = Math.floor(Math.random() * playlist.length);
    return playlist[randomIndex];
}

function playBackgroundMusic() {
    if (currentAudio && !currentAudio.ended) return;
    const playlist = isWorkMode ? workPlaylist : breakPlaylist;
    const trackUrl = getRandomTrack(playlist);
    currentAudio = new Audio(trackUrl);
    currentAudio.loop = false;
    currentAudio.volume = 0.5;
    currentAudio.addEventListener('ended', () => {
        setTimeout(playBackgroundMusic, 1000); // Play next track after 1 second
    });
    currentAudio.play().catch(error => {
        console.log('Error playing audio (interaction required):', error);
    });
}

function stopBackgroundMusic() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function pauseBackgroundMusic() {
    if (currentAudio) {
        currentAudio.pause();
    }
}

function resumeBackgroundMusic() {
    if (currentAudio) {
        currentAudio.play();
    } else {
        playBackgroundMusic();
    }
}

function createTaskElement(text) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = text;
    span.style.flexGrow = '1';

    span.addEventListener('click', function(e){
        e.stopPropagation();
        li.classList.toggle('completed');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = 'Delete task';

    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        li.remove();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    li.addEventListener('click', function() {
        li.classList.toggle('completed');
    });
    
    return li;
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = createTaskElement(taskText);
    taskList.appendChild(newTask);
    taskInput.value = "";
    taskInput.focus();
}

function clearAllTasks() {
    if (taskList.children.length === 0) return;

    if (confirm("Are you sure you want to delete all tasks?")) {
        taskList.innerHTML = "";
    }
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
modeBtn.addEventListener('click', switchMode);
addTaskBtn.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
clearAllBtn.addEventListener('click', clearAllTasks);

updateDisplay();