# Todo List App

This is a simple React app for managing daily tasks. You can add new tasks, mark them as done, edit them, delete them, and search through them.

## What the project does

- Add a new todo task
- Edit an existing task
- Delete a task
- Mark a task as complete or active
- Filter tasks by All, Active, and Completed
- Search tasks by text
- Save tasks in the browser using `localStorage`

## How it works

1. Type a task in the input box and click **Add**.

   <img src="images/1.png" width="600">
   
3. The task appears in the list below.

    <img src="images/2.png" width="600">

5. Use the checkbox to mark the task as done.

   <img src="images/3.png" width="600">
   
7. Click **Edit** to change the task text.

   <img src="images/4.png" width="600">
   
9. Click **Delete** to remove a task.
    
10. Use the filter buttons to show only the tasks you want.
    
    <img src="images/6a.png" width="600">
    <img src="images/6b.png" width="600">
    <img src="images/6c.png" width="600">
    
12. Use the search box to find a task quickly.

    <img src="images/7.png" width="600">
  
14. The app saves your tasks in the browser, so they stay after refresh.

## Demo

![Todo App Demo](images/demo.gfi)

## Project files

- `src/App.jsx` - main todo app logic and UI
- `src/styles.css` - app styling
- `src/main.jsx` - app entry file

## How to run

Install packages first:

```bash
npm install
```

Start the app in development mode:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Notes

- This is a web app made with React and Vite.
- Your tasks are stored only in this browser.
