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
    };


    // 서버에서 todo 목록을 가져온다
    const fetchTodos = async () =>{

        try{

            const token = localStorage.getItem('accessToken');
            const response = await axios.get ( `${import.meta.env.VITE_API_BASE_URL}/garden-diary/todo/today`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
           });

           if(response.status === 200 & Array.isArray(response.data)) {
            setTodos(response.data);
           }else{
            console.error('잘못된 데이터 형식:', response.data);
           }

        }catch(error){
            console.error('할일 목록을 가져오는 중 오류 발생', error);
        }

    };


    return {
        todos,
        addTodo,
        setTodos,
        fetchTodos
    };
});


