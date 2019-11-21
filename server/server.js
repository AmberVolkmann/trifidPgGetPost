// requires
const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
const pool = require('./modules/pool');

// uses
app.use( express.static( 'server/public' ) ) ;
app.use( bodyParser.urlencoded( { extended: true } ) );



// globals
const port = 5001;

// server up
app.listen( port, ()=>{
    console.log( 'server up on:', port );
}) //end server up  

app.get( '/songs', ( req, res )=>{
    console.log( 'in /songs GET' );
    /// SQL: SELECT * FROM songs
    let queryString = 'SELECT * FROM songs ORDER BY rank ASC';
    pool.query( queryString ).then( (result)=>{
        res.send( result.rows );
    }).catch( ( err )=>{
        console.log( 'ERROR GETTING SONGS --------------->', err );
        res.send( 400 );
    })
}) // end /songs GET

app.post( '/songs', ( req, res )=>{
    console.log( 'POST hit:', req.body );
    // INSERT INTO "songs"("rank", "artist", "track", "published") VALUES(418, 'Fine Young Cannibals', 'She Drives Me Crazy', '1/1/1989');
    let queryString = `INSERT INTO "songs"("rank", "artist", "track", "published") 
        VALUES( $1, $2, $3, $4 );`
    pool.query( queryString, [ req.body.rank, req.body.artist, req.body.track, req.body.published ] ).then( ( result )=>{
        console.log( 'track inserted' );
        res.sendStatus( 201 );
    }).catch( ( err )=>{
        console.log( 'ERROR INSERTING TRACK -------------->', err );
        res.sendStatus( 400 );
    }) //end query
})

//Delete a song by ID
app.delete('/songs/:id', (req,res)=>{
    console.log('DELETE hit id=', req.params.id)
    let queryString = `DELETE FROM "songs" WHERE "id"=$1;`;
    pool.query( queryString, [req.params.id] ).then(result => {
        res.sendStatus(200);
    }).catch(error =>{
        console.log('error deleteing track ----------->', error);
        res.sendStatus(400);
    })
    
})

//Modify the rank of our song
app.put('/songs/:id', (req, res) => {
    console.log(`PUT hit id =`, req.params.id, req.body);
    let direction = req.body.direction;
    // in req.body.direction should be 'up' or 'down'
    let sqlText
    if (direction === 'up'){
        sqlText =`UPDATE "songs" SET rank=rank+1 WHERE id =$1`;
    } else if (direction === 'down'){
        sqlText =`UPDATE "songs" SET rank=rank-1 WHERE id =$1`;
    }else{
        res.sendStatus(500);
    }pool.query( sqlText, [req.params.id] ).then(response => {
        res.sendStatus(200);
    }).catch(error =>{
        console.log('error moving track ----------->', error);
        res.sendStatus(400);

    })
    
})