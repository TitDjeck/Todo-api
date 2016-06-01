module.exports = function(db){
    return {
        requireAuthentication: function(req, res, next){
            var token = req.get('Auth');
            
            db.user.findByToken(token)
                .then(function(data){
                    req.user = data;
                    next();
                })
                .catch(function(error){
                    res.status(401).send();
                });
        }
    };
};