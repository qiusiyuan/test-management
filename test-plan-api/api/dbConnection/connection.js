const MongoClient = require('mongodb').MongoClient
const config = require('../../config/config').getconfig();
class Connection {
    static connectToMongo() {
        if ( this.db ) return Promise.resolve(this.db)
        return MongoClient.connect(this.url, this.options)
            .then((db) => {
              this.db = db.db(config.database)
              this.db.createCollection(config.job)
              .then(res => console.log(config.job, " collection created"))
              .catch((err) => {throw err});
            })
    }
}

Connection.db = null;
Connection.url = config.mondbBaseUrl;
Connection.options = {
    bufferMaxEntries:   0,
    reconnectTries:     5000,
}

module.exports = { Connection }