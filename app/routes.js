var User_route = require('./routes/route_user');
var Teacher_route = require('./routes/route_teacher');
var Learner_route = require('./routes/route_learner');
var Lesson_route = require('./routes/route_lesson');

module.exports = function (app, passport) {
    // =====================================
    // LOGIN ===============================
    // =====================================
    app.post('/login', already_logged_in, function (req, res, next) {
        passport.authenticate('local-login', {session: true}, function (err, user, info) {
            if (err)return next(err);
            if (user === false) {
                return res.send(401, info);
            } else {
                req.logIn(user, function (err) {
                    if (err) {
                        return res.send({'status': 'err', 'message': err.message});
                    }
                    req.app.set('user_logged_in', user._id);
                    return res.send(200, user);
                });
            }
        })(req, res, next);
    });

    app.post('/signup', isLoggedIn, function (req, res, next) {
        passport.authenticate('local-signup', function (err, user, info) {
            if (err) return next(err);
            if (user === false) {
                return res.send(404, info);
            } else {
                return res.send(200, user);
            }
        })(req, res, next);
    });

    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/user', isLoggedIn, User_route.findAll);
    app.get('/userItem/:id', isLoggedIn, User_route.findByItemId);
    app.get('/user/:id', isLoggedIn, User_route.findById);
    app.put('/user/:id', isLoggedIn, User_route.updateUser);
    app.delete('/user/:id', isLoggedIn, User_route.deleteUser);

    app.post('/teacher', isLoggedIn, Teacher_route.addTeacher);
    app.get('/teacher/:id', isLoggedIn, Teacher_route.findById);
    app.get('/teacher', isLoggedIn, Teacher_route.findAll);
    app.put('/teacher/:id', isLoggedIn, Teacher_route.updateTeacher);
    app.delete('/teacher/:id', isLoggedIn, Teacher_route.deleteTeacher);

    app.post('/learner', isLoggedIn, Learner_route.addLearner);
    app.get('/learner', isLoggedIn, Learner_route.findAll);
    app.get('/learner/:id', isLoggedIn, Learner_route.findById);
    app.put('/learner/:id', isLoggedIn, Learner_route.updateLearner);
    app.delete('/learner/:id', isLoggedIn, Learner_route.deleteLearner);

    app.post('/lesson', isLoggedIn, Lesson_route.addLesson);
    app.get('/lesson', isLoggedIn, Lesson_route.findAll);
    app.get('/lesson/:id', isLoggedIn, Lesson_route.findById);
    app.put('/lesson/:id', isLoggedIn, Lesson_route.updateLesson);
    app.delete('/lesson/:id', isLoggedIn, Lesson_route.deleteLesson);

    /*
    app.get('/teacher/:id', already_logged_in, Teacher_route.findById);
    app.put('/teacher/:id', already_logged_in, Teacher_route.updateUser);
    app.delete('/teacher/:id', already_logged_in, Teacher_route.deleteUser);
    */

    // =====================================
    // ============= LOGOUT ================
    // =====================================
    app.post('/loggin_out', isLoggedIn, User_route.logOut);
    //app.all('*', isLoggedIn);

    // route middleware to make sure
    function isLoggedIn(req, res, next) {
        // if us/**/er is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        req.logout();
        res.send(401, 'Session Expired');
    }

    function already_logged_in(req, res, next) {
        if (!req.isAuthenticated()) return next();
        console.log('You are already logged in with this Browser, please use a different one. Thanks!');
        res.send(499, 'You are already logged in with this Browser, please use a different one. Thanks!');
    }
};
