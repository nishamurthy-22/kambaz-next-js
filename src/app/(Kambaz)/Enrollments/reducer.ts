/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  enrollments: [],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
    },
    addEnrollment: (state, { payload: { userId, courseId } }) => {
      if (!userId || !courseId) return;
      const exists = state.enrollments.some(
        (e: any) => String(e.user) === String(userId) && String(e.course) === String(courseId)
      );
      if (!exists) {
        const newEnrollment: any = {
          _id: uuidv4(),
          user: String(userId),
          course: String(courseId),
        };
        state.enrollments = [...state.enrollments, newEnrollment] as any;
      }
    },
    removeEnrollment: (state, { payload: { userId, courseId } }) => {
      if (!userId || !courseId) return;
      state.enrollments = state.enrollments.filter(
        (e: any) => !(String(e.user) === String(userId) && String(e.course) === String(courseId))
      ) as any;
    },
  },
});

export const { setEnrollments, addEnrollment, removeEnrollment } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
