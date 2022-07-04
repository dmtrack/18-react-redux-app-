import { createAction, createSlice } from "@reduxjs/toolkit";
import todosService from "../services/todos.service";
import { setError } from "./errors";
import { logger } from "./middleWare/logger";

const initialState = { entities: [], isLoading: false };
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    recieved(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    update(state, action) {
      const elementIndex = state.entities.findIndex(
        (el) => el.id === action.payload.id
      );
      state.entities[elementIndex] = {
        ...state.entities[elementIndex],
        ...action.payload,
      };
    },
    create(state, action) {
      state.entities[state.entities.length] = {
        ...action.payload,
      };
    },
    remove(state, action) {
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    taskRequested(state) {
      state.isLoading = true;
    },
    taskRequestFailed(state, action) {
      state.isLoading = false;
    },
  },
});

const { actions, reducer: taskReducer } = taskSlice;
const { update, remove, recieved, taskRequestFailed, taskRequested, create } =
  actions;

export const loadTasks = () => async (dispatch) => {
  dispatch(taskRequested());
  try {
    const data = await todosService.fetch();
    dispatch(recieved(data));
  } catch (error) {
    dispatch(taskRequestFailed(error.message));
    dispatch(setError(error.message));
  }
};

export const completeTask = (id) => (dispatch, getState) => {
  dispatch(update({ id: id, completed: true }));
};

export function titleChanged(id) {
  return update({ id: id, title: `New title for ${id}` });
}

export async function taskCreated(dispatch) {
  const data = await todosService.create().then((responce) => responce);
  dispatch(create({ id: data.id, title: "New title", completed: false }));
}

export function taskDeleted(id) {
  return remove({ id: id });
}

export const getTasks = () => (state) => state.tasks.entities;
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading;
export default taskReducer;
