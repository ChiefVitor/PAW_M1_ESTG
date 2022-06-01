module.exports = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('error', `Necessita de efetuar login primeiro`);
        res.redirect('/users/login');
    }
};