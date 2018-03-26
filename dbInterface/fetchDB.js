
const sqlite3 = require('sqlite3').verbose();

let selectAllFish;

const closeDB = (db) => {
    if (!db) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
            console.error(err.message);
            reject(err.message);
            }
            console.log('Close the database connection.');
            resolve();
        });
    })
   
}

const initDB = () => {
    return new Promise((resolve, reject) => {
        db = new sqlite3.cached.Database('./db/AquariumLog.sqlite', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
              reject(err.message);
              return;
            }
            console.log('Connected to the AquariumLog database.');
            selectAllFish = `SELECT ZCOMMONNAME as name,
            ZBODYTYPE as bodyType,
            ZMAXSIZE as maxSize,
            ZDHHIGH as dhHigh,
            ZDHLOW as dhLow,
            ZPHHIGH as phHigh,
            ZPHLOW as phLow,
            ZTEMPHIGH as tempHigh,
            ZTEMPLOW as tempLow,
            ZGENUS as genus,
            ZSPECIES as species,
            ZFAMILY as family,
            ZNOTES as notes,
            ZPICTURE as imageURI FROM ZFISH ORDER BY name`;

            resolve(db);
          });
    })
   
}

const getAllFish = async (db) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(selectAllFish, (err, rows) => {
                if (err){
                    reject(err.message);
                }
                resolve(rows);
            });
        })
      
    });
   
};

module.exports = {
    initDB,
    closeDB,
    getAllFish
}
