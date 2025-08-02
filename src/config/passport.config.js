import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { userModel } from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils/hashUtil.js';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'coderSecret';

const initializePassport = () => {

    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET
    };

    passport.use('jwt', new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            const user = await userModel.findById(jwt_payload.id);
            if (!user) return done(null, false);
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }));

    passport.use(
        'register',
        new LocalStrategy(
            { usernameField: 'email', passReqToCallback: true },
            async (req, email, password, done) => {
                try {
                    const { first_name, last_name, age } = req.body;

                    const userExists = await userModel.findOne({ email });
                    if (userExists) return done(null, false);

                    let role = 'user';
                    if (email.includes('@admin')) {
                        role = 'admin';
                    }

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: bcrypt.hashSync(password, 10),
                        role,
                    };

                    const createdUser = await userModel.create(newUser);
                    return done(null, createdUser);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );



    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await userModel.findOne({ email });
                if (!user || !isValidPassword(user, password)) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));
};

export default initializePassport;
