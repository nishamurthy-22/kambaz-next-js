import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentReducer from "./Courses/[cid]/Assignments/reducer";
import enrollmentsReducer from "./Enrollments/reducer";
const store = configureStore({
 reducer: { coursesReducer, modulesReducer, accountReducer, assignmentReducer, enrollmentsReducer,},
});
export type RootState = ReturnType<typeof store.getState>;
export default store;