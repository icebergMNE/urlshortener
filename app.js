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
            // res.send({
            //     url:req.params.string,
            //     count:data,
            //     short: req.host
            // })
        })
        
    }
    else{
        res.send({
            error: 'please user valid url with http/https'
        })
    }
})


app.get('/:short', (req,res)=>{

    console.log('druga ruta')

    urlCollection.findOne({short : req.params.short }, (err,data)=>{
        if(err) {
            console.log('ovo je error' + err)
            console.log(data)        
        }
        else{
            res.redirect(data.url)            
        }
        
        // res.send(data.url)
    })
    // res.send(req.params.short)
})




app.listen(process.env.PORT || 8080)

let urlTest = url => {

    let expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
    let regex = new RegExp(expression)

    if (url.match(regex)) {
        return true
    } else {
        return false
    }
}