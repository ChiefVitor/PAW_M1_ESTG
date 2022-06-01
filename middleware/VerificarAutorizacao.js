module.exports =  async function(req, res, next){
    if(req.isAuthenticated()){
         const user = req.user;
         if(user.role==='admin' || user.role === 'staff'){
             next();
         }else{
              res.redirect('back');
         }
         if(user.role === 'customer'){
            res.redirect('/users/login');
         }
    }
};