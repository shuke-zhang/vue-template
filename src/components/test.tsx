import { defineComponent, ref } from 'vue';

interface User {
  id: number;
  name: string;
}

export default defineComponent({
  name: 'TestComponent',
  setup() {
    const users = ref<User[]>([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);

    const addUser = () => {
      const newUser: User = {
        id: users.value.length + 1,
        name: `User ${users.value.length + 1}`,
      };
      users.value = [...users.value, newUser];
    };

    const sss = ref(0);

    // 新增点击事件处理函数
    const handleClick = () => {
      console.log('Div clicked');
    };

    return () => (
      <div onClick={handleClick} class="user-list-container" id="userList">
        <h1>User List</h1>
        <ul>
          {users.value.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
        <button onClick={addUser}></button>
      </div>
    );
  },
});
