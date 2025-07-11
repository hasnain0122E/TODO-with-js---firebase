1. Start with Firebase Setup
2. HTML AND CSS
3. DOM Element References
4. App State
5. addItem(event) -> Start with adding a new todo to Firestore.

loadTodos() -> Create function to load todos using Firestore onSnapshot.

renderTodos() + createTodoElement(todo) -> To display todos on screen.

toggleTodo(todoId) -> To change todo status (active <-> completed)

deleteTodo(todoId) -> To remove a todo from Firestore.

6. Filters + Counters
getFilteredTodos() -> Handles logic for filters.

setActiveFilter(filter) -> Attach this to filter buttons.

updateItemsLeft() -> Updates the item count below the list.

