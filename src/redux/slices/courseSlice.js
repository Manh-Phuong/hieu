import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    updateListCourse: '',
    updateListCourseStar: '',
    updateListCourseTrash: '',
    updateListChapter: '',
    course: null,
    chapter: null,
    question: null,
    updateListQuestion: '',
    questionUpdate: null,
    createQuestion: '',
    editQuestion: '',
    isModalUpdateQuestion: false,
    isModalCopyQuestion: false,
};

export const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        setUpdateListCourse: (state, action) => {
            state.updateListCourse = action.payload;
        },
        setUpdateListCourseStar: (state, action) => {
            state.updateListCourseStar = action.payload;
        },
        setUpdateListCourseTrash: (state, action) => {
            state.updateListCourseTrash = action.payload;
        },
        setUpdateListChapter: (state, action) => {
            state.updateListChapter = action.payload;
        },
        setCourse: (state, action) => {
            state.course = action.payload;
        },
        setChapter: (state, action) => {
            state.chapter = action.payload;
        },
        setQuestion: (state, action) => {
            state.question = action.payload;
        },
        setUpdateListQuestion: (state, action) => {
            state.updateListQuestion = action.payload;
        },
        setQuestionUpdate: (state, action) => {
            state.questionUpdate = action.payload;
        },
        setCreateQuestion: (state, action) => {
            state.createQuestion = action.payload;
        },
        setEditQuestion: (state, action) => {
            state.editQuestion = action.payload;
        },
        setModalUpdateQuestion: (state, action) => {
            state.isModalUpdateQuestion = action.payload;
        },
        setModalCopyQuestion: (state, action) => {
            state.isModalCopyQuestion = action.payload;
        },
        setChangeInfoQuestion: (state, action) => {
            console.log('action.payload', action.payload);

            if (action.payload.active !== undefined) {
                console.log('action.payload.active', action.payload.active);
                state.questionUpdate.active = action.payload.active;
            }
            if (action.payload.answers !== undefined) {
                state.questionUpdate.answers = action.payload.answers;
            }
            if (action.payload.defaultAnswer !== undefined) {
                state.questionUpdate.defaultAnswer = action.payload.defaultAnswer;
            }
            if (action.payload.level !== undefined) {
                state.questionUpdate.level = action.payload.level;
            }
            if (action.payload.questionImage !== undefined) {
                state.questionUpdate.questionImage = action.payload.questionImage;
            }
            if (action.payload.questionText !== undefined) {
                state.questionUpdate.questionText = action.payload.questionText;
            }
            if (action.payload.questionType !== undefined) {
                state.questionUpdate.questionType = action.payload.questionType;
            }
        },
        setChangeAnswer: (state, action) => {
            const answer = state.questionUpdate.answers.find((it) => it.id === action.payload.id);
            console.log('action.payload', action.payload);
            console.log('answer', answer);
            if (answer) {
                if (action.payload.value !== undefined) {
                    answer.value = action.payload.value;
                }
                if (action.payload.isCorrect !== undefined) {
                    answer.isCorrect = action.payload.isCorrect;
                }
            }
        },
        deleteAnswer: (state, action) => {
            const answer = state.questionUpdate.answers.find((it) => it.id === action.payload);
            console.log('action.payload', action.payload);
            console.log('answer', answer);
            if (answer) {
                state.questionUpdate.answers = state.questionUpdate.answers.filter(
                    (answer) => answer.id !== action.payload,
                );
            }
        },
    },
});

export const {
    setUpdateListCourse,
    setUpdateListCourseStar,
    setUpdateListCourseTrash,
    setUpdateListChapter,
    setCourse,
    setChapter,
    setQuestion,
    setUpdateListQuestion,
    setQuestionUpdate,
    setCreateQuestion,
    setEditQuestion,
    setModalUpdateQuestion,
    setChangeInfoQuestion,
    setChangeAnswer,
    setModalCopyQuestion,
    deleteAnswer,
} = courseSlice.actions;

export default courseSlice.reducer;
