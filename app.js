require('dotenv').config();
const express = require('express')
const app = express()
const mongo = require('mongodb').MongoClient

const url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds151452.mlab.com:51452/apis`

mongo.connect(url, function(err, client) {
    
    if(err){
        throw err
    }
    else{
        console.log('db working')
    }

    db = client.db('apis')
    urlCollection = db.collection('url')
    
    // urlCollection.find().toArray((err, docs)=>{
    //     console.log(docs)
    // })
})

app.get('/', (req, res)=> {
    res.send('url shortener service working')
})

app.get('/api/:string(*)', (req,res)=>{

    console.log(req.params.string)

    if(urlTest(req.params.string)){

        urlCollection.count((err,data)=>{

            if(err) throw err

            urlCollection.insertOne({
                'url':req.params.string,
                'short':(data + 1).toString(16)
            }, (err,data)=>{
                if(err){
                    res.send(err.message)
                }

                else{
                    console.log('data is')
                    console.log(data.ops)

                    res.send({
                        url:data.ops[0].url,
                        short: req.hostname +  '/' + data.ops[0].short
                    })
                }
                
            })
        })
        
    }
    else{
        res.send({
            error: 'please user valid url with http/https'
        })
    }
})

app.get('/:short?', (req,res)=>{

    console.log('druga ruta')

    urlCollection.findOne({short : req.params.short.toString() }, (err,data)=>{
        if(err) {
            res.send(err.message)
            console.log('ovo je error' + err)
            console.log(data)        
        }
        else{
            console.log(data)
            if(data){
                res.redirect(data.url)   
            }
            else{
                res.send({
                    error: 'url not found in database'
                })
            }
                     
        }
    })
})








app.listen(process.env.PORT || 3005)

let urlTest = url => {

    let expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
    let regex = new RegExp(expression)

    if (url.match(regex)) {
        return true
    } else {
        return false
    }
}