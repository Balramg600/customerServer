let express=require('express');
let app=express();
app.use(express.json());
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD'
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
const port= process.env.PORT || 2411;
app.listen(port, ()=>console.log(`Node app listening on port ${port}!`));

let {customersData}=require('./customerData.js');
let fs=require('fs');
const { json } = require('express');
let fname='customers.json';

app.get("/resetData",function(req, res){
    let data=JSON.stringify(customersData);
    fs.writeFile(fname, data, function(err){
        if(err) res.status(404).send(err);
        else res.send("Data in file is reset");
    });
});

app.get("/customers", (req, res)=>{
    fs.readFile(fname, 'utf-8', (err, data)=>{
        if(err) res.status(404).send(err);
        else {
            let customerArray=JSON.parse(data);
            res.send(customerArray);
        }
    })
})

app.get("/customers/:id", (req, res)=>{
    let id=+req.params.id;
    fs.readFile(fname, "utf-8", (err, data)=>{
        if(err) res.status(404).send(err);
        else{
            let customerArray=JSON.parse(data);
            let customer=customerArray.find(st=>st.id===id);
            if(customer) res.send(customer);
            else res.status(404).send("No Customer found");
        }
    });
});

app.post("/customers", (req, res)=>{
    let body=req.body;
    fs.readFile(fname, 'utf-8', (err, data)=>{
        if(err) res.status(404).send(err);
        else {
            let customerArray=JSON.parse(data);
            customerArray.push(body);
            let data1=JSON.stringify(customerArray);
            fs.writeFile(fname, data1, (err)=>{
                if(err) res.status(404).send(err);
                else res.send(body);
            });
        }
    });
});

app.put("/customers/:id", (req, res)=>{
    let body=req.body;
    let id=req.params.id;

    fs.readFile(fname, 'utf-8', (err, data)=>{
        if(err) res.status(404).send(err);
        else {
            let customerArray=JSON.parse(data);
            let index=customerArray.findIndex(st=>st.id===id);
            if(index>=0){
                let updatedCustomer={...customerArray[index], ...body};
                customerArray[index]=updatedCustomer;
                let data1=JSON.stringify(customerArray);
                fs.writeFile(fname, data1, (err)=>{
                    if(err) res.status(404).send(err);
                    else res.send(updatedCustomer);
                })
            }
            else res.status(404).send("No Customer Found")
        }
    });
});

app.delete("/customers/:id", (req, res)=>{
    let id=req.params.id;
    fs.readFile(fname, 'utf-8', (err, data)=>{
        if(err) res.status(404).send(err);
        else {
            let customerArray=JSON.parse(data);
            let index=customerArray.findIndex(st=>st.id===id);
            if(index>=0){
                let deletedCustomer=customerArray.splice(index, 1);
                let data1=JSON.stringify(customerArray);
                fs.writeFile(fname, data1, (err)=>{
                    if(err) res.status(404).send(err);
                    else res.send(deletedCustomer);
                })
            }
            else res.status(404).send("No Customer Found")
        }
    });
});