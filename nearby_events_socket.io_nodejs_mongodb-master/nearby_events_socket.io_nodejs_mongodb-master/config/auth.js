module.exports = {

    'facebookAuth' : {
        'clientID'      : '727774007152-k7c5qf05915252olmdac35gv0ufgh3mh.apps.googleusercontent.com', // your App ID
        'clientSecret'  : 'talU3dcH6ga9CKaa-w4nK3fS', // your App Secret
        'callbackURL'   : 'http://localhost:8080/api/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/api/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '727774007152-k7c5qf05915252olmdac35gv0ufgh3mh.apps.googleusercontent.com', // your App ID
        'clientSecret'  : 'talU3dcH6ga9CKaa-w4nK3fS', // your App Secret
        'callbackURL'   : 'https://trip-split.herokuapp.com/api/auth/google/callback'
    }

};
