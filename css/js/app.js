// 待办事项应用
class TodoApp {
    constructor() {
        this.todos = [];
        this.filter = 'all';
        this.init();
    }

    init() {
        this.loadTodos();
        this.attachEventListeners();
        this.render();
    }

    attachEventListeners() {
        // 添加任务
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // 过滤按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filter = e.target.dataset.filter;
                this.render();
            });
        });

        // 搜索
        document.getElementById('searchInput').addEventListener('input', () => this.render());

        // 清空已完成
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const category = document.getElementById('categorySelect').value;
        const priority = document.getElementById('prioritySelect').value;
        const text = input.value.trim();

        if (!text) {
            alert('请输入任务内容');
            return;
        }

        const todo = {
            id: Date.now(),
            text,
            category,
            priority,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.render();
        input.value = '';
    }

    deleteTodo(id) {
        if (confirm('确定删除这个任务吗？')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveTodos();
            this.render();
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    clearCompleted() {
        if (confirm('确定要清空所有已完成的任务吗？')) {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveTodos();
            this.render();
        }
    }

    getFilteredTodos() {
        const searchText = document.getElementById('searchInput').value.toLowerCase();
        let filtered = this.todos;

        // 按状态过滤
        if (this.filter === 'active') {
            filtered = filtered.filter(todo => !todo.completed);
        } else if (this.filter === 'completed') {
            filtered = filtered.filter(todo => todo.completed);
        }

        // 按搜索词过滤
        if (searchText) {
            filtered = filtered.filter(todo =>
                todo.text.toLowerCase().includes(searchText) ||
                todo.category.toLowerCase().includes(searchText)
            );
        }

        return filtered;
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('totalCount').textContent = total;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('progressRate').textContent = rate + '%';
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            filteredTodos.forEach(todo => {
                const todoElement = this.createTodoElement(todo);
                todoList.appendChild(todoElement);
            });
        }

        this.updateStats();
    }

    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="app.toggleTodo(${todo.id})"
            >
            <div class="todo-content">
                <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                <div class="todo-meta">
                    <span class="todo-category">📁 ${todo.category}</span>
                    <span class="todo-priority ${todo.priority.toLowerCase()}">
                        ${todo.priority === '高' ? '🔴' : todo.priority === '中' ? '🟡' : '🟢'} 优先级：${todo.priority}
                    </span>
                </div>
            </div>
            <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">删除</button>
        `;
        return div;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const saved = localStorage.getItem('todos');
        this.todos = saved ? JSON.parse(saved) : [];
    }
}

// 初始化应用
const app = new TodoApp();
