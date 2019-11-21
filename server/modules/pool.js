const pg = require( 'pg' );

// db stuff
const Pool = pg.Pool;
const pool = new Pool({
    database: 'music_library',
    host: 'localhost',
    port: 5432,
    max: 12,
    idleTimeoutMillis: 30000
}); // end pool

pool.on('connect', ()=>{
    console.log( 'connected to db' );
})

module.exports = pool;