import {app, db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, where} from "./firebase.js";
import { getAuth, onAuthStateChanged } from "./firebase.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in as:", user.email);

        // ✅ Pass user.uid to loadTodos
        loadTodos(user.uid);

        // ✅ Also bind user.uid to additem
        window.additem = (e) => additem(e, user.uid);

        setupEventListeners();
    } else {
        // User not logged in → redirect
        window.location.href = "login_signup.html"; // or your login page
    }
});


const todoInput = document.getElementById("todo-Input");
const todoItemsContainer = document.querySelector(".todo-items");
const itemsLeftCounter = document.querySelector(".items-left");
const filterButtons = document.querySelectorAll(".items-statuses span");
const clearCompletedBtn = document.querySelector(".items-clear span");
const themeToggle = document.querySelector(".theme img");

let todos = []; //isme hum apne todos add krenge
let currentFilter = "all"; //to show all todos in starting


//webpage load hone pr todos and buttons active krna

document.addEventListener("DOMContentLoaded", () => {
    console.log("todoInput:", todoInput);   
    loadTodos()
    setupEventListeners()
})

//forEach = Har button ke liye
// addEventListener("click") = Click ka intezaar kar
// e.target.textContent = Button par jo likha hai wo le (jaise "All", "Active")
// toLowerCase() = Chhote letters mein convert kar ("ALL" → "all")

// Setup event listeners
function setupEventListeners() {
    filterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            setActiveFilter(e.target.textContent.toLowerCase())
        })
    })

    // clear completed buttons
    clearCompletedBtn.addEventListener("click", clearCompleted)

    //Theme toggle 
    themeToggle.addEventListener("click", toggleTheme)
}

//add todo

async function additem(event, uid) {
    event.preventDefault();

    if (!todoInput.value.trim()) return;

    try {
        await addDoc(collection(db, "todos"), {
            todo: todoInput.value.trim(),
            status: "active",
            uid: uid, // Store user ID
            createdAt: new Date()
        });

        todoInput.value = "";

    } catch (e) {
        console.error("Error adding todo:", e);
    }
}

//load todo from firebase

function loadTodos(uid) {
    const q = query(collection(db, "todos"), where("uid", "==", uid));

    onSnapshot(q, (snapshot) => {
        todos = [];
        snapshot.forEach((doc) => {
            todos.push({ id: doc.id, ...doc.data() });
        });

        todos.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                return b.createdAt.toDate() - a.createdAt.toDate();
            }
            return 0;
        });

        renderTodos();
        updateItemsLeft();
    });
}


//create todo element
function createTodoElement(todo) {
    const todoItem = document.createElement("div")
    todoItem.className = "todo-item"
    todoItem.dataset.id = todo.id

    const isCompleted = todo.status === "completed"

    todoItem.innerHTML = `
    <div class="check">
            <div class="check-mark ${isCompleted ? 'completed' : ''}" onclick="toggleTodo('${todo.id}')">
                ${isCompleted ? '<img src="./assets/icon-check.svg" alt="">' : ''}
            </div>
        </div>
        <div class="todo-text ${isCompleted ? 'completed' : ''}">
            ${todo.todo}
        </div>
        <div class="delete-btn" onclick="deleteTodo('${todo.id}')">
            <img src="./assets/icon-cross.svg" alt="Delete" style="width: 18px; height: 18px; cursor: pointer;">
        </div>`

        return todoItem
}


// Get filtered todos based on current filter

function getFilteredTodos() {
    switch (currentFilter) {
        case "active":
            return todos.filter(todo => todo.status === "active")
        case "completed":
            return todos.filter(todo => todo.status === "completed")
        default:
            return todos
    }
}

// render TODOS

function renderTodos() {

    const filteredTodos = getFilteredTodos()

    todoItemsContainer.innerHTML = ""

    filteredTodos.forEach(todo => {
        const todoElement = createTodoElement(todo)
        todoItemsContainer.appendChild(todoElement)
    })
}

// Delete todo
async function deleteTodo(todoId) {
    try {
        await deleteDoc(doc(db, "todos", todoId));
        console.log("Todo deleted successfully");
        
    } catch (e) {
        console.error("Error deleting todo: ", e);
    }
}


// Clear completed todos
async function clearCompleted() {
    try {
        const completedTodos = todos.filter(todo => todo.status === "completed");
        
        // Delete all completed todos
        const deletePromises = completedTodos.map(todo => 
            deleteDoc(doc(db, "todos", todo.id))
        );
        
        await Promise.all(deletePromises);
        console.log("Completed todos cleared successfully");
        
    } catch (e) {
        console.error("Error clearing completed todos: ", e);
    }
}

// Toggle todo status
async function toggleTodo(todoId) {
    try {
        const todo = todos.find(t => t.id === todoId);
        if (!todo) return;
        
        const newStatus = todo.status === "active" ? "completed" : "active";
        
        await updateDoc(doc(db, "todos", todoId), {
            status: newStatus
        });
        
        console.log("Todo updated successfully");
        
    } catch (e) {
        console.error("Error updating todo: ", e);
    }
}

// Set active filter
function setActiveFilter(filter) {
    currentFilter = filter;
    
    // Update active button style
    filterButtons.forEach(button => {
        button.classList.remove("active");
        if (button.textContent.toLowerCase() === filter) {
            button.classList.add("active");
        }
    });
    
    renderTodos();
}

// Update items left counter
function updateItemsLeft() {
    const activeCount = todos.filter(todo => todo.status === "active").length;
    itemsLeftCounter.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
}


function toggleTheme() {
    const body = document.body;
    const backgroundImg = document.querySelector(".background-img img");
    
    if (body.classList.contains("light-theme")) {
        // Switch to dark theme
        body.classList.remove("light-theme");
        backgroundImg.src = "./assets/bg-desktop-dark.jpg";
        themeToggle.src = "./assets/icon-sun.svg";
    } else {
        // Switch to light theme
        body.classList.add("light-theme");
        backgroundImg.src = "./assets/bg-desktop-light.jpg";
        themeToggle.src = "./assets/icon-moon.svg";
    }
}




window.additem = additem;
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;