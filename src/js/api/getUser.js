import User from './User';

export default function getUser() {
  return new Promise((resolve) => {
    resolve(User.current());
  });
}
