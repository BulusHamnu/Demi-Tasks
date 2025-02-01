/* Handling my index db */
import {changeDateFormat} from "../src/utils/functions.js";

export class taskMangerDb {

    constructor() {
        this.db = null;
        this.transaction = null;
        this.openDb()
    }

    /* Opening and configuring the db */
    openDb() {
        

        return new Promise((resolve, reject) => {
            if(this.db) {
                resolve(this.db);
                return
            }

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

                if(!this.db.objectStoreNames.contains("tasks")) {
                    const taskStore = this.db.createObjectStore("tasks", { keyPath: "id",autoIncrement: true });
            
                    taskStore.createIndex("category", "category", { unique: false });
                    taskStore.createIndex("status", "status", { unique: false });
                    taskStore.createIndex("priority", "priority", { unique: false });
                }
                

                if(!this.db.objectStoreNames.contains("categories")) {

                    const categoryStore = this.db.createObjectStore("categories", { keyPath: "id",autoIncrement: true });

                    const moreCategories = [
                        {
                          name: "💼 business"
                        },
                        {
                          name: "👤 personal"
                        },
                        {
                          name: "🗂️ projects"
                        },
                        {
                          name: "🏋 fitness"
                        },
                        {
                          name: "🔍 research"
                        },
                        {
                          name: "🎨 hobbies"
                        },
                        {
                          name: "🎓 education"
                        },
                        {
                          name: "🛠️maintenance"
                        },
                        {
                          name: "📖 writing"
                        },
                      
                      ];
                    
                    moreCategories.forEach( category => {
                        categoryStore.add(category);
                    });
                }

                
            
        };

        

        })

        
    }

    /* adding new task to db */
    addTask(data) {
        return new Promise((resolve, reject) => {
            this.transaction = this.db.transaction("tasks", "readwrite")
            const taskStore = this.transaction.objectStore("tasks");

            const request = taskStore.add(data)
            request.onsuccess = (event) => {

                this.transaction.oncomplete = () => {
                    console.log("Transaction completed.");
                    resolve("saved");
                };

            }

            request.onerror = (event) => {
                console.error("error adding task", event);
                reject("not saved");
            }
        })
    }

    /* querying all tasksfrom table */
    getAllTasks(sort) {
        return new Promise((resolve, reject) => {
            this.openDb().then((db) => {
                let allTask;
                const taskStore = db.transaction("tasks").objectStore("tasks");
    
                taskStore.getAll().onsuccess = (event) => {
                allTask = event.target.result ;
                if(sort === "all") {
                    resolve(allTask);
                } else {
                    resolve(allTask.filter(task => task.category === sort));
                }
            }
            })
        });

    }

    /* search for a task */
    searchTask(search,filter) {
        return new Promise((resolve, reject) => {
            const taskStore = this.db.transaction("tasks").objectStore("tasks");
            let request = taskStore.getAll();

            request.onsuccess = (event) => {
                let result = event.target.result;
                let results2;

                if(filter === "dueDate") {
                    results2 = result = result.filter(task => {
                        let k = changeDateFormat(task[filter]).toLowerCase();
                        return k.includes(search);
                    });

                    resolve(results2);
                } else {
                    results2 = result.filter(task => {
                        return task[filter].toLowerCase().includes(search.toLowerCase())
                    })
    
                    resolve(results2);
                }

                
            }
        })
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
    getByIndex(method,object,sort) {
        return new Promise((resolve, reject) => {
            this.openDb().then((db) => {
                this.transaction = this.db.transaction("tasks");
                const taskStore = this.transaction.objectStore("tasks");

                let request;
                if(method === "status") {
                    request = taskStore.index("status").getAll(object);

                } else if(method === "category") {
                    request = taskStore.index("category").getAll(object);

                } else if (method === "priority") {
                    request = taskStore.index("priority").getAll(object);
                }

                request.onsuccess = (event) => {
                    let allTask = event.target.result
                    if(sort == "all") {
                        resolve(allTask);
                    } else {
                        resolve(allTask.filter(task => task.category === sort));
                    }
                    
                };
            });
        });
    }

    /* deleting a task by id */
    deleteTask(taskId) {
        return new Promise((resolve, reject) => {
            this.transaction = this.db.transaction("tasks", "readwrite");
            const taskStore = this.transaction.objectStore("tasks");
            let request = taskStore.delete(taskId);
            
            request.onsuccess = (event) => {
                resolve("Deleted task");
            }
        })
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

    /* Updating task */
    updateTask(taskId,taskDetails) {
        return new Promise((resolve, reject) => {
            this.transaction = this.db.transaction("tasks", "readwrite");
            const taskStore = this.transaction.objectStore("tasks");
            let request = taskStore.get(taskId);

            request.onsuccess = (event) => {
                const task = event.target.result;
                Object.assign(task, taskDetails);
                taskStore.put(task);
                resolve("task updated");
            }
        })
    }

    /* update a task inner entry by field */
    updateInnerTaskEntry(field,data,taskId,index) {
        return new Promise((resolve, reject) => {
            this.transaction = this.db.transaction("tasks", "readwrite");
            const taskStore = this.transaction.objectStore("tasks");
            let request = taskStore.get(taskId)
            
            request.onsuccess = (event )=> {
                const task = event.target.result;
                task[field][index].done = data;
                taskStore.put(task);
                resolve(task);
            };
        })
    }

    deleteSubTask(taskId,subTaskId) {
        return new Promise((resolve, reject) => {
            this.transaction = this.db.transaction("tasks", "readwrite");
            const taskStore = this.transaction.objectStore("tasks");
            let request = taskStore.get(taskId);

            request.onsuccess = (event)=> {
                const task = event.target.result;
                task.subTasks.splice(subTaskId,1)

                console.log(task);
                taskStore.put(task);
                resolve(task);

            }
        })
    }

    addSubTask(taskId,subTaskName) {
        return new Promise((resolve, reject) => {
            this.transaction = this.db.transaction("tasks", "readwrite");
            const taskStore = this.transaction.objectStore("tasks");
            let request = taskStore.get(taskId);

            request.onsuccess = (event)=> {
                const task = event.target.result;
                task.subTasks.push({title: subTaskName, done: false})
                taskStore.put(task);
                resolve(task);
            }
    
    });
    }

    /* getting all category */ 
    getAllCategories() {
        return new Promise((resolve, reject) => {
            this.openDb().then(db => {
                let categoriesStore = db.transaction("categories", "readwrite").objectStore("categories");
                let request = categoriesStore.getAll();

                request.onsuccess = (event) => {
                    resolve(event.target.result);
                }

                request.onerror = (event) => {
                    reject([]);
                }

            })
        });
    }

    /* deleting a category */
    deleteCategory(categoryId) {
        
        return new Promise((resolve, reject) => {
            let categoriesStore = this.db.transaction("categories", "readwrite").objectStore("categories");
            let request = categoriesStore.delete(categoryId);

            request.onsuccess = (event) => {
                resolve("success")
            };

            request.onerror = (event) => {
                reject("error");
            }
        });
    }

    addNewCategory(category) {
        return new Promise((resolve, reject) => {
            let categoriesStore = this.db.transaction("categories", "readwrite").objectStore("categories");
            let request = categoriesStore.add(category);
            request.onsuccess = (event) => {
                resolve("success")
            };
            request.onerror = (event) => {
                reject("error");
            }
        });
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





