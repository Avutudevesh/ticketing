import mongoose from 'mongoose';
import { Password } from '../utils/password';

interface UserAttrs {
  email: string,
  password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(userAttrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string,
  password: string
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
},
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret.__id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
})

userSchema.statics.build = (userAttrs: UserAttrs) => {
  return new User(userAttrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };