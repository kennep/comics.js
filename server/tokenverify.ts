import * as jwt from 'jsonwebtoken'
import * as request from 'request';

var google_certs_url = 'https://www.googleapis.com/oauth2/v1/certs'
var client_id = '442029269791-mft6hqfi8ofrl246lae5eo7bg6olt9oq.apps.googleusercontent.com'
var last_downloaded = 0;
var google_keys = null;


function updateGoogleKeys(errorCallback, resultCallback) {
    var now = new Date().getTime();
    if(now - last_downloaded > 3600000) {
        console.log("Downloading keys from " + google_certs_url);
        request(google_certs_url, function(error, response, body) {
            if(error) {                
                errorCallback(error);
            } else {
                last_downloaded = now;
                google_keys = JSON.parse(body);
                resultCallback(google_keys);
            }
        })
    } else {
        resultCallback(google_keys);
    }
}

export function verifyToken(token, done) {
    updateGoogleKeys((error)=> {
        console.error("Error updating google keys: " + error);
        done(null);
    }, (google_keys) => {
        var gk = Object.keys(google_keys);
        for(var i=0; i<gk.length; ++i) {
            var key = google_keys[gk[i]];
            try {
                done(jwt.verify(token, key, {
                    algorithms: ['RS256'],
                    audience: client_id,
                    issuer: 'accounts.google.com'
                }));
                return;
            } catch(e) {
                if(e.message !== 'invalid signature') {
                    console.error(e);
                }
            }
        }
        done(null);        
    });
}

export function verifyUser(authorization, done) {
    if(authorization && authorization.indexOf('Bearer ')==0) {
        verifyToken(authorization.split(' ', 2)[1], (token) => {
            if(token && token['email'] === 'kenneth@wangpedersen.com') {
                done(token);  
            } else {
                console.log("Invalid user: ");
                console.dir(token);
                done(null);
            }
        });
    } else {
        done(null);
    }
}