interface User {
  name: string;
  email: string;
  password: string;
}

const user1 = {
  name: 'Admin',
  email: 'admin@mail.projectname',
  password: 'Abc12345',
};

const user2 = {
  name: 'User',
  email: 'user@mail.projectname',
  password: 'Abc12345',
};

export const usersSeed: User[] = [user1, user2];
