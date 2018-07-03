var express = require('express');
var dotenv = require('dotenv');
dotenv.load();
var request = require("request");
var path = require("path");
var randomWords = require('random-words');
var amazon = require('amazon-product-api');
var KeenTracking = require('keen-tracking');
var cors = require('cors');
var helmet = require('helmet')
var listnames = ['cinema', 'movie', 'film', 'theater', 'camera', 'hollywood', 'popcorn', 'candy', 'megaplex', 'imax', 'premiere', 'motion', 'frame', 'flick', 'animation', 'projector', 'release', 'screen', 'reel', 'still', 'storyboard', 'screenplay', 'studio', 'stunt', 'star', 'lead', 'actor', 'actress', 'director', 'producer', 'nacho', 'boxoffice', 'dialog', 'script', 'cinematic', 'cast', 'lights', 'scene', 'outtake', 'filmstar', 'remake', 'trilogy', 'sequel', 'butter', 'light', 'bulb', 'ticket', 'stub', 'que', 'lens', 'preview', 'genres', 'documentary', 'drama', 'comedy', 'horror'];

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


//Data found in Amazon Affiliate website
var client = amazon.createClient({
    awsId: process.env.AWS_ID,
    awsSecret: process.env.AWS_SECRET,
    awsTag: process.env.AWS_TAG
});

var app = express();
app.use(helmet());
app.use(express.json());


env = process.env.NODE_ENV || 'development';

var forceSsl = function (req, res, next) {
   if (req.headers['x-forwarded-proto'] !== 'https') {
       console.log(req.get('Host'));
       if(req.get('Host') == 'ene.canvas23.com' || req.get('Host') == 'ene.herokuapp.com')
       {
            return res.redirect(['https://', 'eande.canvas23.com', req.url].join(''));
       }
       else{
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }

   }
   return next();
};
if (env === 'production') {
    app.use(forceSsl);
}





var port = 5700;
app.listen(process.env.PORT || port, function () {
    console.log('Running REST HTTPS server on port: ' + port);
});

app.use(express.static(__dirname + '/dist'));


app.get('/', function (request, response) {
    
    response.sendFile(path.resolve(__dirname, 'index.html'));
});

const authCode = process.env.THEMOVIEDB_TOKEN;

app.get('/api/request_id', function (req, res) {

    var randomNum = Math.floor(56) * Math.random();
    randomNum = Math.round(randomNum);
    var accountID = Math.random()*100000;
    accountID = Math.floor(accountID);
    accountID = Math.round(accountID);

    accountID = listnames[randomNum] + accountID;
    console.log(accountID);
    res.send(accountID)
});



app.get('/api/movie_data/:year/:id', function (req, res) {

    var options = {
        method: 'GET',
        cache: false,
        url: 'https://api.themoviedb.org/3/search/movie?api_key=' + authCode + '&query=' + req.params.id + '&primary_release_year=' + req.params.year
        // '
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        res.send(body);
    });

});

app.get('/api/detailed_movie_data/:id', function (req, res) {

    var url = 'https://api.themoviedb.org/3/movie/' + req.params.id + '?api_key=' + authCode + '&language=en-US&append_to_response=credits,similar'
    var options = {
        method: 'GET',
        cache: false,
        url: url
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var newBody = {};
        body = JSON.parse(body);
        body.credits.crew.forEach(function(entry){
            if (entry.job === 'Director') {
                body.director = entry.name;
            }
        })
        if(body.credits.cast.length > 0){
            body.cast = [body.credits.cast[0], body.credits.cast[1], body.credits.cast[2]];
        }
        body.year = body.release_date.substring(0, 4);
        if(body.similar.results.length > 0){
            body.related_movies = [body.similar.results[0], body.similar.results[1], body.similar.results[2], body.similar.results[3], body.similar.results[4], body.similar.results[5]]
            body.related_movies1_2 = [body.similar.results[0], body.similar.results[1]];
            body.related_movies3_4 = [body.similar.results[2], body.similar.results[3]];
            body.related_movies5_6 = [body.similar.results[4], body.similar.results[5]];
        }
        res.send(body);
    });

});

app.get('', function (req, res) {
    res.redirect('/');
});

app.get('/movies', function (req, res) {   
    res.redirect('/');
});
app.get('/welcome', function (req, res) {
    res.redirect('/');
});
app.get('/convert', function (req, res) {
    res.redirect('/');
});
app.get('/welcome/register', function (req, res) {
    res.redirect('/');
});

app.get('/movies/info', function (req, res) {
    res.redirect('/');
});
app.get('/welcome/retrieve', function (req, res) {
    res.redirect('/');
});

app.get('/api/amazon_data/:year/:title', function (req, res) {


    // res.send('Done.')

    client.itemSearch({
        Title: req.params.title,
        Year: req.params.year,
        // director: req.params.director,
        searchIndex: 'DVD'
    }).then(function (results) {
        res.send(results);
    }).catch(function (err) {
        console.log(JSON.stringify(err));
    });

})

app.get('/api/random_movie/:id', function (req, res) {

    var options = {
        method: 'GET',
        cache: false,
        url: 'http://www.omdbapi.com/?i=' + req.params.id + '&apikey=' + authCode
        // '
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.send(body);
    });
})
app.get('*', function (req, res) {
    res.redirect('/');
});

var keenioprojectid = process.env.KEEN_IO_PROJECT_ID;
var keeniowritekey = process.env.KEEN_IO_WRITE_KEY;


app.post('/api/gather/movie_clicked', cors(), function (req, res) {

    // console.log(req.body)
    // Configure a client instance
    var client = new KeenTracking({
        projectId: keenioprojectid,
        writeKey: keeniowritekey
    });

    // Record an event
    
    client.recordEvent('movie_clicked', {
        movie: {
            title: req.body.title,
            production: req.body.production_companies[0].name,
            director: req.body.director,
            year: req.body.year,
            rating: req.body.vote_average,
            budget: req.body.budget
        }
    });
})

app.post('/api/gather/movie_added', cors(), function (req, res) {

    // console.log(req.body)
    // Configure a client instance
    var client = new KeenTracking({
        projectId: keenioprojectid,
        writeKey: keeniowritekey
    });

    // Record an event
    client.recordEvent('movie_added', {
        movie: {
            title: req.body.title,
            rating: req.body.vote_average
        }
    });
})

app.post('/api/gather/app', cors(), function (req, res) {

    // console.log(req.body)
    // Configure a client instance
    var client = new KeenTracking({
        projectId: keenioprojectid,
        writeKey: keeniowritekey
    });

    // Record an event
    client.recordEvent('app_opened', {
        app: req.body       
    })
})

app.post('/api/gather/acquision', cors(), function (req, res) {

    // Configure a client instance
    var client = new KeenTracking({
        projectId: keenioprojectid,
        writeKey: keeniowritekey
    });

    // Record an event
    client.recordEvent('acquision', {
        acquision: true,
        movie: req.body.movie,
        user: req.body.user     
    })
})

app.post('/api/gather/first', cors(), function (req, res) {

    // console.log(req.body)
    // Configure a client instance
    var client = new KeenTracking({
        projectId: keenioprojectid,
        writeKey: keeniowritekey
    });

    // Record an event
    client.recordEvent('first_movie', {
        acquision: true,
        movie: req.body.first_movie,
        user: req.body.user     
    })
})