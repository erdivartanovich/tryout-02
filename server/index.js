/**
 * Import required library which is express & body parser
 */
import express from 'express';
import bodyParser from 'body-parser';


//define fake database holder with seeder data
const database = [
    {id: 1, task: 'Welcome to ToDo App, this is your first pre-existing task!'},
    {id: 2, task: 'Do Something else dude, just try it!'}
]



//define database crud method

const addTask = (taskObj) => {
    //assign new id for new task
    let maxID = 0;
    database.forEach((item) => {
        if (item.id > maxID) {
            maxID = item.id;
        }
    })
    let idx = maxID + 1;
    const toAdd = {id: idx, task: taskObj.task}
    database.push(toAdd);
    console.log('add operation success', toAdd);
    return toAdd;
}

const updateTask = (taskObj) => {
    database.forEach(task => {
        if (task.id  == taskObj.id) {
            task.task =  taskObj.task;
        }
    });
    console.log('edit operation success');
    return(database);
}

const deleteTask = (id) => {
    database.forEach((task, index) => {
        if (task.id  == id) {
            database.splice(index,1)
        }
    });
    console.log('delete operation success');
    return(database);
}

/**
 * define express app
 * with the routes for each crud operation 
 */
 
const app = express();
//set port
app.set('port', 4000);

//support JSON encoded bodies
app.use( bodyParser.json() );

//support URL-encoded bodies
app.use(bodyParser.urlencoded({     
      extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

//read all routes
app.get('/', function(req, res) {
    console.log("Client Connected at root routes, sending the whole database collection ... \n" + JSON.stringify(database));
    res.send(database);
});

//create operation routes
app.post('/add', function(req, res) {
    const query = req.body;
    console.log("Client request to add new task : /n" + JSON.stringify(query));
    const addResult = addTask(query);
    res.send(addResult);
});

// update operation routes
app.post('/update', function(req, res) {
    const query = req.query;
    console.log("Client request to update existing task : /n" + JSON.stringify(query));
    const updatedResult = updateTask(query);
    res.send(updatedResult);
});

// delete operation routes
app.delete('/:id', function(req, res) {
    const id = req.params.id;
    console.log("Client request to delete existing task with id: " + id);
    const deletedResult = deleteTask(id);
    res.send(deletedResult);
});


//up the server
app.listen(app.get('port'), () => {
    console.log('TODO server is running in http://localhost:' + app.get('port'));
});