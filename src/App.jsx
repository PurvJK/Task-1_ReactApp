import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'task-1-reactapp-todos';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

function createTodo(text) {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
  };
}

function loadTodos() {
  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    return storedTodos ? JSON.parse(storedTodos) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const stats = useMemo(() => {
    const completedCount = todos.filter((todo) => todo.completed).length;
    return {
      total: todos.length,
      active: todos.length - completedCount,
      completed: completedCount,
    };
  }, [todos]);

  const visibleTodos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return todos.filter((todo) => {
      const matchesSearch = normalizedSearch === '' || todo.text.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);

      return matchesSearch && matchesFilter;
    });
  }, [todos, search, filter]);

  const handleAddTodo = (event) => {
    event.preventDefault();

    const nextText = draft.trim();
    if (!nextText) {
      return;
    }

    setTodos((currentTodos) => [createTodo(nextText), ...currentTodos]);
    setDraft('');
  };

  const handleToggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText('');
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = (id) => {
    const nextText = editingText.trim();

    if (!nextText) {
      handleDeleteTodo(id);
      return;
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === id ? { ...todo, text: nextText } : todo)),
    );
    setEditingId(null);
    setEditingText('');
  };

  const handleClearCompleted = () => {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
  };

  const handleToggleAll = () => {
    const shouldCompleteAll = stats.active > 0;

    setTodos((currentTodos) =>
      currentTodos.map((todo) => ({
        ...todo,
        completed: shouldCompleteAll,
      })),
    );
  };

  const allCompleted = todos.length > 0 && stats.completed === todos.length;

  return (
    <div className="app-shell">
      <header className="hero card">
        <div>
          <p className="eyebrow">Task Manager</p>
          <h1>Todo List</h1>
          <p className="hero-copy">
            Add tasks, edit them inline, filter by status, search instantly, and keep everything saved on this device.
          </p>
        </div>

        <div className="stats">
          <div>
            <strong>{stats.total}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>{stats.active}</strong>
            <span>Active</span>
          </div>
          <div>
            <strong>{stats.completed}</strong>
            <span>Done</span>
          </div>
        </div>
      </header>

      <main className="content-grid">
        <section className="card">
          <form className="todo-form" onSubmit={handleAddTodo}>
            <label className="sr-only" htmlFor="todo-input">
              Add a task
            </label>
            <input
              id="todo-input"
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Add a new task..."
            />
            <button type="submit">Add</button>
          </form>

          <div className="toolbar">
            <div className="search-box">
              <label className="sr-only" htmlFor="search-input">
                Search tasks
              </label>
              <input
                id="search-input"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks"
              />
            </div>

            <button className="ghost-button" type="button" onClick={handleToggleAll} disabled={todos.length === 0}>
              {allCompleted ? 'Mark all active' : 'Mark all complete'}
            </button>
          </div>

          <div className="filters" role="tablist" aria-label="Todo filters">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={filter === item.key ? 'filter active' : 'filter'}
                onClick={() => setFilter(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <ul className="todo-list">
            {visibleTodos.length === 0 ? (
              <li className="empty-state">
                <h2>No tasks found</h2>
                <p>Try a different search, change the filter, or add a new task.</p>
              </li>
            ) : (
              visibleTodos.map((todo) => {
                const isEditing = editingId === todo.id;
          
                return (
                  <li key={todo.id} className={todo.completed ? 'todo-item completed' : 'todo-item'}>
                    <label className="todo-check">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id)}
                      />
                      <span />
                    </label>

                    <div className="todo-body">
                      {isEditing ? (
                        <input
                          className="edit-input"
                          type="text"
                          value={editingText}
                          autoFocus
                          onChange={(event) => setEditingText(event.target.value)}
                          onBlur={() => saveEdit(todo.id)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              saveEdit(todo.id);
                            }

                            if (event.key === 'Escape') {
                              setEditingId(null);
                              setEditingText('');
                            }
                          }}
                        />
                      ) : (
                        <button type="button" className="todo-text" onClick={() => handleToggleTodo(todo.id)}>
                          {todo.text}
                        </button>
                      )}
                    </div>

                    <div className="todo-actions">
                      <button type="button" className="icon-button" onClick={() => startEditing(todo)}>
                        Edit
                      </button>
                      <button type="button" className="icon-button danger" onClick={() => handleDeleteTodo(todo.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          <footer className="footer-actions">
            <p>
              {stats.active} item{stats.active === 1 ? '' : 's'} left
            </p>
            <button type="button" className="ghost-button" onClick={handleClearCompleted} disabled={stats.completed === 0}>
              Clear completed
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}