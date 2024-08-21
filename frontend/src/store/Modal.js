import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  selectedStudent: null,
  openAddModal: false,
  openUpdateModal: false,
  selectUpdateStudent: null,
  openDeleteModal: false,
  selectedDeleteStudent: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.selectedStudent = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.selectedStudent = null;
    },
    openAddStudentModal: (state) => {
      state.openAddModal = true;
    },
    closeAddStudentModal: (state) => {
      state.openAddModal = false;
      state.selectedStudent = null;
    },
    openUpdateStudentModal: (state, action) => {
      state.openUpdateModal = true;
      state.selectUpdateStudent = action.payload;
    },
    closeUpdateStundetModal: (state) => {
      state.openUpdateModal = false;
      state.selectUpdateStudent = null;
    },
    openDeleteStudentModal: (state, action) => {
      state.openDeleteModal = true;
      // state.openUpdateModal = false; // Close update modal to open delete modal otherwise it will be open when we open delete modal
      state.selectedDeleteStudent = action.payload;
    },
    closeDeleteStudentModal: (state) => {
      state.openDeleteModal = false;
      state.selectedDeleteStudent = null;
    },
  },
});

export const {
  openModal,
  closeModal,
  openAddStudentModal,
  closeAddStudentModal,
  openUpdateStudentModal,
  closeUpdateStundetModal,
  openDeleteStudentModal,
  closeDeleteStudentModal,
} = studentSlice.actions;

export default studentSlice.reducer;
