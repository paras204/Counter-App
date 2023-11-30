module counter_addr::counter {

    use aptos_framework::account;
    use std::signer;
    use aptos_framework::event;
    use std::string::String;
    use aptos_std::table::{Self, Table};
    use std::string;
    const E_NOT_INITIALIZED: u64 = 1;
    const ETASK_DOESNT_EXIST: u64 = 2;
    const ETASK_IS_COMPLETED: u64 = 3;

    struct TodoList has key {
        task_counter: u64
    } 
    public entry fun create_list(account: &signer) {
        let todo_list = TodoList {
            task_counter: 0
        };
        move_to(account, todo_list);
    }
    public entry fun create_task(account: &signer, content: String) acquires TodoList {
        let signer_address = signer::address_of(account);
        assert!(exists<TodoList>(signer_address), E_NOT_INITIALIZED);
        let todo_list = borrow_global_mut<TodoList>(signer_address);
        let counter = todo_list.task_counter + 1;
    }
}