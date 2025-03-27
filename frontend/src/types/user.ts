export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  avatar?: string;
  name?: string;
  gender?: string;
  dob?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  firstName?: string;
  lastName?: string;
}
