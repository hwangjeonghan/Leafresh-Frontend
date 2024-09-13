import { defineStore } from "pinia";
import { ref } from 'vue';

export const useTodoStore = defineStore('todoStore', () => {
    const todos = ref([]);

    //새로운 할일을 추가
    const addTodo = (todo) => {
        todos.value.push({
            todoContent: todo.content,
            selectedDate: todo.selectedDate,
        });
    };

    //todo목록을 새로고침한다.
    const setTodos = (newTodos) => {
        todos.value = newTodos;
    }


    return {
        todos,
        addTodo,
        setTodos
    };
});


