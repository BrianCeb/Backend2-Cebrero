import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { userModel } from '../dao/models/userModel.js';

const JWT_SECRET = 'coderSecret'; 

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};

passport.use('jwt', new JwtStrategy(options, async (jwt_payload, done) => {
    try {
        const user = await userModel.findById(jwt_payload.id);
        if (!user) return done(null, false);
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;
