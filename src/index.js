import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import configireStore from "./store/store";
import {
  titleChanged,
  taskDeleted,
  completeTask,
  getTasks,
  loadTasks,
  taskCreated,
  getTasksLoadingStatus,
} from "./store/task";
import { Provider, useSelector, useDispatch } from "react-redux";
import { getError } from "./store/errors";

const store = configireStore();

const App = (params) => {
  const state = useSelector(getTasks());
  const error = useSelector(getError());
  const dispatch = useDispatch();
  const isLoading = useSelector(getTasksLoadingStatus());

  useEffect(() => {
    dispatch(loadTasks());
  }, []);

  const changeTitle = (taskId) => {
    dispatch(titleChanged(taskId));
  };
  const deleteTask = (taskId) => {
    dispatch(taskDeleted(taskId));
  };
  const createTask = () => {
    dispatch(taskCreated);
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <>
      <h1>App</h1>
      <p>
        <button onClick={() => createTask()}>Create task</button>
      </p>
      <ul>
        {state.map((el) => (
          <li key={el.id}>
            <p>{el.title}</p>
            <p>{`Completed: ${el.completed}`}</p>{" "}
            <button onClick={() => dispatch(completeTask(el.id))}>
              Complete
            </button>
            <button onClick={() => changeTitle(el.id)}>Change title</button>
            <button onClick={() => deleteTask(el.id)}>Delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
