import { defineStore } from "pinia";
import { ref } from 'vue';

export const useTodoStore = defineStore('todoStore', () => {
    const todos = ref([]);

    //새로운 할일을 추가
    const addTodo = (todo) => {
        todos.value.push({
            content: todo.content,
            selectedDate: todo.selectedDate,
        });
    };


    return {
        todos,
        addTodo,
    };
});


