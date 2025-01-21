/* Handling my index db */

export class taskMangerDb {

    constructor() {
        this.db = null;
        this.transaction = null;
        this.openDb()
    }

    /* Opening and configuring the db */
    openDb() {
        if(this.db) {
            return this.db;
        }

        return new Promise((resolve, reject) => {
            

            const request = window.indexedDB.open("TaskManager", 1);

            request.onerror = (event) => {
                console.error("an error occurred while opening index db", event);
                reject("error opening index db");
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
                console.log("index db opened successfully ", this.db);
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                const taskStore = this.db.createObjectStore("tasks", { keyPath: "id",autoIncrement: true });
            
                taskStore.createIndex("category", "dueDate", { unique: false });
                taskStore.createIndex("status", "status", { unique: false });
                taskStore.createIndex("priority", "priority", { unique: false });
            
        };

        

        })

        
    }

    /* adding new task to db */
    addTask(data) {
        this.transaction = this.db.transaction("tasks", "readwrite");
        const taskStore = this.transaction.objectStore("tasks");
        taskStore.add(data);
        
        alert("Added task")
    }

    /* querying all tasksfrom table */
    getAllTasks() {
        return new Promise((resolve, reject) => {
            this.openDb().then((db) => {
                let allTask;
                const taskStore = db.transaction("tasks").objectStore("tasks");
    
                taskStore.getAll().onsuccess = (event) => {
                allTask = event.target.result ;
                resolve(allTask);
            }
            })
        });

    }

    /* getting a task by id */
    getTask(taskId) {
        
        return new Promise((resolve, reject) => {
            this.openDb().then(db => {

                this.transaction = db.transaction("tasks");
                const taskStore = this.transaction.objectStore("tasks");
                let request = taskStore.get(taskId)

                request.onsuccess = (event) => {
                    resolve(event.target.result);
                    return event.target.result;

                };
                request.onerror = (event) => {
                    console.error("Error getting task", event);
                    reject("Error getting task");
                };
                })
            
        });

        

    }

    /* getting all task by status */
    getByIndex(method,object) {
        this.transaction = this.db.transaction("tasks");
        const taskStore = this.transaction.objectStore("tasks");

        let request;
        if(method === "status") {
            request = taskStore.index("status").getAll(object);

        } else if(method === "category") {
            request = taskStore.index("status").getAll(object);

        } else if (method === "priority") {
            request = taskStore.index("priority").getAll(object);
        }

        request.onsuccess = (event) => {
            let allTask = event.target.result
            return allTask;
            
        };
    }

    /* deleting a task by id */
    deleteTask(taskId) {
        this.transaction = this.db.transaction("tasks", "readwrite");
        const taskStore = this.transaction.objectStore("tasks");
        taskStore.delete(taskId);
        
        alert("Deleted task")
    }

    /* update a task entry by field */
    updateTaskEntry(field,data,taskId) {
        this.transaction = this.db.transaction("tasks", "readwrite");
        const taskStore = this.transaction.objectStore("tasks");
        let request = taskStore.get(taskId)

        request.onsuccess = ( event )=> {
            const task = event.target.result;
            task[field] = data;
            taskStore.put(task);
        };
    }

    /* update a task inner entry by field */
    updateInnerTaskEntry(field,data,taskId,index) {
        this.transaction = this.db.transaction("tasks", "readwrite");
        const taskStore = this.transaction.objectStore("tasks");
        let request = taskStore.get(taskId)
        
        request.onsuccess = (event )=> {
            const task = event.target.result;
            task[field][index].done = data;
            taskStore.put(task);
        };
    }
}


/* My methods formats */
//setTimeout(() => db.addTask(newTask) , 200);

// setTimeout(() => db.deleteTask(1),200);

//setTimeout(() => db.updateTaskEntry("subtasks","medium",2),200);

// setTimeout(() => db.updateInnerTaskEntry("subtasks",true,1,0),200)

// setTimeout(() => db.getAllTRasks(),300)

// setTimeout(() => db.getTask(3), 200);

// setTimeout(() => db.getByIndex("status","not started"),200);


// db.getTask(2).then( task => console.log(task));





